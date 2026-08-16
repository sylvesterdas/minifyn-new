import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Smartphone, ExternalLink, ShieldCheck } from 'lucide-react';

interface AppHeaderProps {
  appName: string;
  appSlug: string;
  logoSrc: string;
  tagline?: string;
  navLinks?: { label: string; href: string }[];
  playStoreUrl?: string;
}

export function AppHeader({
  appName,
  appSlug,
  logoSrc,
  tagline,
  navLinks = [],
  playStoreUrl,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href={`/${appSlug}`} className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className={`relative h-9 w-9 overflow-hidden rounded-xl border shadow-sm ${appSlug === 'scamguard' ? 'bg-[#004f7a]' : 'bg-card'}`}>
              <Image
                src={logoSrc}
                alt={`${appName} logo`}
                fill
                className={`object-cover ${appSlug === 'scamguard' ? 'scale-110' : 'p-0.5'}`}
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-foreground">{appName}</span>
                <span className="hidden sm:inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  by MiniFyn
                </span>
              </div>
              {tagline && <span className="text-[11px] text-muted-foreground hidden md:inline">{tagline}</span>}
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm">
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${appSlug}/legal/privacy`}
              className="text-muted-foreground transition-colors hover:text-foreground font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href={`/${appSlug}/legal/terms`}
              className="text-muted-foreground transition-colors hover:text-foreground font-medium"
            >
              Terms
            </Link>
          </div>

          {/* CTA */}
          {playStoreUrl ? (
            <Button asChild size="sm" className="gap-2 font-medium shadow-sm">
              <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
                <Smartphone className="h-4 w-4" />
                <span>Get on Google Play</span>
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link href={`/${appSlug}/legal/privacy`}>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>100% On-Device</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
