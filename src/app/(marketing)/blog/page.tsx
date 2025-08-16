
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode';
import { BlogPostList } from '@/components/blog-post-list';

const siteUrl = 'https://www.minifyn.com';

// CHANGE 1: Replaced time-based revalidation with forced dynamic rendering.
// This is the strongest instruction to ensure the page is never cached and is
// rebuilt on every single request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog - MiniFyn',
  description: 'Read the latest news, updates, and tutorials from the MiniFyn team.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default async function BlogPage() {
    // Fetch 11 posts for the initial load
    const { posts, pageInfo } = await getPosts(11);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": posts.map((post: { slug: any; title: any; }, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${siteUrl}/blog/${post.slug}`,
        "name": post.title,
      })),
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    The MiniFyn Blog
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    News, updates, and tutorials from our team.
                </p>
            </header>
            <Suspense fallback={
                <div className="text-center py-16">
                    <p className="text-lg font-semibold">Loading posts...</p>
                </div>
            }>
              <BlogPostList
                initialPosts={posts.map((post: { brief: any; updatedAt: any; }) => ({
                  ...post,
                  brief: post.brief ?? '',
                  updatedAt: post.updatedAt,
                }))}
                initialPageInfo={pageInfo}
              />
            </Suspense>
        </div>
    );
}
