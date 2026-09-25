import { readFileSync } from 'node:fs';
import bundleAnalyzer from '@next/bundle-analyzer';

const pricingCountries = JSON.parse(readFileSync(new URL('./src/lib/pricing-countries.json', import.meta.url), 'utf8'));

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'blog.minifyn.com',
          },
        ],
        destination: 'https://www.minifyn.com/blog/:path*',
        permanent: true,
      },
      {
        source: '/linkguard',
        destination: '/scamguard',
        permanent: true,
      },
      {
        source: '/linkguard/:path*',
        destination: '/scamguard/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.EXTERNAL_API_URL || process.env.NEXT_PUBLIC_GO_BACKEND_URL;
    const countryRewrite = (value, tier) => ({
      source: '/pricing',
      has: [{ type: 'header', key: 'x-vercel-ip-country', ...(value && { value }) }],
      destination: `/pricing/${tier}`,
    });
    const pricingRewrites = [
      countryRewrite('IN', 'in'),
      countryRewrite(`(?:${pricingCountries.unknown.join('|')})`, 'tier1'),
      countryRewrite(`(?:${pricingCountries.tier1.join('|')})`, 'tier1'),
      countryRewrite(`(?:${pricingCountries.tier2.join('|')})`, 'tier2'),
      countryRewrite(undefined, 'tier3'),
    ];
    const backendRewrites = backendUrl
      ? [
          {
            source: '/api/tools/link-expander',
            destination: `${backendUrl}/api/tools/link-expander`,
          },
          {
            source: '/api/shorten',
            destination: `${backendUrl}/api/shorten`,
          },
        ]
      : [];
    return {
      beforeFiles: [...pricingRewrites, ...backendRewrites],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/api/linkguard/:path*",
        headers: [
          { key: "Deprecation", value: "true" },
          { key: "Sunset", value: "2027-01-01" },
          { key: "Link", value: '</api/scamguard/v1/check>; rel="successor-version"' },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://google.com https://*.google.com https://*.googlesyndication.com;"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ],
      },
    ];
  },
  images: {
    formats: ['image/webp'],
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.hashnode.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'flagcdn.com' },
    ],
  },
  allowedDevOrigins: ['192.168.1.8', '10.217.12.20', '10.0.2.2', 'localhost', '**.cloudworkstations.dev'],
};

export default withBundleAnalyzer(nextConfig);
