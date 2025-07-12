import { generateSeoMetadata } from '@/ai/flows/generate-seo-metadata';
import { db } from './firebase-admin';
import type { DataSnapshot } from 'firebase-admin/database';

export interface Link {
  id: string;
  longUrl: string;
  createdAt: number;
  expiresAt: number; // timestamp, -1 for no expiry
  title?: string;
  description?: string;
  userId: string;
  clickCount: number;
}

const usage = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;

export const checkRateLimit = (ip: string): boolean => {
    const now = Date.now();
    const userUsage = usage.get(ip) || [];
    
    const recentUsage = userUsage.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentUsage.length >= RATE_LIMIT) {
        return false;
    }

    usage.set(ip, [...recentUsage, now]);
    return true;
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
    
    // Links for verified users do not expire. Anonymous/unverified links expire in 7 days.
    const expiresAt = isVerifiedUser ? -1 : now + 7 * 24 * 60 * 60 * 1000;

    let title, description;
    try {
        const metadata = await generateSeoMetadata({ url: longUrl });
        title = metadata.title;
        description = metadata.description;
    } catch (error) {
        console.error("Failed to generate SEO metadata:", error);
        title = "Link via MiniFyn";
        description = "A shortened link created with MiniFyn."
    }

    const newLink: Omit<Link, 'id'> = {
        longUrl,
        createdAt: now,
        expiresAt,
        title,
        description,
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
