
'use server';

import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import type { Link } from '@/lib/data';
import { startOfDay, subDays, format } from 'date-fns';

export interface UserLink extends Omit<Link, 'seo' | 'expiresAt' | 'userId'> {
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
        }).sort((a, b) => b.createdAt - a.createdAt);

        return userLinks;
    } catch (error) {
        console.error("Failed to fetch user links:", error);
        return [];
    }
}

export interface DashboardStats {
    totalLinks: number;
    totalClicks: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const { user } = await validateRequest();
    if (!user) {
        return { totalLinks: 0, totalClicks: 0 };
    }

    try {
        const linksSnapshot = await db.ref('urls')
            .orderByChild('userId')
            .equalTo(user.uid)
            .once('value');

        if (!linksSnapshot.exists()) {
            return { totalLinks: 0, totalClicks: 0 };
        }
        
        const linksData = linksSnapshot.val();
        const links = Object.values(linksData) as Omit<Link, 'id'>[];
        
        const totalLinks = links.length;
        const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
        
        return { totalLinks, totalClicks };

    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return { totalLinks: 0, totalClicks: 0 };
    }
}

export interface ClickEvent {
    timestamp: number;
    referer: string;
    platform: string;
}

function getHostname(url: string): string {
    if (!url || url === 'Direct') {
        return 'Direct';
    }
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch (e) {
        // If it's not a valid URL (e.g., a custom string), return it as is.
        return url;
    }
}

async function getClickEvents(): Promise<ClickEvent[]> {
    const { user } = await validateRequest();
    if (!user) return [];

    const userLinks = await getUserLinks();
    if (userLinks.length === 0) return [];

    const thirtyDaysAgo = subDays(new Date(), 30).getTime();

    const clickPromises = userLinks.map(link => 
        db.ref(`analytics/${link.id}`)
          .orderByChild('timestamp')
          .startAt(thirtyDaysAgo)
          .once('value')
    );

    const snapshots = await Promise.all(clickPromises);
    const allClicks: ClickEvent[] = [];

    snapshots.forEach(snapshot => {
        if (snapshot.exists()) {
            const clicks = snapshot.val();
            Object.values(clicks).forEach((click: any) => {
                allClicks.push({
                    timestamp: click.timestamp,
                    referer: getHostname(click.referer),
                    platform: click.platform || 'Unknown',
                });
            });
        }
    });

    return allClicks;
}


export interface AnalyticsSummary {
    clicksByDay: { date: string; clicks: number }[];
    referrers: { referrer: string; clicks: number }[];
    platforms: { platform: string; clicks: number }[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const clicks = await getClickEvents();
    
    // Clicks by Day
    const clicksByDayMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'MMM d');
        clicksByDayMap.set(date, 0);
    }
    clicks.forEach(click => {
        const date = format(new Date(click.timestamp), 'MMM d');
        if(clicksByDayMap.has(date)) {
            clicksByDayMap.set(date, (clicksByDayMap.get(date) || 0) + 1);
        }
    });
    const clicksByDay = Array.from(clicksByDayMap, ([date, clicks]) => ({ date, clicks }));
    
    // Referrers
    const referrersMap = new Map<string, number>();
    clicks.forEach(click => {
        referrersMap.set(click.referer, (referrersMap.get(click.referer) || 0) + 1);
    });
    const referrers = Array.from(referrersMap, ([referrer, clicks]) => ({ referrer, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 7);
        
    // Platforms
    const platformsMap = new Map<string, number>();
    clicks.forEach(click => {
        platformsMap.set(click.platform, (platformsMap.get(click.platform) || 0) + 1);
    });
    const platforms = Array.from(platformsMap, ([platform, clicks]) => ({ platform, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 7);

    return { clicksByDay, referrers, platforms };
}
