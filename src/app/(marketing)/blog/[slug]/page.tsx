
import { getPostBySlug, getPosts } from '@/lib/hashnode';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Article, WithContext } from 'schema-dts';
import { BlogPostDetail } from '@/components/blog-post-detail';


export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    params = await params;
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        return {
            title: 'Post Not Found | MiniFyn Blog'
        };
    }
    
    const siteUrl = 'https://www.minifyn.com';
    const authorName = post.author?.name || 'Sylvester Das';
    const seoTitle = post.seo?.title?.trim();
    const seoDescription = post.seo?.description?.trim();
    const metaTitle = seoTitle || post.title;
    const metaDescription = seoDescription || post.brief;
    
    // Use the OG image if available, otherwise fall back to the cover image, then a site default.
    const finalOgImage = post.ogImage?.url || post.coverImage?.url || `${siteUrl}/og.png`;

    return {
        title: seoTitle || `${post.title} | MiniFyn Blog`,
        description: metaDescription,
        alternates: {
            canonical: `${siteUrl}/blog/${post.slug}`,
        },
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: `${siteUrl}/blog/${post.slug}`,
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [authorName],
            images: finalOgImage ? [
                {
                    url: finalOgImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: finalOgImage ? [finalOgImage] : undefined,
        }
    };
}

export default async function PostPage({ params }: { params: any }) {
    params = await params;
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        notFound();
    }
    
    const authorName = post.author?.name || 'Sylvester Das';
    const seoDescription = post.seo?.description?.trim();
    const finalCoverImage = post.coverImage?.url;

    const jsonLd: WithContext<Article> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: seoDescription || post.brief,
        image: finalCoverImage,
        author: {
            '@type': 'Person',
            name: authorName,
        },
        publisher: {
            '@type': 'Organization',
            name: 'MiniFyn',
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
            <BlogPostDetail post={post} />
        </>
    );
}
