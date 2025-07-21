
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode';
import { BlogPostList } from '@/components/blog-post-list';

const siteUrl = 'https://www.minifyn.com';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Blog - MiniFyn',
  description: 'Read the latest news, updates, and tutorials from the MiniFyn team.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default async function BlogPage() {
    const { posts, pageInfo } = await getPosts(6);

    // Generate structured data on the server
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${siteUrl}/blog/${post.slug}`,
        "name": post.title,
      })),
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
            {/* Embed structured data in the page */}
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
              <BlogPostList initialPosts={posts} initialPageInfo={pageInfo} />
            </Suspense>
        </div>
    );
}
