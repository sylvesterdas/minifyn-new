
import { getPostBySlug } from '@/lib/hashnode';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Article, WithContext } from 'schema-dts';
import { BlogPostDetail } from '@/components/blog-post-detail';
import Link from 'next/link';


export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    params = await params;
    let post;

    try {
        post = await getPostBySlug(params.slug);
    } catch (error) {
        console.warn('Unable to generate blog post metadata:', error);
        return {
            title: 'Blog Temporarily Unavailable | MiniFyn Blog',
            description: 'MiniFyn blog content is temporarily unavailable. Please try again soon.',
        };
    }
    
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
    let post;

    try {
        post = await getPostBySlug(params.slug);
    } catch (error) {
        console.warn('Unable to load blog post:', error);
        return <BlogPostUnavailable />;
    }
    
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

function BlogPostUnavailable() {
    return (
        <main className="container mx-auto max-w-3xl px-4 py-24 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Blog post temporarily unavailable</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                The article could not be loaded from our publishing provider right now. Please try again in a few minutes.
            </p>
            <div className="mt-8">
                <Link href="/blog" className="text-primary underline-offset-4 hover:underline">
                    Back to the blog
                </Link>
            </div>
        </main>
    );
}
