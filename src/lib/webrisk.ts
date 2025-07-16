
'use server';

// These are the threat types we are checking for.
const THREAT_TYPES = ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'];

// In-memory cache to avoid re-checking the same safe URLs repeatedly.
const safeUrlCache = new Map<string, { timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Checks if a given URL is considered safe by the Google Web Risk API.
 * @param url The URL to check.
 * @returns A promise that resolves to true if the URL is safe, false otherwise.
 */
export async function isUrlSafe(url: string): Promise<boolean> {
    const cachedEntry = safeUrlCache.get(url);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_TTL)) {
        console.log(`[WebRisk] Cache hit for URL: ${url}`);
        return true;
    }

    const apiKey = process.env.WEBRISK_API_KEY;
    if (!apiKey) {
        console.error("WEBRISK_API_KEY is not configured. Cannot use Web Risk API. Failing open.");
        return true; // Fail open if the service is misconfigured.
    }
    
    const encodedUrl = encodeURIComponent(url);
    const encodedThreatTypes = THREAT_TYPES.map(t => `threatTypes=${t}`).join('&');

    const apiUrl = `https://webrisk.googleapis.com/v1/uris:search?${encodedThreatTypes}&uri=${encodedUrl}&key=${apiKey}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[WebRisk] API error: ${response.statusText}`, errorText);
            return true; // Fail open on API error
        }

        const result = await response.json();
        
        // If the threat property exists in the response, the URL is unsafe.
        if (result.threat) {
            console.warn(`[WebRisk] Unsafe URL detected: ${url}`, JSON.stringify(result.threat));
            return false;
        }

        // If no threat is found, cache the result and consider it safe.
        safeUrlCache.set(url, { timestamp: Date.now() });
        console.log(`[WebRisk] URL is safe: ${url}`);
        return true;

    } catch (error) {
        console.error("[WebRisk] Failed to check URL safety:", error);
        return true; // Fail open on network or other errors
    }
}
