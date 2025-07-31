
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

function extractMetaTag(html: string, property: string): string | undefined {
    // This regex handles property="og:title" or name="twitter:title"
    const regex = new RegExp(`<meta (?:name|property)="${property}" content="(.*?)"`);
    const match = html.match(regex);
    return match ? match[1] : undefined;
}

function extractLinkTag(html: string, rel: string): string | undefined {
    const regex = new RegExp(`<link rel="${rel}" href="(.*?)"`);
    const match = html.match(regex);
    return match ? match[1] : undefined;
}

function extractTitle(html: string): string | undefined {
    const match = html.match(/<title>(.*?)<\/title>/s); // Corrected regex with 's' flag
    return match ? match[1]?.trim() : undefined;
}

export async function fetchMetadata(url: string): Promise<Metadata> {
    console.log(`[fetchMetadata] Attempting to fetch metadata for URL: ${url}`);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MiniFynBot/1.0 (+https://minifyn.com/bot)' // Be a good citizen
            },
            next: { revalidate: 3600 } // Revalidate cache every hour
        });

        if (!response.ok) {
            // Instead of throwing an error, we log it and return an empty object.
            // This prevents the entire link creation process from failing if a page is temporarily down or returns a 404.
            console.warn(`[fetchMetadata] Could not fetch metadata for ${url}, status: ${response.status}`);
            return {};
        }

        const html = await response.text();

        const headMatch = html.match(/<head[^>]*>([sS]*?)<\/head>/i);
        const headHtml = headMatch ? headMatch[1] : html; // Fallback to full HTML if head not found

        const metadata: Metadata = {
            title: extractTitle(headHtml),
            description: extractMetaTag(headHtml, 'description'),
            ogTitle: extractMetaTag(headHtml, 'og:title'),
            ogDescription: extractMetaTag(headHtml, 'og:description'),
            ogImage: extractMetaTag(headHtml, 'og:image'),
            ogType: extractMetaTag(headHtml, 'og:type'),
            ogUrl: extractMetaTag(headHtml, 'og:url'),
            twitterCard: extractMetaTag(headHtml, 'twitter:card'),
            twitterTitle: extractMetaTag(headHtml, 'twitter:title'),
            twitterDescription: extractMetaTag(headHtml, 'twitter:description'),
            twitterImage: extractMetaTag(headHtml, 'twitter:image'),
            canonical: extractLinkTag(headHtml, 'canonical'),
            articleAuthor: extractMetaTag(headHtml, 'article:author'),
            articlePublishedTime: extractMetaTag(headHtml, 'article:published_time'),
        };
        
        // Use fallbacks for primary fields
        if (!metadata.title) metadata.title = metadata.ogTitle || metadata.twitterTitle;
        if (!metadata.description) metadata.description = metadata.ogDescription || metadata.twitterDescription;

        console.log('[fetchMetadata] Extracted metadata:', metadata);

        return metadata;
    } catch (error) {
        console.error(`[fetchMetadata] Error fetching metadata for ${url}:`, error);
        // Return an empty object on any other error (e.g., network failure)
        return {};
    }
}
