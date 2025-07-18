
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const settingsNavItems = [
    { href: '/dashboard/settings/profile', label: 'Profile' },
    { href: '/dashboard/settings/api-keys', label: 'API Keys' },
    { href: '/dashboard/settings/billing', label: 'Billing', plans: ['free', 'pro', 'admin'] },
];

function SettingsNav() {
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <Skeleton className="h-10 w-[280px]" />
    }
    
    const userPlan = user?.plan || 'free';
    const visibleItems = settingsNavItems.filter(item => !item.plans || item.plans.includes(userPlan));

    return (
        <nav className="flex space-x-2 lg:space-x-4 border-b">
            {visibleItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'shrink-0 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
                        pathname === item.href ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent'
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}


export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings, API keys, and billing information.
                </p>
            </div>
            
            <SettingsNav />

            <div className="max-w-4xl">
                {children}
            </div>
        </div>
    );
}
