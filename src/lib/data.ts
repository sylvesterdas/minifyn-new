import { db } from './firebase-admin';
import type { DataSnapshot } from 'firebase-admin/database';
import { fetchMetadata } from './scraper';
import { format } from 'date-fns';

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

const RATE_LIMIT = 5; // 5 requests per day for unverified users

export const checkRateLimit = async (userId: string): Promise<boolean> => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const path = `limits/${today}/users/${userId}`;
    
    const snapshot = await db.ref(path).once('value');
    const currentCount = snapshot.val() || 0;

    return currentCount < RATE_LIMIT;
};

export const incrementUsage = async (userId: string): Promise<void> => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const userPath = `limits/${today}/users/${userId}`;
    const userRef = db.ref(userPath);
    
    try {
        await userRef.transaction((currentValue) => (currentValue || 0) + 1);
    } catch (error) {
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
    
    const expiresAt = isVerifiedUser ? -1 : now + 7 * 24 * 60 * 60 * 1000;

    let metadata;
    try {
        metadata = await fetchMetadata(longUrl);
    } catch (error) {
        console.error("Failed to fetch metadata:", error);
        metadata = {
            title: "Link via MiniFyn",
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
        // Asynchronously delete the expired link
        db.ref(`urls/${slug}`).remove().catch(err => console.error("Failed to delete expired link:", err));
        return null;
    }
    
    return { id: slug, ...linkData };
}
