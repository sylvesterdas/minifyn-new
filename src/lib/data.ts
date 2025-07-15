
import { db } from './firebase-admin';
import type { DataSnapshot } from 'firebase-admin/database';
import { fetchMetadata, type Metadata } from './scraper';
import { format, addDays } from 'date-fns';
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

const ANON_RATE_LIMIT = 3; // 3 requests per day for unverified/anonymous users
const VERIFIED_USER_RATE_LIMIT = 20; // 20 requests per day for verified users (form or API)
const API_REQUEST_INTERVAL = 1000; // 1 second in milliseconds

/**
 * Checks if a user is within their usage limits (both daily quota and time-based).
 * @param userId The UID of the user (anonymous or registered).
 * @param isVerified A boolean indicating if the user is verified.
 * @param isApiCall A boolean indicating if the check is for an API call (for time-based throttling).
 * @returns A promise that resolves to true if the user is allowed to proceed, false otherwise.
 */
export const checkRateLimit = async (userId: string, isVerified: boolean, isApiCall: boolean = false): Promise<boolean> => {
    // Super users bypass all limits
    if (userId === SUPER_USER_ID) {
        return true;
    }
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Time-based throttling for API calls is independent of the daily quota
    if (isApiCall) {
        const lastRequestRef = db.ref(`last_request_time/api/${userId}`);
        const lastRequestSnapshot = await lastRequestRef.once('value');
        const lastRequestTime = lastRequestSnapshot.val() || 0;
        
        if (Date.now() - lastRequestTime < API_REQUEST_INTERVAL) {
            console.log(`User ${userId} rate-limited due to frequent requests.`);
            return false; // Request is too soon
        }
    }

    // Daily quota check
    const limit = isVerified ? VERIFIED_USER_RATE_LIMIT : ANON_RATE_LIMIT;
    const path = `limits/${today}/${userId}`;
    const snapshot = await db.ref(path).once('value');
    const currentCount = snapshot.val() || 0;
    
    return currentCount < limit;
};

/**
 * Increments the usage count and updates the last request time for a given user.
 * @param userId The UID of the user to increment usage for.
 * @param isApiCall A boolean indicating if the increment is for an API call.
 */
export const incrementUsage = async (userId: string, isApiCall: boolean = false): Promise<void> => {
    const today = format(new Date(), 'yyyy-MM-dd');
    // All users, verified or not, use the same path based on their UID.
    const path = `limits/${today}/${userId}`;
    const userRef = db.ref(path);
    
    try {
        await userRef.transaction((currentValue) => (currentValue || 0) + 1);
        
        // Also update the last request time for API calls to enable throttling
        if (isApiCall) {
            const lastRequestRef = db.ref(`last_request_time/api/${userId}`);
            await lastRequestRef.set(Date.now());
        }

    } catch (error) {
        console.error(`Failed to increment usage counter for user ${userId}:`, error);
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
    isVerifiedUser: boolean; 
}

export const createShortLink = async ({ longUrl, userId, isVerifiedUser }: CreateShortLinkInput): Promise<Link> => {
    let slug;
    do {
        slug = generateShortCode();
    } while (await isSlugTaken(slug));

    const now = Date.now();
    
    let expiresAt: number;
    if (userId === SUPER_USER_ID) {
        expiresAt = -1; // Never expires for super user
    } else if (isVerifiedUser) {
        expiresAt = addDays(now, 60).getTime(); // 60 days for verified users
    } else {
        expiresAt = addDays(now, 7).getTime(); // 7 days for anonymous users
    }

    let metadata: Metadata;
    try {
        metadata = await fetchMetadata(longUrl);
    } catch (error) {
        console.error("Failed to fetch metadata:", error);
        metadata = {};
    }

    const newLinkData = {
        longUrl,
        createdAt: now,
        expiresAt,
        userId: userId,
        clickCount: 0,
        title: metadata.title || "Link via mnfy.in",
        description: metadata.description || "A shortened link created with MiniFyn.",
        seo: {
            ...metadata,
            title: metadata.title || "Link via mnfy.in",
            description: metadata.description || "A shortened link created with MiniFyn.",
        },
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

/**
 * Checks if a user has completed the onboarding process.
 * @param uid The user ID to check.
 * @returns A promise that resolves to true if onboarding is complete, false otherwise.
 */
export async function hasCompletedOnboarding(uid: string): Promise<boolean> {
    try {
        const snapshot = await db.ref(`user_profiles/${uid}/onboardingCompleted`).once('value');
        return snapshot.val() === true;
    } catch (error) {
        console.error(`Failed to check onboarding status for user ${uid}:`, error);
        // Fail open: if there's an error, assume they completed it to avoid blocking them.
        return true;
    }
}
