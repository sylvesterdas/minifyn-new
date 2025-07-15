
import { getPostBySlug } from '@/lib/hashnode';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Article, WithContext } from 'schema-dts';
import { BlogPostDetail } from '@/components/blog-post-detail';
import { getAiCoverImage, generateAndSaveCoverImage } from '../actions';
import { db } from '@/lib/firebase-admin';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        return {
            title: 'Post Not Found | MiniFyn Blog'
        };
    }
    
    const siteUrl = 'https://www.minifyn.com';
    const authorName = post.author?.name || 'Sylvester Das';
    
    // Prioritize Hashnode's OG image, then our AI-generated one, then a fallback.
    const aiImage = await getAiCoverImage(post.slug);
    const ogImageUrl = post.ogImage?.url || post.coverImage?.url || aiImage || 'https://placehold.co/1200x630.png';

    return {
        title: `${post.title} | MiniFyn Blog`,
        description: post.brief,
        alternates: {
            canonical: `${siteUrl}/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.brief,
            url: `${siteUrl}/blog/${post.slug}`,
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [authorName],
            images: ogImageUrl ? [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.brief,
            images: ogImageUrl ? [ogImageUrl] : undefined,
        }
    };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        notFound();
    }
    
    const authorName = post.author?.name || 'Sylvester Das';
    const siteUrl = 'https://www.minifyn.com';

    let finalCoverImage = post.coverImage?.url;
    let isAiImage = false;

    // If there's no cover image from Hashnode, check for our AI-generated one.
    if (!finalCoverImage) {
        const aiImage = await getAiCoverImage(post.slug);
        if (aiImage) {
            finalCoverImage = aiImage;
            isAiImage = true;
        } else {
            // If no AI image exists yet, trigger generation in the background (fire-and-forget).
            // We don't await this call, so the page renders immediately.
            generateAndSaveCoverImage(post.slug, post.title);
        }
    }

    const jsonLd: WithContext<Article> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.brief,
        image: finalCoverImage || `${siteUrl}/logo.png`,
        author: {
            '@type': 'Person',
            name: authorName,
        },
        publisher: {
            '@type': 'Organization',
            name: 'MiniFyn',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
            }
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPostDetail 
                post={post} 
                coverImageOverride={finalCoverImage}
                isAiCoverImage={isAiImage}
            />
        </>
    );
}
