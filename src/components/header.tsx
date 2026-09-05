
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from './user-nav';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Logo from './logo';
import { useState } from 'react';

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
    { href: "/tools", label: "Dev Tools" },
];

export function Header() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4 sm:px-6">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-bold">MiniFyn</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            {user && !user.isAnonymous ? (
                <UserNav />
            ) : (
                <>
                    <Button asChild variant="ghost">
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                </>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
                        <Link 
                            key={link.href} 
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4">
                      {user && !user.isAnonymous ? (
                        <div onClick={() => setIsMobileMenuOpen(false)}>
                          <UserNav />
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                                    Sign In
                                </Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    Sign Up
                                </Link>
                            </Button>
                        </div>
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
