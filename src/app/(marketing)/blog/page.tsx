import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllBlogPosts, getAllTags } from '@/lib/blog';
import { Calendar, Clock, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 3600;

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

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; q?: string }>;
}) {
  const { tag: activeTag, q: query } = await searchParams;
  const [allPosts, tags] = await Promise.all([getAllBlogPosts(), getAllTags()]);

  const filteredPosts = allPosts.filter((post) => {
    const matchesTag = !activeTag || post.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.seoDescription.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchesTag && matchesQuery;
  });

  const featuredPost = !activeTag && !query ? filteredPosts[0] : null;
  const regularPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MiniFyn Blog',
    description: 'Explore articles on link management, web security, developer productivity tools, and modern web architecture.',
    url: 'https://www.minifyn.com/blog',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filteredPosts.slice(0, 20).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.minifyn.com/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b bg-muted/20 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur mb-6">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>MiniFyn Knowledge & Engineering</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            MiniFyn <span className="text-primary">Blog</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep-dives into URL shortening, web security, developer utilities, and modern tech tutorials.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <Link
              href="/blog"
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                !activeTag ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({allPosts.length})
            </Link>
            {tags.slice(0, 10).map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                  activeTag?.toLowerCase() === tag.toLowerCase()
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                #{tag} ({count})
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {activeTag && (
          <div className="mb-8 flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Showing articles tagged <span className="text-primary">#{activeTag}</span>
            </h2>
            <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground">
              Clear filter
            </Link>
          </div>
        )}

        {featuredPost && (
          <div className="mb-14">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-2xl border bg-card p-6 md:p-8 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {featuredPost.cover && (
                <div className="md:col-span-7 relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={featuredPost.cover}
                    alt={featuredPost.title}
                    fill
                    unoptimized={featuredPost.cover.startsWith('/api/og')}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}
              <div className={`${featuredPost.cover ? 'md:col-span-5' : 'md:col-span-12'} flex flex-col gap-4`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Featured Post
                  </span>
                  {featuredPost.tags[0] && (
                    <span className="text-xs font-medium text-muted-foreground">
                      #{featuredPost.tags[0]}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {featuredPost.seoDescription || featuredPost.title}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(featuredPost.datePublished), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-primary ml-auto group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {regularPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No articles found matching your criteria.</p>
            <Link href="/blog" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              View all articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-md"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col flex-1">
                  {post.cover ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        unoptimized={post.cover.startsWith('/api/og')}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-6">
                      <BookOpen className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                      {post.seoDescription || post.title}
                    </p>
                    <div className="flex items-center justify-between border-t pt-3 mt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.datePublished), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-primary">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
