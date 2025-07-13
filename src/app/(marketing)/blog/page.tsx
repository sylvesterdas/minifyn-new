
import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode';
import { BlogPostList } from '@/components/blog-post-list';

export const metadata: Metadata = {
    title: 'Blog | MiniFyn',
    description: 'Insights, tips, and updates from the MiniFyn team.',
};

export default async function BlogPage() {
  // Fetch initial posts on the server
  const { posts, pageInfo } = await getPosts(6);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">MiniFyn Blog</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Insights, tips, and updates from the MiniFyn team.
        </p>
      </div>

      <BlogPostList initialPosts={posts} initialPageInfo={pageInfo} />
    </div>
  );
}
