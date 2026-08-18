'use server';

export interface Metadata {
    title?: string;
    description?: string;
    ogImage?: string;
    twitterImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    canonical?: string;
    ogType?: string;
    ogUrl?: string;
    articleAuthor?: string;
    articlePublishedTime?: string;
}

/**
 * Checks if a given host or IP is private, internal, loopback, or cloud metadata (SSRF protection).
 */
function isDisallowedHost(hostname: string): boolean {
    const lower = hostname.toLowerCase();

    // Standard internal hostnames and domains
    if (
        lower === 'localhost' ||
        lower.endsWith('.localhost') ||
        lower.endsWith('.local') ||
        lower.endsWith('.internal') ||
        lower === 'metadata.google.internal' ||
        lower === 'instance-data'
    ) {
        return true;
    }

    // Direct IPv4 / IPv6 checks
    // Check loopback
    if (lower === '127.0.0.1' || lower === '::1' || lower === '0.0.0.0') {
        return true;
    }

    // Check AWS/GCP cloud metadata IP
    if (lower.startsWith('169.254.')) {
        return true;
    }

    // Check private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 100.64.0.0/10
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = lower.match(ipv4Regex);
    if (match) {
        const [_, aStr, bStr] = match;
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);

        if (a === 10) return true; // 10.0.0.0/8
        if (a === 127) return true; // 127.0.0.0/8
        if (a === 192 && b === 168) return true; // 192.168.0.0/16
        if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
        if (a === 169 && b === 254) return true; // 169.254.0.0/16
        if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10
        if (a === 0) return true; // 0.0.0.0/8
    }

    // Check private IPv6 prefixes
    if (lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80')) {
        return true;
    }

    return false;
}

function decodeHtmlEntities(str: string): string {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
        .trim();
}

function extractAttribute(tag: string, attrName: string): string | undefined {
    const regex = new RegExp(`${attrName}\\s*=\\s*(?:["']([^"']*)["']|([^\\s>]+))`, 'i');
    const match = tag.match(regex);
    const value = match ? match[1] ?? match[2] : undefined;
    return value ? decodeHtmlEntities(value) : undefined;
}

function parseAllMetaTags(html: string): Map<string, string> {
    const metaMap = new Map<string, string>();
    const metaTagRegex = /<\s*meta\b([^>]*)\/?>/gi;
    let match;

    while ((match = metaTagRegex.exec(html)) !== null) {
        const attributesStr = match[1];
        const name = extractAttribute(attributesStr, 'name')?.toLowerCase();
        const property = extractAttribute(attributesStr, 'property')?.toLowerCase();
        const content = extractAttribute(attributesStr, 'content');

        if (content) {
            if (property) metaMap.set(property, content);
            if (name) metaMap.set(name, content);
        }
    }

    return metaMap;
}

function extractLinkTag(html: string, rel: string): string | undefined {
    const linkTagRegex = /<\s*link\b([^>]*)\/?>/gi;
    let match;

    while ((match = linkTagRegex.exec(html)) !== null) {
        const attributesStr = match[1];
        const tagRel = extractAttribute(attributesStr, 'rel')?.toLowerCase();
        if (tagRel === rel.toLowerCase()) {
            return extractAttribute(attributesStr, 'href');
        }
    }

    return undefined;
}

function extractTitle(html: string): string | undefined {
    const match = html.match(/<\s*title[^>]*>([\s\S]*?)<\s*\/\s*title\s*>/i);
    return match ? decodeHtmlEntities(match[1]) : undefined;
}

export async function fetchMetadata(url: string): Promise<Metadata> {
    try {
        const parsedUrl = new URL(url);

        // Protocol enforcement
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            console.warn(`[fetchMetadata] Blocked non-HTTP protocol: ${parsedUrl.protocol}`);
            return {};
        }

        // SSRF protection
        if (isDisallowedHost(parsedUrl.hostname)) {
            console.warn(`[fetchMetadata] Blocked request to internal/disallowed host: ${parsedUrl.hostname}`);
            return {};
        }

        // Fetch with 5s timeout
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MiniFynBot/1.0 (+https://www.minifyn.com/bot)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(5000),
            next: { revalidate: 3600 },
        } as RequestInit);

        if (!response.ok) {
            console.warn(`[fetchMetadata] Response not OK (${response.status}) for ${url}`);
            return {};
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
            return {};
        }

        // Read up to 512 KB to avoid excessive memory usage
        const rawText = await response.text();
        const html = rawText.slice(0, 512 * 1024);

        const headMatch = html.match(/<\s*head[^>]*>([\s\S]*?)<\s*\/\s*head\s*>/i);
        const targetHtml = headMatch ? headMatch[1] : html;

        const metaMap = parseAllMetaTags(targetHtml);

        const metadata: Metadata = {
            title: extractTitle(targetHtml),
            description: metaMap.get('description'),
            ogTitle: metaMap.get('og:title'),
            ogDescription: metaMap.get('og:description'),
            ogImage: metaMap.get('og:image'),
            ogType: metaMap.get('og:type'),
            ogUrl: metaMap.get('og:url'),
            twitterCard: metaMap.get('twitter:card'),
            twitterTitle: metaMap.get('twitter:title'),
            twitterDescription: metaMap.get('twitter:description'),
            twitterImage: metaMap.get('twitter:image'),
            canonical: extractLinkTag(targetHtml, 'canonical'),
            articleAuthor: metaMap.get('article:author'),
            articlePublishedTime: metaMap.get('article:published_time'),
        };

        // Fallbacks for primary fields
        if (!metadata.title) metadata.title = metadata.ogTitle || metadata.twitterTitle;
        if (!metadata.description) metadata.description = metadata.ogDescription || metadata.twitterDescription;

        return metadata;
    } catch (error) {
        console.error(`[fetchMetadata] Error fetching metadata for ${url}:`, error);
        return {};
    }
}

