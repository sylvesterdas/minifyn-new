import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog';
import { Calendar, Clock, ArrowLeft, Share2, Tag, BookOpen, Shield, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.slice(0, 50).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | MiniFyn Blog',
      robots: { index: false, follow: false },
    };
  }

  const title = `${post.seoTitle || post.title} | MiniFyn Blog`;
  const description = post.seoDescription || post.title;
  const canonicalUrl = `https://www.minifyn.com/blog/${post.slug}`;
  const imageUrl = post.ogImage || post.cover;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.datePublished,
      authors: ['Sylvester Das'],
      tags: post.tags,
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getAllBlogPosts()]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.title,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.minifyn.com/blog/${post.slug}`,
    },
    author: {
      '@type': 'Person',
      name: 'Sylvester Das',
      url: 'https://www.minifyn.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MiniFyn',
      url: 'https://www.minifyn.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.minifyn.com/favicon.ico',
      },
    },
    image: post.cover || post.ogImage || undefined,
    keywords: post.tags.join(', '),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.minifyn.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.minifyn.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.minifyn.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <article className="min-h-screen bg-background pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="border-b bg-muted/10">
        <div className="container mx-auto px-4 max-w-4xl py-10 md:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all articles
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.tags.slice(0, 3).map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                SD
              </div>
              <span className="font-medium text-foreground">Sylvester Das</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(post.datePublished), 'MMMM d, yyyy')}</span>
            </div>
            {post.readingTime && (
              <>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readingTime}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl pt-8">
        {post.cover && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-muted mb-10 shadow-sm">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              unoptimized={post.cover.startsWith('/api/og')}
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <div
          className="prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-pre:border prose-pre:bg-muted/50"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mt-14 border-t pt-8">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
            Tags & Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className="rounded-md border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Powered by MiniFyn
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Boost your link performance & web security
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Shorten links in ~15ms, generate branded QR codes, and trace phishing threats with ScamGuard.
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
          >
            Try MiniFyn Free
          </Link>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group flex flex-col rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <span className="text-[11px] font-medium text-primary mb-1">
                    #{rel.tags[0] || 'guide'}
                  </span>
                  <h4 className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <span className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(rel.datePublished), 'MMM d, yyyy')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
