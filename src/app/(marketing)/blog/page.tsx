import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode';
import { format } from 'date-fns';

export const metadata: Metadata = {
    title: 'Blog | MiniFyn',
    description: 'Insights, tips, and updates from the MiniFyn team.',
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">MiniFyn Blog</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Insights, tips, and updates from the MiniFyn team.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} className="flex flex-col">
            <CardHeader>
              {post.coverImage?.url && (
                <div className="aspect-[16/9] relative">
                    <Image
                    src={post.coverImage.url}
                    alt={post.title}
                    fill
                    className="rounded-t-lg object-cover"
                    />
                </div>
              )}
              <CardTitle className="pt-4">{post.title}</CardTitle>
              <CardDescription>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{post.brief}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary">
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
