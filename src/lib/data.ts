import { generateSeoMetadata } from '@/ai/flows/generate-seo-metadata';

export interface Link {
  id: string; // The short slug
  longUrl: string;
  createdAt: Date;
  expiresAt: Date;
  title?: string;
  description?: string;
}

// Using a Map to simulate a database in memory
const links = new Map<string, Link>();

// Mock Rate Limiter state
const usage = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const checkRateLimit = (ip: string): boolean => {
    const now = Date.now();
    const userUsage = usage.get(ip) || [];
    
    // Filter out timestamps that are outside the rate limit window
    const recentUsage = userUsage.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentUsage.length >= RATE_LIMIT) {
        return false; // Rate limit exceeded
    }

    // Add the new request timestamp and update the usage map
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
    return links.has(slug);
}

export const createShortLink = async (longUrl: string): Promise<Link> => {
    let slug;
    do {
        slug = generateShortCode();
    } while (links.has(slug));

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

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

    const newLink: Link = {
        id: slug,
        longUrl,
        createdAt: now,
        expiresAt,
        title,
        description
    };

    links.set(slug, newLink);
    return newLink;
}

export const getLinkBySlug = async (slug: string): Promise<Link | null> => {
    const link = links.get(slug);
    if (!link) return null;

    if (new Date() > link.expiresAt) {
        links.delete(slug); // Clean up expired link from memory
        return null;
    }
    
    return link;
}
