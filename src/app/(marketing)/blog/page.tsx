import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode';
import { BlogPostList } from '@/components/blog-post-list';
import type { Blog, WithContext } from 'schema-dts';

const siteUrl = 'https://www.minifyn.com';

export async function generateMetadata(): Promise<Metadata> {
    const title = 'Blog | MiniFyn';
    const description = 'Insights, tips, and updates from the MiniFyn team.';

    const ogImageUrl = `${siteUrl}/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

    return {
        title,
        description,
        alternates: {
            canonical: `${siteUrl}/blog`,
        },
        openGraph: {
            title,
            description,
            url: `${siteUrl}/blog`,
            type: 'website',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: 'MiniFyn Blog',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
    };
}

export default async function BlogPage() {
  const { posts, pageInfo } = await getPosts(6);
  
  const jsonLd: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'MiniFyn Blog',
    description: 'Insights, tips, and updates from the MiniFyn team.',
    url: `${siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'MiniFyn',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">MiniFyn Blog</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Insights, tips, and updates from the MiniFyn team.
          </p>
        </div>
        <BlogPostList initialPosts={posts} initialPageInfo={pageInfo} />
      </div>
    </>
  );
}
