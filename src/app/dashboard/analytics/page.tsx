

'use client';

import { useState, useEffect, useTransition, Suspense, useCallback } from 'react';
import { getAnalyticsSummary, getUserLinks, searchUserLinks, type AnalyticsSummary, type UserLink } from '../actions';
import { ClicksChart } from './clicks-chart';
import { AnalyticsDetailCard } from './analytics-detail-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-client';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { AnalyticsToolbar } from './analytics-toolbar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';

function AnalyticsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Skeleton className="h-24 w-full" />
                <div className="lg:col-span-3 flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
             <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7 pt-6">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent className="pl-2">
                         <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>
                 <div className="lg:col-span-3 space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                 </div>
            </div>
        </div>
    )
}

function AnalyticsPageComponent() {
    const { user, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const shortcodeFromQuery = searchParams.get('shortcode');

    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [userLinks, setUserLinks] = useState<UserLink[]>([]);
    const [isAnalyticsPending, startAnalyticsTransition] = useTransition();
    const [isSearchPending, startSearchTransition] = useTransition();
    
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(startOfDay(new Date()), 29),
        to: endOfDay(new Date()),
    });
    const [selectedLink, setSelectedLink] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    // Initial fetch for the 10 most recent links
    useEffect(() => {
        if (user?.plan === 'pro' || user?.plan === 'admin') {
            getUserLinks(10).then(links => {
                setUserLinks(links);
                const linkToSelect = shortcodeFromQuery && links.some(link => link.id === shortcodeFromQuery)
                    ? shortcodeFromQuery
                    : links[0]?.id;
                
                if (linkToSelect) {
                    setSelectedLink(linkToSelect);
                }
            });
        }
    }, [user?.plan, shortcodeFromQuery]);

    // Fetch analytics when selected link or date range changes
    useEffect(() => {
        if (selectedLink && dateRange?.from && dateRange?.to && (user?.plan === 'pro' || user?.plan === 'admin')) {
            startAnalyticsTransition(async () => {
                const range = { from: dateRange.from!.toISOString(), to: dateRange.to!.toISOString() };
                const newSummary = await getAnalyticsSummary(range, selectedLink);
                setSummary(newSummary);
            });
        }
    }, [dateRange, selectedLink, user?.plan]);
    
    // Perform backend search when debounced search term changes
    useEffect(() => {
        if (debouncedSearchTerm.length > 0) {
            startSearchTransition(async () => {
                const searchResults = await searchUserLinks(debouncedSearchTerm);
                // Replace with search results only
                setUserLinks(searchResults);
            });
        } else {
            // If search is cleared, revert to the initial 10 links
            getUserLinks(10).then(links => setUserLinks(links));
        }
    }, [debouncedSearchTerm]);
    
    // Show loading while auth is loading OR user exists but plan isn't loaded yet
    if (isLoading || (user && !user.plan)) {
        return <AnalyticsSkeleton />;
    }
    
    if (user?.plan !== 'pro' && user?.plan !== 'admin') {
        return (
             <div className="flex items-center justify-center h-full">
                <Card className="text-center max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                           <Lock className="h-8 w-8 text-primary"/>
                            Upgrade for Full Analytics
                        </CardTitle>
                        <CardDescription>
                           Get detailed, link-specific analytics by upgrading to our Pro plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Track referrers, geographic location, and more for every link you create.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/settings/billing">Upgrade to Pro</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!userLinks.length && !isAnalyticsPending && !isSearchPending) {
      return (
        <div className="flex items-center justify-center h-full">
            <Card className="text-center max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                        No Links Found
                    </CardTitle>
                    <CardDescription>
                        You haven't created any links yet. Create one to see analytics.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/links">Create a Link</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      )
    }

    if (isAnalyticsPending || !summary || !selectedLink) {
        return <AnalyticsSkeleton />;
    }

    return (
         <div className="flex flex-col gap-6">
            <AnalyticsToolbar 
                dateRange={dateRange}
                setDateRange={setDateRange}
                userLinks={userLinks}
                selectedLink={selectedLink}
                setSelectedLink={setSelectedLink}
                totalClicks={summary.totalClicks}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearchPending}
            />

             <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7 pt-6">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Clicks Overview</CardTitle>
                        <CardDescription>Total clicks over the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                         <ClicksChart data={summary.clicksByDay} />
                    </CardContent>
                </Card>
                 <div className="lg:col-span-3 space-y-4">
                    <AnalyticsDetailCard
                        title="Top Referrers"
                        data={summary.referrers}
                        categoryKey="name"
                        valueKey="value"
                        defaultIconName="Direct"
                     />
                    <AnalyticsDetailCard
                        title="Top Countries"
                        data={summary.countries}
                        categoryKey="name"
                        valueKey="value"
                     />
                    <AnalyticsDetailCard
                        title="Platforms"
                        data={summary.platforms}
                        categoryKey="name"
                        valueKey="value"
                    />
                     <AnalyticsDetailCard
                        title="Browsers"
                        data={summary.browsers}
                        categoryKey="name"
                        valueKey="value"
                    />
                 </div>
            </div>
         </div>
    );
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsPageComponent />
        </Suspense>
    );
}
