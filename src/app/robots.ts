import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://www.minifyn.com';
  
  return {
    rules: [
        {
            userAgent: '*',
            allow: '/',
            disallow: '/dashboard/',
        }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
