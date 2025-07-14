import { getPosts } from '@/lib/hashnode';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.minifyn.com';

  // 1. Static pages
  const staticRoutes = [
    '/',
    '/features',
    '/contact',
    '/acceptable-use',
    '/cookie-policy',
    '/dmca',
    '/privacy',
    '/refund-policy',
    '/terms',
    '/docs',
    '/docs/api',
    '/docs/guides',
    '/help',
    '/help/faq',
    '/help/report-abuse',
    '/blog',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // 2. Dynamic blog post pages
  let allPosts: { slug: string, publishedAt: string }[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    try {
      const { posts, pageInfo } = await getPosts(50, cursor); // Fetch 50 at a time
      const postData = posts.map(p => ({ slug: p.slug, publishedAt: p.publishedAt }));
      allPosts = allPosts.concat(postData);
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
    } catch (error) {
      console.error("Failed to fetch posts for sitemap, stopping pagination.", error);
      hasNextPage = false;
    }
  }

  const blogPostRoutes = allPosts.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt).toISOString(),
  }));

  return [...staticRoutes, ...blogPostRoutes];
}
