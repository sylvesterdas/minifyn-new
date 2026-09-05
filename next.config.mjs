import bundleAnalyzer from '@next/bundle-analyzer';

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
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.8', '10.217.12.20', '10.0.2.2', 'localhost', '**.cloudworkstations.dev'],
};

export default withBundleAnalyzer(nextConfig);
