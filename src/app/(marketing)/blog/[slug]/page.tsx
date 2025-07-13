import { getPostBySlug } from '@/lib/hashnode';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Article, WithContext } from 'schema-dts';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        return {
            title: 'Post Not Found | MiniFyn Blog'
        };
    }
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.minifyn.com';
    const ogUrl = new URL(`${siteUrl}/api/og`);
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

export default async function PostPage({ params }: Props) {
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
            <article className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
                <div className="prose prose-invert mx-auto prose-lg">
                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                            <p>By {authorName}</p>
                            <span>&bull;</span>
                            <p>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</p>
                            <span>&bull;</span>
                            <p className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {post.readTimeInMinutes} min read
                            </p>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
                        
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
                                ))}
                            </div>
                        )}
                    </header>

                    {post.coverImage?.url && (
                        <div className="relative aspect-[16/9] mb-12">
                            <Image
                                src={post.coverImage.url}
                                alt={post.title}
                                fill
                                className="rounded-lg object-cover"
                                priority
                            />
                        </div>
                    )}
                    
                    <div dangerouslySetInnerHTML={{ __html: post.content.html }}></div>
                </div>
            </article>
        </>
    );
}
