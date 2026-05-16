import type { MetadataRoute } from 'next';



export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.minifyn.com';
  const lastModifiedStatic = new Date('2024-01-01').toISOString();

  // 1. Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 1.0 },
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
    { url: `${siteUrl}/docs`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/api`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/docs/guides`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/help`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/help/faq`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/help/report-abuse`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.5 },
  ];

  return staticRoutes;
}
