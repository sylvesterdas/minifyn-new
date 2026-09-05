import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.minifyn.com';
  const lastModifiedStatic = new Date('2026-08-30').toISOString();
  const lastModifiedScamGuard = new Date('2026-06-02').toISOString();
  const lastModifiedClipFyn = new Date('2026-08-14').toISOString();
  const lastModifiedCensorFyn = new Date('2026-08-16').toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/blog`, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/pricing`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/features`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/about`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/acceptable-use`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/cookie-policy`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/dmca`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/cancellation-and-refund-policy`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/shipping-and-delivery-policy`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: lastModifiedStatic, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/tools`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/tools/code-minifier`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/tools/json-formatter`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/tools/jwt-debugger`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/tools/link-expander`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/docs/guides/check-shortened-link`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/prepare-video-for-reels`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/redact-personal-information`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/remove-image-metadata`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/debug-jwt-online`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/format-json-online`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/scamguard`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/clipfyn`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/censorfyn`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides/marketing-studio`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/api`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/help`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/help/faq`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/help/report-abuse`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/scamguard`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/scamguard/legal/privacy`, lastModified: lastModifiedScamGuard, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/scamguard/legal/terms`, lastModified: lastModifiedScamGuard, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/clipfyn`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/clipfyn/legal/privacy`, lastModified: lastModifiedClipFyn, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/clipfyn/legal/terms`, lastModified: lastModifiedClipFyn, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/censorfyn`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/censorfyn/legal/privacy`, lastModified: lastModifiedCensorFyn, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/censorfyn/legal/terms`, lastModified: lastModifiedCensorFyn, changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const blogPosts = await getAllBlogPosts();
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => {
      const coverUrl = post.cover.startsWith('/') ? `${siteUrl}${post.cover}` : post.cover;
      return {
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.datePublished).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        images: coverUrl ? [coverUrl] : undefined,
      };
    });
    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
