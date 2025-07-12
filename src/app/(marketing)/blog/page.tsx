import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog | MiniFyn',
    description: 'Insights, tips, and updates from the MiniFyn team.',
};

const blogPosts = [
    {
        slug: 'why-short-links-matter',
        title: 'The Unseen Power of Short Links in Digital Marketing',
        description: 'Discover how a simple short link can boost your marketing efforts, improve brand recognition, and provide valuable analytics.',
        date: 'October 26, 2023',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'digital marketing'
    },
    {
        slug: 'api-integration-guide',
        title: 'Getting Started with the MiniFyn API',
        description: 'A step-by-step guide to integrating our powerful link shortening API into your own applications for automated workflows.',
        date: 'October 22, 2023',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'code api'
    },
    {
        slug: 'understanding-analytics',
        title: 'Beyond the Click: Making Sense of Your Link Analytics',
        description: 'Learn how to interpret click data, understand your audience, and make data-driven decisions with MiniFyn’s analytics.',
        date: 'October 18, 2023',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'analytics chart'
    }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">MiniFyn Blog</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Insights, tips, and updates from the MiniFyn team.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col">
            <CardHeader>
              <div className="aspect-[16/9] relative">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="rounded-t-lg object-cover"
                  data-ai-hint={post.imageHint}
                />
              </div>
              <CardTitle className="pt-4">{post.title}</CardTitle>
              <CardDescription>{post.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{post.description}</p>
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
