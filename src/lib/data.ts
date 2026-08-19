

import { db, auth } from './firebase-admin';
import type { DataSnapshot } from 'firebase-admin/database';
import { fetchMetadata, type Metadata } from './scraper';
import { format, addDays } from 'date-fns';
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

export async function getUserPlan(userId: string): Promise<UserPlan> {
    if (userId === SUPER_USER_ID) return 'admin';
    
    try {
        const user = await auth.getUser(userId);
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
                await auth.setCustomUserClaims(userId, { plan: 'free' });
                await auth.revokeRefreshTokens(userId);

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


export function encodeRtdbKey(key: string): string {
    if (!key) return 'unknown';
    return key
        .replace(/%/g, '%25')
        .replace(/\./g, '%2E')
        .replace(/#/g, '%23')
        .replace(/\$/g, '%24')
        .replace(/\[/g, '%5B')
        .replace(/\]/g, '%5D')
        .replace(/\//g, '%2F');
}

export function decodeRtdbKey(key: string): string {
    if (!key) return '';
    return key
        .replace(/%2F/g, '/')
        .replace(/%5D/g, ']')
        .replace(/%5B/g, '[')
        .replace(/%24/g, '$')
        .replace(/%23/g, '#')
        .replace(/%2E/g, '.')
        .replace(/%25/g, '%');
}

export function parseClientInfo(ua: string | null | undefined): { browser: string; platform: string } {
    if (!ua || ua === 'unknown') return { browser: 'Direct / Unknown', platform: 'Unknown' };
    
    let platform = 'Other';
    if (/iPhone|iPad|iPod/i.test(ua)) platform = 'iOS';
    else if (/Android/i.test(ua)) platform = 'Android';
    else if (/Macintosh|Mac OS X/i.test(ua)) platform = 'macOS';
    else if (/Windows NT|Windows/i.test(ua)) platform = 'Windows';
    else if (/Linux/i.test(ua)) platform = 'Linux';
    
    let browser = 'Other';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/Chrome|CriOS/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) browser = 'Safari';
    else if (/Firefox|FxiOS/i.test(ua)) browser = 'Firefox';
    else if (/Opera|OPR\//i.test(ua)) browser = 'Opera';
    else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';

    return { browser, platform };
}

export function getCleanReferrer(ref: string | null | undefined): string {
    if (!ref || ref === 'direct' || ref === 'unknown') return 'Direct';
    try {
        const url = new URL(ref);
        return url.hostname.replace(/^www\./, '') || 'Direct';
    } catch {
        return ref.replace(/^https?:\/\//, '').split('/')[0] || 'Direct';
    }
}

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

    // Strip empty / redundant fields to keep DB footprint minimal
    const cleanSeo: Record<string, string> = {};
    if (fetchedMetadata.ogImage) cleanSeo.ogImage = fetchedMetadata.ogImage;
    if (fetchedMetadata.twitterImage) cleanSeo.twitterImage = fetchedMetadata.twitterImage;
    if (fetchedMetadata.ogTitle && fetchedMetadata.ogTitle !== primaryTitle) cleanSeo.ogTitle = fetchedMetadata.ogTitle;
    if (fetchedMetadata.ogDescription && fetchedMetadata.ogDescription !== primaryDescription) cleanSeo.ogDescription = fetchedMetadata.ogDescription;
    if (fetchedMetadata.ogType) cleanSeo.ogType = fetchedMetadata.ogType;
    if (fetchedMetadata.canonical) cleanSeo.canonical = fetchedMetadata.canonical;

    const newLinkData: any = {
        longUrl,
        createdAt: now,
        expiresAt,
        userId: userId,
        clickCount: 0,
        title: primaryTitle,
        description: primaryDescription,
        plan: plan,
    };

    if (Object.keys(cleanSeo).length > 0) {
        newLinkData.seo = cleanSeo;
    }

    if (fetchedMetadata.ogType === 'article') {
        if (fetchedMetadata.articleAuthor) {
            newLinkData.articleAuthor = fetchedMetadata.articleAuthor;
        }
        if (fetchedMetadata.articlePublishedTime) {
            newLinkData.articlePublishedTime = fetchedMetadata.articlePublishedTime;
        }
    }

    await db.ref(`urls/${slug}`).set(newLinkData);
    
    return { ...newLinkData, seo: cleanSeo as Metadata, id: slug };
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
        clickCount: linkData.clickCount || 0,
        title: linkData.title || linkData.seo?.title,
        description: linkData.description || linkData.seo?.description,
        ogImage: linkData.seo?.ogImage,
        twitterImage: linkData.seo?.twitterImage,
        seo: linkData.seo || {},
        plan: linkData.plan || 'anonymous',
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

        const user = await auth.getUser(uid);
        
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

export interface ClickData {
    userAgent?: string;
    ip?: string;
    referer?: string;
    language?: string;
    country?: string | null;
    browser?: string;
    platform?: string;
}

export const recordClick = async (slug: string, clickData: ClickData): Promise<void> => {
    try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const linkRef = db.ref(`urls/${slug}`);
        const summaryRef = db.ref(`analytics_summary/${slug}/${today}`);

        const { browser, platform } = (clickData.browser && clickData.platform)
            ? { browser: clickData.browser, platform: clickData.platform }
            : parseClientInfo(clickData.userAgent);

        const country = clickData.country || (clickData.ip ? await getCountryFromIP(clickData.ip) : null) || 'Unknown';
        const referrer = getCleanReferrer(clickData.referer);

        const encodedReferrer = encodeRtdbKey(referrer);
        const encodedBrowser = encodeRtdbKey(browser);
        const encodedPlatform = encodeRtdbKey(platform);
        const encodedCountry = encodeRtdbKey(country);

        // Update overall clickCount and daily summary bucket concurrently
        await Promise.all([
            linkRef.child('clickCount').transaction((count) => (count || 0) + 1),
            summaryRef.transaction((current) => {
                const data = current || {
                    clicks: 0,
                    referrers: {},
                    browsers: {},
                    platforms: {},
                    countries: {},
                };
                data.clicks = (data.clicks || 0) + 1;
                data.referrers = data.referrers || {};
                data.referrers[encodedReferrer] = (data.referrers[encodedReferrer] || 0) + 1;
                data.browsers = data.browsers || {};
                data.browsers[encodedBrowser] = (data.browsers[encodedBrowser] || 0) + 1;
                data.platforms = data.platforms || {};
                data.platforms[encodedPlatform] = (data.platforms[encodedPlatform] || 0) + 1;
                data.countries = data.countries || {};
                data.countries[encodedCountry] = (data.countries[encodedCountry] || 0) + 1;
                return data;
            }),
        ]);
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

