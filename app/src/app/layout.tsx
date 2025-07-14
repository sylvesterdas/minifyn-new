
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { validateRequest } from '@/lib/auth';
import { GoogleAnalytics } from '@/components/google-analytics';
import { ConsentManager } from '@/components/consent-manager';
import { CookieBanner } from '@/components/cookie-banner';

export const metadata: Metadata = {
  title: 'MiniFyn - Simple URL Shortener',
  description: 'The simplest way to shorten, share, and track your links.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider serverUser={user}>
          <ConsentManager />
          <GoogleAnalytics />
          {children}
          <Toaster />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
