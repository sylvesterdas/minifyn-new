
'use server';

import { GoogleAuth } from 'google-auth-library';
import { SUPER_USER_ID } from './config';

const WEB_RISK_API_ENDPOINT = 'https://webrisk.googleapis.com';
const API_VERSION = 'v1';

// These are the threat types we are checking for.
const THREAT_TYPES = ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'];

// In-memory cache to avoid re-checking the same safe URLs repeatedly.
// In a larger application, this could be replaced with a Redis or Memcached instance.
const safeUrlCache = new Map<string, { timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Checks if a given URL is considered safe by the Google Web Risk API.
 * Uses an in-memory cache to reduce API calls for recently checked URLs.
 * @param url The URL to check.
 * @returns A promise that resolves to true if the URL is safe, false otherwise.
 */
export async function isUrlSafe(url: string): Promise<boolean> {
    // Bypass for internal/system links if needed
    if (url.includes(SUPER_USER_ID)) {
        return true;
    }

    // Check cache first
    const cachedEntry = safeUrlCache.get(url);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_TTL)) {
        console.log(`[WebRisk] Cache hit for URL: ${url}`);
        return true;
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
        console.error("Project ID is not configured. Cannot use Web Risk API.");
        // Fail open: If the service is misconfigured, we don't block URLs.
        return true;
    }
    
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
        projectId,
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const apiUrl = `${WEB_RISK_API_ENDPOINT}/${API_VERSION}/uris:search?key=${accessToken.token}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uri: url,
                threatTypes: THREAT_TYPES,
            }),
        });
        
        if (!response.ok) {
            console.error(`[WebRisk] API error: ${response.statusText}`, await response.text());
            // Fail open: If the API call fails, assume the URL is safe to not block legitimate users.
            return true;
        }

        const result = await response.json();
        
        // If the result contains a 'threat' object, the URL is considered unsafe.
        if (result.threat) {
            console.warn(`[WebRisk] Unsafe URL detected: ${url}`, JSON.stringify(result.threat));
            return false;
        }

        // If no threat was found, the URL is safe. Cache it.
        safeUrlCache.set(url, { timestamp: Date.now() });
        console.log(`[WebRisk] URL is safe: ${url}`);
        return true;

    } catch (error) {
        console.error("[WebRisk] Failed to check URL safety:", error);
        // Fail open: In case of network or other unexpected errors, allow the URL.
        return true;
    }
}
