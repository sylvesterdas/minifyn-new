
import { getPostBySlug } from '@/lib/hashnode';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Article, WithContext } from 'schema-dts';
import { BlogPostDetail } from '@/components/blog-post-detail';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        return {
            title: 'Post Not Found | MiniFyn Blog'
        };
    }
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.minifyn.com';
    const ogUrl = new URL(`${siteUrl}/blog/og`);
    ogUrl.searchParams.set('title', post.title);
    if(post.tags && post.tags.length > 0) {
      ogUrl.searchParams.set('tags', post.tags.map(t => t.name).join(','));
    }

    const authorName = post.author?.name || 'Sylvester Das';

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
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.brief,
            images: [ogUrl.toString()],
        }
    };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        notFound();
    }
    
    const authorName = post.author?.name || 'Sylvester Das';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.minifyn.com';
    const imageUrl = post.coverImage?.url || `${siteUrl}/logo.png`;

    const jsonLd: WithContext<Article> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.brief,
        image: imageUrl,
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
            <BlogPostDetail post={post} />
        </>
    );
}
