"use server";

import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import type { Link } from "@/lib/data";
import { startOfDay, addDays, format, endOfDay, subDays } from "date-fns";
import { getCountryFromIP } from "@/lib/ip-to-country";
import UAParser from "ua-parser-js";

import type { UpdateProfileResult } from "@/types/dashboard";

export interface UserLink extends Omit<Link, "seo" | "expiresAt" | "userId"> {}

export async function getUserLinks(limit?: number): Promise<UserLink[]> {
  const { user } = await validateRequest();
  if (!user) {
    return [];
  }

  try {
    let query = db.ref("urls").orderByChild("userId").equalTo(user.uid);

    const linksSnapshot = await query.once("value");

    if (!linksSnapshot.exists()) {
      return [];
    }

    const linksData = linksSnapshot.val();
    let userLinks: UserLink[] = Object.keys(linksData)
      .map((id) => {
        const link = linksData[id];
        return {
          id,
          longUrl: link.longUrl,
          createdAt: link.createdAt,
          clickCount: link.clickCount || 0,
          title: link.title,
          description: link.description,
          plan: link.plan,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Sort by most recent

    if (limit) {
      userLinks = userLinks.slice(0, limit);
    }

    return userLinks;
  } catch (error) {
    console.error("Failed to fetch user links:", error);
    return [];
  }
}

export async function searchUserLinks(searchTerm: string): Promise<UserLink[]> {
  const { user } = await validateRequest();
  if (!user) {
    return [];
  }

  // Fetch all links for the user on the backend
  const allLinks = await getUserLinks();
  if (!allLinks.length) {
    return [];
  }

  const lowercasedTerm = searchTerm.toLowerCase();

  // Filter links based on the search term
  const filteredLinks = allLinks.filter(
    (link) =>
      link.id.toLowerCase().includes(lowercasedTerm) ||
      link.longUrl.toLowerCase().includes(lowercasedTerm)
  );

  // Return the top 10 matches
  return filteredLinks.slice(0, 10);
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
    const linksSnapshot = await db
      .ref("urls")
      .orderByChild("userId")
      .equalTo(user.uid)
      .once("value");

    if (!linksSnapshot.exists()) {
      return { totalLinks: 0, totalClicks: 0 };
    }

    const linksData = linksSnapshot.val();
    const links = Object.values(linksData) as Omit<Link, "id">[];

    const totalLinks = links.length;
    const totalClicks = links.reduce(
      (sum, link) => sum + (link.clickCount || 0),
      0
    );

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
  if (!url || url === "Direct") {
    return "Direct";
  }
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch (e) {
    return url;
  }
}

function parseUserAgent(ua: string | null): {
  platform: string;
  browser: string;
} {
  if (!ua) return { platform: "Unknown", browser: "Unknown" };
  const parser = new UAParser(ua);
  const result = parser.getResult();
  return {
    platform: result.os.name || "Unknown",
    browser: result.browser.name || "Unknown",
  };
}

async function getClickEvents(
  dateRange: { from: Date; to: Date },
  linkId?: string
): Promise<ClickEvent[]> {
  const { user } = await validateRequest();
  if (!user || !linkId) return [];

  let linkIdsToFetch: string[] = [linkId];

  // Firebase Realtime DB doesn't support complex 'OR' queries across different parents efficiently.
  // So we fetch data for each linkId within the date range.
  const clickPromises = linkIdsToFetch.map((id) =>
    db
      .ref(`analytics/${id}`)
      .orderByChild("timestamp")
      .startAt(dateRange.from.getTime())
      .endAt(dateRange.to.getTime())
      .once("value")
  );

  const snapshots = await Promise.all(clickPromises);
  const allClicks: ClickEvent[] = [];

  for (const snapshot of snapshots) {
    if (snapshot.exists()) {
      const clicks = snapshot.val();
      for (const click of Object.values(clicks)) {
        const userAgentInfo = parseUserAgent((click as any).userAgent);
        const country = await getCountryFromIP((click as any).ip);
        allClicks.push({
          timestamp: (click as any).timestamp,
          referer: getHostname((click as any).referer),
          platform: userAgentInfo.platform,
          browser: userAgentInfo.browser,
          country: country,
        });
      }
    }
  }

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

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  timezone: string;
  company: string;
}

export async function updateUserProfile(
  prevState: any,
  formData: FormData
): Promise<UpdateProfileResult> {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const timezone = formData.get("timezone") as string;
  const company = formData.get("company") as string;

  try {
    await db.ref(`users/${user.uid}/profile`).update({
      name,
      role,
      timezone,
      company,
    });
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error.message || "Failed to update profile.",
    };
  }
}

export async function getUserProfile(): Promise<{
  profile: UserProfile | null;
  error?: string;
}> {
  const { user } = await validateRequest();
  if (!user) {
    return { profile: null, error: "Unauthorized" };
  }

  try {
    const snapshot = await db.ref(`users/${user.uid}/profile`).once("value");
    if (snapshot.exists()) {
      return { profile: snapshot.val() as UserProfile };
    }
    return { profile: null, error: "Profile not found." };
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return {
      profile: null,
      error: error.message || "Failed to fetch profile.",
    };
  }
}

export async function getAnalyticsSummary(
  dateRange?: { from: string; to: string },
  linkId?: string
): Promise<AnalyticsSummary> {
  const fromDate = dateRange?.from
    ? startOfDay(new Date(dateRange.from))
    : startOfDay(subDays(new Date(), 29));
  const toDate = dateRange?.to
    ? endOfDay(new Date(dateRange.to))
    : endOfDay(new Date());

  if (!linkId) {
    return {
      clicksByDay: [],
      referrers: [],
      platforms: [],
      browsers: [],
      countries: [],
      totalClicks: 0,
    };
  }

  const clicks = await getClickEvents({ from: fromDate, to: toDate }, linkId);

  // Clicks by Day
  const clicksByDayMap = new Map<string, number>();
  let currentDate = fromDate;
  while (currentDate <= toDate) {
    const dateKey = format(currentDate, "MMM d");
    clicksByDayMap.set(dateKey, 0);
    currentDate = addDays(currentDate, 1);
  }
  clicks.forEach((click) => {
    const dateKey = format(new Date(click.timestamp), "MMM d");
    if (clicksByDayMap.has(dateKey)) {
      clicksByDayMap.set(dateKey, (clicksByDayMap.get(dateKey) || 0) + 1);
    }
  });
  const clicksByDay = Array.from(clicksByDayMap, ([date, clicks]) => ({
    date,
    clicks,
  }));

  const aggregate = (key: keyof Omit<ClickEvent, "timestamp">) => {
    const map = new Map<string, number>();
    clicks.forEach((click) => {
      const value = click[key];
      if (typeof value === "string" && value) {
        map.set(value, (map.get(value) || 0) + 1);
      }
    });
    return Array.from(map, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  };

  return {
    clicksByDay,
    referrers: aggregate("referer"),
    platforms: aggregate("platform"),
    browsers: aggregate("browser"),
    countries: aggregate("country"),
    totalClicks: clicks.length,
  };
}

export async function generateApiKey(): Promise<{
  key?: string;
  error?: string;
}> {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Check if an API key already exists for the user
    const existingKeySnapshot = await db
      .ref(`apiKeys/${user.uid}`)
      .once("value");
    if (existingKeySnapshot.exists()) {
      return {
        error:
          "An API key already exists for this user. Please revoke the existing key before generating a new one.",
      };
    }

    // Generate a new API key (simple random string for demonstration)
    const newKey = `mk_${
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    }`;

    // Store the new key in the database
    await db.ref(`apiKeys/${user.uid}`).set({
      key: newKey,
      createdAt: Date.now(),
    });

    return { key: newKey };
  } catch (error: any) {
    console.error("Error generating API key:", error);
    return { error: error.message || "Failed to generate API key." };
  }
}

export async function revokeApiKey(): Promise<{
  success?: boolean;
  error?: string;
}> {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db.ref(`apiKeys/${user.uid}`).remove();
    return { success: true };
  } catch (error: any) {
    console.error("Error revoking API key:", error);
    return { error: error.message || "Failed to revoke API key." };
  }
}

export async function getApiKeyForUser(userId: string): Promise<string | null> {
  try {
    const snapshot = await db.ref(`apiKeys/${userId}`).once("value");
    if (snapshot.exists()) {
      return snapshot.val().key;
    }
    return null;
  } catch (error) {
    console.error("Error fetching API key:", error);
    return null;
  }
}
