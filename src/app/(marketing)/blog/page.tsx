import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode';
import { BlogPostList } from '@/components/blog-post-list';
import type { Blog, WithContext, WebSite } from 'schema-dts';

export async function generateMetadata(): Promise<Metadata> {
    // A static, branded image is better for the main blog page's social sharing.
    const ogImageUrl = 'https://www.minifyn.com/logo.png';
    const siteUrl = 'https://www.minifyn.com/blog';
    const title = 'Blog | MiniFyn';
    const description = 'Insights, tips, and updates from the MiniFyn team.';

    return {
        title,
        description,
        alternates: {
            canonical: siteUrl,
        },
        openGraph: {
            title,
            description,
            url: siteUrl,
            type: 'website',
            images: [
                {
                    url: ogImageUrl,
                    width: 512, // Standard logo dimensions
                    height: 512,
                    alt: 'MiniFyn Blog',
                },
            ],
        },
        twitter: {
            card: 'summary', // Summary card is better for logo-sized images
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
    url: 'https://www.minifyn.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'MiniFyn',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.minifyn.com/logo.png',
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
