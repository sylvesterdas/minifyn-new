'use server';

interface Metadata {
    title?: string;
    description?: string;
    ogImage?: string;
    twitterImage?: string;
}

function extractMetaTag(html: string, property: string): string | undefined {
    const regex = new RegExp(`<meta (?:name|property)="${property}" content="(.*?)"`);
    const match = html.match(regex);
    return match ? match[1] : undefined;
}

function extractTitle(html: string): string | undefined {
    const match = html.match(/<title>(.*?)<\/title>/);
    return match ? match[1] : undefined;
}

export async function fetchMetadata(url: string): Promise<Metadata> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MiniFynBot/1.0 (+https://minifyn.io/bot)' // Be a good citizen
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL, status: ${response.status}`);
        }

        const html = await response.text();

        // Extract a limited part of the HTML to find the head
        const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        const headHtml = headMatch ? headMatch[1] : '';

        const title = extractTitle(headHtml) || extractMetaTag(headHtml, 'og:title');
        const description = extractMetaTag(headHtml, 'description') || extractMetaTag(headHtml, 'og:description');
        const ogImage = extractMetaTag(headHtml, 'og:image');
        const twitterImage = extractMetaTag(headHtml, 'twitter:image');

        return { title, description, ogImage, twitterImage };
    } catch (error) {
        console.error(`Error fetching metadata for ${url}:`, error);
        return {};
    }
}
