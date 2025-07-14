import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode';
import { BlogPostList } from '@/components/blog-post-list';
import type { Blog, WithContext } from 'schema-dts';

export async function generateMetadata(): Promise<Metadata> {
    const siteUrl = 'https://www.minifyn.com';
    const title = 'Blog | MiniFyn';
    const description = 'Insights, tips, and updates from the MiniFyn team.';

    const { posts } = await getPosts(1);
    const latestPost = posts[0];

    const ogUrl = new URL(`${siteUrl}/blog/og`);
    ogUrl.searchParams.set('title', latestPost ? latestPost.title : title);
    if (latestPost && latestPost.tags && latestPost.tags.length > 0) {
        ogUrl.searchParams.set('tags', latestPost.tags.map(t => t.name).join(','));
    } else {
        ogUrl.searchParams.set('tags', 'URL Shortening,Tech,Tips');
    }

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
                    url: ogUrl.toString(),
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
            images: [ogUrl.toString()],
        },
    };
}

export default async function BlogPage() {
  const { posts, pageInfo } = await getPosts(6);
  const siteUrl = 'https://www.minifyn.com';
  
  const jsonLd: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'MiniFyn Blog',
    description: 'Insights, tips, and updates from the MiniFyn team.',
    url: `${siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'MiniFyn',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
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
