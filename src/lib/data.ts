

import { db } from './firebase-admin';
import type { DataSnapshot } from 'firebase-admin/database';
import { fetchMetadata, type Metadata } from './scraper';
import { format, addDays } from 'date-fns';
import { auth } from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';
import { SUPER_USER_ID } from './config';
import type { UserProfile } from '@/app/dashboard/settings/actions';
import { getCountryFromIP } from './ip-to-country';

export type UserPlan = 'pro' | 'free' | 'admin' | 'anonymous';

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
  plan: UserPlan;
  articleAuthor?: string;
  articlePublishedTime?: string;
}

const ANON_DAILY_LIMIT = 3;
const FREE_USER_DAILY_LIMIT = 20;
const PRO_USER_DAILY_LIMIT = 100;
const API_REQUEST_INTERVAL = 1000; // 1 second in milliseconds

async function getUserPlan(userId: string): Promise<UserPlan> {
    if (userId === SUPER_USER_ID) return 'admin';
    
    try {
        const user = await auth().getUser(userId);
        const userProfileRef = db.ref(`user_profiles/${userId}`);
        const snapshot = await userProfileRef.once('value');

        if (snapshot.exists()) {
            const profile = snapshot.val();

            // Check for expired "Pro" subscriptions that need to be downgraded.
            // This happens if a user cancels and their billing period ends.
            if (
                profile.plan === 'pro' &&
                profile.subscription &&
                profile.subscription.cancel_scheduled === true &&
                profile.subscription.current_end &&
                profile.subscription.current_end * 1000 < Date.now()
            ) {
                console.log(`[getUserPlan] User ${userId}'s scheduled cancellation is now effective. Downgrading to 'free' plan.`);
                
                await userProfileRef.update({
                    plan: 'free',
                    subscription: null,
                });
                await auth().setCustomUserClaims(userId, { plan: 'free' });
                await auth().revokeRefreshTokens(userId);

                return 'free';
            }
            
            // If not expired, return current plan, otherwise default to anonymous
            return profile.plan || 'anonymous';
        }
        
        // Fallback for users with no profile yet
        return 'anonymous';

    } catch (error) {
        // User is likely anonymous or an error occurred
        return 'anonymous';
    }
}


/**
 * Checks if a user is within their usage limits.
 * @param userId The UID of the user.
 * @param isApiCall A boolean indicating if the check is for an API call.
 * @returns A promise that resolves to true if the user is allowed to proceed, false otherwise.
 */
export const checkRateLimit = async (userId: string, isApiCall: boolean = false): Promise<boolean> => {
    const plan = await getUserPlan(userId);

    // Time-based throttling for API calls
    if (isApiCall) {
        const lastRequestRef = db.ref(`last_request_time/api/${userId}`);
        const lastRequestSnapshot = await lastRequestRef.once('value');
        const lastRequestTime = lastRequestSnapshot.val() || 0;
        
        if (Date.now() - lastRequestTime < API_REQUEST_INTERVAL) {
            console.log(`User ${userId} rate-limited due to frequent requests.`);
            return false;
        }
    }

    if (plan === 'admin') {
        return true;
    }
    
    // Daily quota check for all non-admin plans
    const today = format(new Date(), 'yyyy-MM-dd');
    const path = `daily_limits/${today}/${userId}`;
    const snapshot = await db.ref(path).once('value');
    const currentCount = snapshot.val() || 0;
    
    let limit;
    switch (plan) {
        case 'pro':
            limit = PRO_USER_DAILY_LIMIT;
            break;
        case 'free':
            limit = FREE_USER_DAILY_LIMIT;
            break;
        case 'anonymous':
        default:
            limit = ANON_DAILY_LIMIT;
            break;
    }

    return currentCount < limit;
};

/**
 * Increments the usage count for a given user.
 * @param userId The UID of the user to increment usage for.
 * @param isApiCall A boolean indicating if the increment is for an API call.
 */
export const incrementUsage = async (userId: string, isApiCall: boolean = false): Promise<void> => {
    const plan = await getUserPlan(userId);
    
    if (plan === 'admin') {
        // Admin plan has no limits to increment
        return;
    }
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const usageRef = db.ref(`daily_limits/${today}/${userId}`);
    
    try {
        await usageRef.transaction((currentValue) => (currentValue || 0) + 1);
        if (isApiCall) {
            await db.ref(`last_request_time/api/${userId}`).set(Date.now());
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
    isVerifiedUser?: boolean;
}

export const createShortLink = async ({ longUrl, userId, isVerifiedUser }: CreateShortLinkInput): Promise<Link> => {
    console.log(`[createShortLink] Attempting to create short link for URL: ${longUrl}`);
    let slug;
    do {
        slug = generateShortCode();
    } while (await isSlugTaken(slug));

    const now = Date.now();
    const plan = await getUserPlan(userId);
    
    let expiresAt: number;
    if (plan === 'pro' || plan === 'admin') {
        expiresAt = -1; // Never expires
    } else if (plan === 'free') {
        expiresAt = addDays(now, 60).getTime(); // 60 days for free users
    } else { // anonymous
        expiresAt = addDays(now, 7).getTime(); // 7 days for anonymous users
    }

    let fetchedMetadata: Metadata;
    try {
        fetchedMetadata = await fetchMetadata(longUrl);
        console.log('[createShortLink] Fetched metadata:', fetchedMetadata);
    } catch (error) {
        console.error("Failed to fetch metadata:", error);
        fetchedMetadata = {};
    }

    const primaryTitle = fetchedMetadata.title || fetchedMetadata.ogTitle || fetchedMetadata.twitterTitle || "Link via mnfy.in";
    const primaryDescription = fetchedMetadata.description || fetchedMetadata.ogDescription || fetchedMetadata.twitterDescription || "A shortened link created with MiniFyn.";

    const seoData: Metadata = {
        title: primaryTitle,
        description: primaryDescription,
        ogTitle: fetchedMetadata.ogTitle || '',
        ogDescription: fetchedMetadata.ogDescription || '',
        ogImage: fetchedMetadata.ogImage || '',
        ogType: fetchedMetadata.ogType || '',
        ogUrl: fetchedMetadata.ogUrl || '',
        twitterCard: fetchedMetadata.twitterCard || '',
        twitterTitle: fetchedMetadata.twitterTitle || '',
        twitterDescription: fetchedMetadata.twitterDescription || '',
        twitterImage: fetchedMetadata.twitterImage || '',
        canonical: fetchedMetadata.canonical || '',
        articleAuthor: fetchedMetadata.articleAuthor,
        articlePublishedTime: fetchedMetadata.articlePublishedTime,
    };

    console.log('[createShortLink] SEO data to be stored:', seoData);

    const newLinkData: any = {
        longUrl,
        createdAt: now,
        expiresAt,
        userId: userId,
        clickCount: 0,
        title: primaryTitle,
        description: primaryDescription,
        seo: seoData,
        plan: plan,
    };

    if (fetchedMetadata.ogType === 'article') {
        if (fetchedMetadata.articleAuthor) {
            newLinkData.articleAuthor = fetchedMetadata.articleAuthor;
        }
        if (fetchedMetadata.articlePublishedTime) {
            newLinkData.articlePublishedTime = fetchedMetadata.articlePublishedTime;
        }
    }


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
        plan: linkData.plan || 'free',
        articleAuthor: linkData.articleAuthor,
        articlePublishedTime: linkData.articlePublishedTime,
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
