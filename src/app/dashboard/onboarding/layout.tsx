// This file is no longer used by the primary user flow.
// It can be safely deleted.
import Logo from '@/components/logo';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <Logo />
          <span className="font-bold text-lg">MiniFyn</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} MiniFyn. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
}
