import { Footer } from '@/components/footer';
import { GoogleAnalytics } from '@/components/google-analytics';
import { ConsentManager } from '@/components/consent-manager';
import Link from 'next/link';
import { CookieBanner } from '@/components/cookie-banner';
import Logo from '@/components/logo';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ConsentManager />
      <GoogleAnalytics />
      <header className="p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <Logo />
          <span className="font-bold text-lg">MiniFyn</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
