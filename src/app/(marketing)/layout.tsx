import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { GoogleAnalytics } from '@/components/google-analytics';
import { ConsentManager } from '@/components/consent-manager';
import { CookieBanner } from '@/components/cookie-banner';

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <ConsentManager />
      <GoogleAnalytics />
      <Header />
      <Breadcrumbs />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
