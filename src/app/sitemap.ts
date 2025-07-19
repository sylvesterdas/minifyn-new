import { getPosts } from '@/lib/hashnode';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.minifyn.com';
  const lastModifiedStatic = new Date('2024-01-01').toISOString();

  // 1. Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/features`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/acceptable-use`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/cookie-policy`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/dmca`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/cancellation-and-refund-policy`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/tools`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/tools/code-minifier`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/tools/json-formatter`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/tools/jwt-debugger`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/docs`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/api`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/help`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/help/faq`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/help/report-abuse`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/blog`, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.9 },
  ];

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

  const blogPostRoutes: MetadataRoute.Sitemap = allPosts.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt).toISOString(),
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogPostRoutes];
}
