
'use server';

import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import type { Link } from '@/lib/data';
import { startOfDay, addDays, format, endOfDay } from 'date-fns';
import { getCountryFromIP } from '@/lib/ip-to-country';
import UAParser from 'ua-parser-js';

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

interface ClickEvent {
    timestamp: number;
    referer: string;
    platform: string;
    browser: string;
    country: string | null;
}

function getHostname(url: string): string {
    if (!url || url === 'Direct') {
        return 'Direct';
    }
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch (e) {
        return url;
    }
}

function parseUserAgent(ua: string | null): { platform: string, browser: string } {
    if (!ua) return { platform: 'Unknown', browser: 'Unknown' };
    const parser = new UAParser(ua);
    const result = parser.getResult();
    return {
        platform: result.os.name || 'Unknown',
        browser: result.browser.name || 'Unknown',
    }
}


async function getClickEvents(dateRange: { from: Date; to: Date }, linkId?: string): Promise<ClickEvent[]> {
    const { user } = await validateRequest();
    if (!user) return [];

    let linkIdsToFetch: string[];

    if (linkId) {
        linkIdsToFetch = [linkId];
    } else {
        const userLinks = await getUserLinks();
        if (userLinks.length === 0) return [];
        linkIdsToFetch = userLinks.map(link => link.id);
    }
    
    // Firebase Realtime DB doesn't support complex 'OR' queries across different parents efficiently.
    // So we fetch data for each linkId within the date range.
    const clickPromises = linkIdsToFetch.map(id => 
        db.ref(`analytics/${id}`)
          .orderByChild('timestamp')
          .startAt(dateRange.from.getTime())
          .endAt(dateRange.to.getTime())
          .once('value')
    );

    const snapshots = await Promise.all(clickPromises);
    const allClicks: ClickEvent[] = [];

    snapshots.forEach(snapshot => {
        if (snapshot.exists()) {
            const clicks = snapshot.val();
            Object.values(clicks).forEach((click: any) => {
                const userAgentInfo = parseUserAgent(click.userAgent);
                allClicks.push({
                    timestamp: click.timestamp,
                    referer: getHostname(click.referer),
                    platform: userAgentInfo.platform,
                    browser: userAgentInfo.browser,
                    country: getCountryFromIP(click.ip),
                });
            });
        }
    });

    return allClicks;
}


export interface AnalyticsSummary {
    clicksByDay: { date: string; clicks: number }[];
    referrers: { name: string; value: number }[];
    platforms: { name: string; value: number }[];
    browsers: { name: string; value: number }[];
    countries: { name: string; value: number }[];
    totalClicks: number;
}

export async function getAnalyticsSummary(dateRange: { from: string; to: string }, linkId?: string): Promise<AnalyticsSummary> {
    const fromDate = startOfDay(new Date(dateRange.from));
    const toDate = endOfDay(new Date(dateRange.to));

    const clicks = await getClickEvents({ from: fromDate, to: toDate }, linkId);
    
    // Clicks by Day
    const clicksByDayMap = new Map<string, number>();
    let currentDate = fromDate;
    while (currentDate <= toDate) {
        const dateKey = format(currentDate, 'MMM d');
        clicksByDayMap.set(dateKey, 0);
        currentDate = addDays(currentDate, 1);
    }
    clicks.forEach(click => {
        const dateKey = format(new Date(click.timestamp), 'MMM d');
        if(clicksByDayMap.has(dateKey)) {
            clicksByDayMap.set(dateKey, (clicksByDayMap.get(dateKey) || 0) + 1);
        }
    });
    const clicksByDay = Array.from(clicksByDayMap, ([date, clicks]) => ({ date, clicks }));
    
    const aggregate = (key: keyof ClickEvent) => {
        const map = new Map<string, number>();
        clicks.forEach(click => {
            const value = click[key];
            if (typeof value === 'string' && value) {
                map.set(value, (map.get(value) || 0) + 1);
            }
        });
        return Array.from(map, ([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 7);
    }

    return {
        clicksByDay,
        referrers: aggregate('referer'),
        platforms: aggregate('platform'),
        browsers: aggregate('browser'),
        countries: aggregate('country'),
        totalClicks: clicks.length,
    };
}
