import type { Metadata } from 'next';
import { getAllBlogPosts, getAllTags } from '@/lib/blog';
import { Suspense } from 'react';
import { BlogIndexClient } from '@/components/blog-index-client';

export const revalidate = false;

export const metadata: Metadata = {
  title: 'MiniFyn Blog | Tech Insights, URL Optimization & Developer Guides',
  description: 'Explore articles on link management, web security, developer productivity tools, modern Next.js architecture, and AI-powered mobile apps.',
  alternates: {
    canonical: 'https://www.minifyn.com/blog',
  },
  openGraph: {
    title: 'MiniFyn Blog | Tech Insights, URL Optimization & Developer Guides',
    description: 'Explore articles on link management, web security, developer productivity tools, and AI mobile apps.',
    url: 'https://www.minifyn.com/blog',
    siteName: 'MiniFyn',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiniFyn Blog | Tech Insights, URL Optimization & Developer Guides',
    description: 'Explore articles on link management, web security, developer productivity tools, and AI mobile apps.',
  },
};

export default async function BlogIndexPage() {
  const [allPosts, tags] = await Promise.all([getAllBlogPosts(), getAllTags()]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MiniFyn Blog',
    description: 'Explore articles on link management, web security, developer productivity tools, and modern web architecture.',
    url: 'https://www.minifyn.com/blog',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: allPosts.slice(0, 20).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.minifyn.com/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <BlogIndexClient allPosts={allPosts} tags={tags} />
      </Suspense>
    </>
  );
}
