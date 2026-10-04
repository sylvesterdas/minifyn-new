import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://www.minifyn.com';
  
  return {
    rules: [
        {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard', '/api'],
        }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
