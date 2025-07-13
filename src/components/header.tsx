'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from './user-nav';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/blog", label: "Blog" },
    { href: "/help", label: "Help" },
    { href: "/contact", label: "Contact" },
];

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4 sm:px-6">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="MiniFyn Logo" width={32} height={32} />
            <span className="font-bold">MiniFyn</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            {user ? (
                <UserNav />
            ) : (
                <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
                </Button>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="p-4">
                  <nav className="flex flex-col space-y-4">
                     {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4">
                      {user ? (
                        <UserNav />
                      ) : (
                        <Button asChild className="w-full">
                          <Link href="/auth/signin">Sign In</Link>
                        </Button>
                      )}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
