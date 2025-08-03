
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { GoogleAnalytics } from '@/components/google-analytics';
import { ConsentManager } from '@/components/consent-manager';
import { CookieBanner } from '@/components/cookie-banner';
import { PageLoader } from '@/components/page-loader';
import { Suspense } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://minifyn.com'),
  title: 'MiniFyn - Simple URL Shortener',
  description: 'The simplest way to shorten, share, and track your links',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <Suspense fallback={null}>
              <PageLoader />
            </Suspense>
            <ConsentManager />
            <GoogleAnalytics />
            {children}
            <CookieBanner />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
