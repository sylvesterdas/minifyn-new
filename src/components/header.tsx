import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="MiniFyn Logo" width={32} height={32} />
            <span className="font-bold">MiniFyn</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <Button asChild>
            <Link href="/dashboard">Get Started Free</Link>
          </Button>
          {/* Add mobile menu button here if needed */}
        </div>
      </div>
    </header>
  );
}
