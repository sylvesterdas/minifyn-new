
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, Settings, Link as LinkIcon, PanelLeft, Key, LineChart, BookText, ExternalLink } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { UserNav } from '@/components/user-nav';
import { useAuth } from '@/hooks/use-auth';
import { SUPER_USER_ID } from '@/lib/config';
import { Skeleton } from '@/components/ui/skeleton';
import Logo from '@/components/logo';
import { useState } from 'react';

const baseNavItems = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/links', label: 'Links', icon: LinkIcon },
];

const superUserNavItems = [
  { href: '/dashboard/analytics', label: 'Analytics', icon: LineChart },
]

const settingsNavItems = [
  { href: '/dashboard/settings/api-keys', label: 'API Keys', icon: Key },
  { href: '/docs/api', label: 'API Docs', icon: BookText, external: true },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
       <div className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-2">
         {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
         ))}
       </div>
    )
  }

  const isSuperUser = user?.uid === SUPER_USER_ID;

  const navItems = [
    ...baseNavItems,
    ...(isSuperUser ? superUserNavItems : []),
    ...settingsNavItems
  ];

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map(({ href, label, icon: Icon, external }) => (
        <Link
          key={href}
          href={href}
          target={external ? '_blank' : '_self'}
          rel={external ? 'noopener noreferrer' : undefined}
          onClick={onLinkClick}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-muted text-primary': pathname === href }
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
          {external && <ExternalLink className="h-3 w-3 ml-auto" />}
        </Link>
      ))}
    </nav>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span className="">MiniFyn</span>
            </Link>
          </div>
          <div className="flex-1">
            <NavLinks />
          </div>
          <div className="mt-auto p-4 border-t">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
         <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Logo />
                    <span>MiniFyn</span>
                  </Link>
                </div>
                <NavLinks onLinkClick={() => setIsMobileMenuOpen(false)} />
                 <div className="mt-auto p-4 border-t">
                    <div onClick={() => setIsMobileMenuOpen(false)}>
                      <UserNav />
                    </div>
                 </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* Mobile Header content can go here if needed */}
            </div>
          </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
