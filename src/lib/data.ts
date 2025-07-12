import { db } from './firebase-admin';
import type { DataSnapshot } from 'firebase-admin/database';
import { fetchMetadata } from './scraper';
import { format } from 'date-fns';
import { auth } from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';

export interface Link {
  id: string;
  longUrl: string;
  createdAt: number;
  expiresAt: number; // timestamp, -1 for no expiry
  title?: string;
  description?: string;
  ogImage?: string;
  twitterImage?: string;
  userId: string;
  clickCount: number;
}

const RATE_LIMIT = 5; // 5 requests per day for unverified/anonymous users

/**
 * Checks if a user is within their daily usage limit.
 * @param userId The UID of the user (anonymous or registered).
 * @returns A promise that resolves to true if the user is allowed to proceed, false otherwise.
 */
export const checkRateLimit = async (userId: string): Promise<boolean> => {
    // For this MVP, we will assume registered users have a higher or no limit.
    // The check only applies to users who are not verified.
    // We can fetch the user record to check their status (e.g., emailVerified).
    try {
        const user = await auth().getUser(userId);
        if (user.emailVerified) {
            return true; // Verified users bypass this specific limit.
        }
    } catch (error) {
        // User not found or other error, proceed with limit check for anonymous users.
    }
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const path = `limits/${today}/users/${userId}`;
    
    const snapshot = await db.ref(path).once('value');
    const currentCount = snapshot.val() || 0;

    return currentCount < RATE_LIMIT;
};

/**
 * Increments the usage count for a given user for the current day.
 * @param userId The UID of the user to increment usage for.
 */
export const incrementUsage = async (userId: string): Promise<void> => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const userPath = `limits/${today}/users/${userId}`;
    const userRef = db.ref(userPath);
    
    try {
        // Use a transaction to safely increment the counter.
        await userRef.transaction((currentValue) => (currentValue || 0) + 1);
    } catch (error) {
        // Log the error but don't block the user's request if this fails.
        console.error("Failed to increment usage counter:", error);
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
    
    // Unverified (including anonymous) users' links expire in 7 days. Verified users' links don't expire.
    const expiresAt = isVerifiedUser ? -1 : now + 7 * 24 * 60 * 60 * 1000;

    let metadata;
    try {
        metadata = await fetchMetadata(longUrl);
    } catch (error) {
        console.error("Failed to fetch metadata:", error);
        // Provide sensible defaults if metadata fetching fails
        metadata = {
            title: "Link via mnfy.in",
            description: "A shortened link created with MiniFyn.",
            ogImage: undefined,
            twitterImage: undefined
        }
    }

    const newLink: Omit<Link, 'id'> = {
        longUrl,
        createdAt: now,
        expiresAt,
        title: metadata.title,
        description: metadata.description,
        ogImage: metadata.ogImage,
        twitterImage: metadata.twitterImage,
        userId: userId,
        clickCount: 0
    };

    await db.ref(`urls/${slug}`).set(newLink);
    
    return { ...newLink, id: slug };
}

export const getLinkBySlug = async (slug: string): Promise<Link | null> => {
    const snapshot: DataSnapshot = await db.ref(`urls/${slug}`).once('value');
    
    if (!snapshot.exists()) {
        return null;
    }

    const linkData = snapshot.val() as Omit<Link, 'id'>;
    
    // Check for expiration
    if (linkData.expiresAt !== -1 && Date.now() > linkData.expiresAt) {
        // Asynchronously delete the expired link to clean up the database
        db.ref(`urls/${slug}`).remove().catch(err => console.error("Failed to delete expired link:", err));
        return null;
    }
    
    return { id: slug, ...linkData };
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
        
        if (user.emailVerified) {
            return user;
        }

        return null;

    } catch (error) {
        console.error("Error during API key validation:", error);
        return null;
    }
}
