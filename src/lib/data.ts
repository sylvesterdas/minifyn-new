import { db } from './firebase-admin';
import type { DataSnapshot } from 'firebase-admin/database';
import { fetchMetadata, type Metadata } from './scraper';
import { format } from 'date-fns';
import { auth } from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';
import { SUPER_USER_ID } from './config';

export interface Link {
  id: string;
  longUrl: string;
  createdAt: number;
  expiresAt: number; // timestamp, -1 for no expiry
  userId: string;
  clickCount: number;
  title?: string;
  description?: string;
  ogImage?: string;
  twitterImage?: string;
  seo: Metadata;
}

const ANON_RATE_LIMIT = 5; // 5 requests per day for unverified/anonymous users
const API_RATE_LIMIT = 1000; // 1000 requests per day for API users
const API_REQUEST_INTERVAL = 1000; // 1 second in milliseconds

/**
 * Checks if a user is within their usage limits (both daily quota and time-based).
 * @param userId The UID of the user (anonymous or registered).
 * @param isApiCall A boolean indicating if the check is for an API call.
 * @returns A promise that resolves to true if the user is allowed to proceed, false otherwise.
 */
export const checkRateLimit = async (userId: string, isApiCall: boolean): Promise<boolean> => {
    // Super users bypass all limits
    if (userId === SUPER_USER_ID) {
        return true;
    }
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (isApiCall) {
        // Time-based throttling for API calls
        const lastRequestRef = db.ref(`last_request_time/api/${userId}`);
        const lastRequestSnapshot = await lastRequestRef.once('value');
        const lastRequestTime = lastRequestSnapshot.val() || 0;
        
        if (Date.now() - lastRequestTime < API_REQUEST_INTERVAL) {
            console.log(`User ${userId} rate-limited due to frequent requests.`);
            return false; // Request is too soon
        }

        // Daily quota check for API calls
        const limit = API_RATE_LIMIT;
        const path = `limits/${today}/api/${userId}`;
        const snapshot = await db.ref(path).once('value');
        const currentCount = snapshot.val() || 0;
        return currentCount < limit;

    } else {
        // Daily quota for non-API (anonymous/unverified web) users
        const limit = ANON_RATE_LIMIT;
        const path = `limits/${today}/users/${userId}`;
        const snapshot = await db.ref(path).once('value');
        const currentCount = snapshot.val() || 0;
        return currentCount < limit;
    }
};

/**
 * Increments the usage count and updates the last request time for a given user.
 * @param userId The UID of the user to increment usage for.
 * @param isApiCall A boolean indicating if the increment is for an API call.
 */
export const incrementUsage = async (userId: string, isApiCall: boolean = false): Promise<void> => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const path = isApiCall ? `limits/${today}/api/${userId}` : `limits/${today}/users/${userId}`;
    const userRef = db.ref(path);
    
    try {
        await userRef.transaction((currentValue) => (currentValue || 0) + 1);
        
        // Also update the last request time for API calls to enable throttling
        if (isApiCall) {
            const lastRequestRef = db.ref(`last_request_time/api/${userId}`);
            await lastRequestRef.set(Date.now());
        }

    } catch (error) {
        console.error(`Failed to increment usage counter for ${isApiCall ? 'API' : 'user'}:`, error);
    }
};


const generateShortCode = (length = 6): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export const isSlugTaken = async (slug: string): Promise<boolean> => {
    const snapshot: DataSnapshot = await db.ref(`urls/${slug}`).once('value');
    return snapshot.exists();
}

interface CreateShortLinkInput {
    longUrl: string;
    userId: string;
    isVerifiedUser: boolean; // This can now refer to email verification or if it's an API user.
}

export const createShortLink = async ({ longUrl, userId, isVerifiedUser }: CreateShortLinkInput): Promise<Link> => {
    let slug;
    do {
        slug = generateShortCode();
    } while (await isSlugTaken(slug));

    const now = Date.now();
    
    const isSuperUser = userId === SUPER_USER_ID;
    // For API users (isVerifiedUser=true) and super users, links don't expire.
    const expiresAt = isVerifiedUser || isSuperUser ? -1 : now + 7 * 24 * 60 * 60 * 1000;

    let metadata: Metadata;
    try {
        metadata = await fetchMetadata(longUrl);
    } catch (error) {
        console.error("Failed to fetch metadata:", error);
        metadata = {
            title: "Link via mnfy.in",
            description: "A shortened link created with MiniFyn.",
        }
    }

    const newLinkData = {
        longUrl,
        createdAt: now,
        expiresAt,
        userId: userId,
        clickCount: 0,
        title: metadata.title,
        description: metadata.description,
        seo: metadata,
    };

    await db.ref(`urls/${slug}`).set(newLinkData);
    
    return { ...newLinkData, id: slug };
}

export const getLinkBySlug = async (slug: string): Promise<Link | null> => {
    const snapshot: DataSnapshot = await db.ref(`urls/${slug}`).once('value');
    
    if (!snapshot.exists()) {
        return null;
    }

    const linkData = snapshot.val();
    
    if (linkData.expiresAt !== -1 && Date.now() > linkData.expiresAt) {
        db.ref(`urls/${slug}`).remove().catch(err => console.error("Failed to delete expired link:", err));
        return null;
    }
    
    return {
        id: slug,
        longUrl: linkData.longUrl,
        createdAt: linkData.createdAt,
        expiresAt: linkData.expiresAt,
        userId: linkData.userId,
        clickCount: linkData.clickCount,
        title: linkData.title || linkData.seo?.title,
        description: linkData.description || linkData.seo?.description,
        ogImage: linkData.seo?.ogImage,
        twitterImage: linkData.seo?.twitterImage,
        seo: linkData.seo,
    };
}

/**
 * Validates an API key and returns the corresponding user if valid.
 * @param apiKey The API key to validate.
 * @returns A promise that resolves to the UserRecord if the key is valid, null otherwise.
 */
export const validateApiKey = async (apiKey: string): Promise<UserRecord | null> => {
    try {
        const apiKeySnapshot = await db.ref(`apikeys/${apiKey}`).once('value');
        
        if (!apiKeySnapshot.exists()) {
            return null;
        }

        const { uid } = apiKeySnapshot.val();

        if (!uid) {
            return null;
        }

        const user = await auth().getUser(uid);
        
        // API key is only valid if the user's email is verified
        if (user.emailVerified) {
            return user;
        }

        return null;

    } catch (error) {
        console.error("Error during API key validation:", error);
        return null;
    }
}

interface ClickData {
    userAgent: string;
    ip: string;
    referer: string;
    language: string;
}

export const recordClick = async (slug: string, clickData: ClickData): Promise<void> => {
    const linkRef = db.ref(`urls/${slug}`);
    
    try {
        // Increment click count atomically
        await linkRef.child('clickCount').transaction((currentValue) => (currentValue || 0) + 1);

        // Add detailed analytics data
        const analyticsRef = db.ref(`analytics/${slug}`).push();
        await analyticsRef.set({
            ...clickData,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error(`Failed to record click for slug ${slug}:`, error);
    }
};
