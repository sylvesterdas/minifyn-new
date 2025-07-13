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
    const match = html.match(/<title>([\s\S]*?)<\/title>/);
    return match ? match[1]?.trim() : undefined;
}

export async function fetchMetadata(url: string): Promise<Metadata> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MiniFynBot/1.0 (+https://minifyn.com/bot)' // Be a good citizen
            },
            next: { revalidate: 3600 } // Revalidate cache every hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL, status: ${response.status}`);
        }

        const html = await response.text();

        const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
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
            canonical: extractLinkTag(headHtml, 'canonical')
        };
        
        // Use fallbacks for primary fields
        if (!metadata.title) metadata.title = metadata.ogTitle || metadata.twitterTitle;
        if (!metadata.description) metadata.description = metadata.ogDescription || metadata.twitterDescription;

        return metadata;
    } catch (error) {
        console.error(`Error fetching metadata for ${url}:`, error);
        return {};
    }
}