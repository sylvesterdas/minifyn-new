'use server';

import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import type { Link } from '@/lib/data';

export interface UserLink extends Omit<Link, 'seo' | 'expiresAt' | 'userId'> {
    // We might add more specific fields for the dashboard here later
}

export async function getUserLinks(): Promise<UserLink[]> {
    const { user } = await validateRequest();
    if (!user) {
        return [];
    }

    try {
        const linksSnapshot = await db.ref('urls')
            .orderByChild('userId')
            .equalTo(user.uid)
            .once('value');

        if (!linksSnapshot.exists()) {
            return [];
        }

        const linksData = linksSnapshot.val();
        const userLinks: UserLink[] = Object.keys(linksData).map(id => {
            const link = linksData[id];
            return {
                id,
                longUrl: link.longUrl,
                createdAt: link.createdAt,
                clickCount: link.clickCount || 0,
                title: link.title,
                description: link.description,
            };
        }).sort((a, b) => b.createdAt - a.createdAt); // Sort by most recent

        return userLinks;
    } catch (error) {
        console.error("Failed to fetch user links:", error);
        return [];
    }
}

export interface DashboardStats {
    totalLinks: number;
    totalClicks: number;
    // We can add more stats like topCountry, topReferrer later
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const { user } = await validateRequest();
    if (!user) {
        return { totalLinks: 0, totalClicks: 0 };
    }

    try {
        const links = await getUserLinks();
        
        const totalLinks = links.length;
        const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
        
        return { totalLinks, totalClicks };

    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return { totalLinks: 0, totalClicks: 0 };
    }
}
