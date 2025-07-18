
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link as LinkIcon, BarChart3, Activity, Globe } from 'lucide-react';
import { getDashboardStats, getAnalyticsSummary } from './actions';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ClicksChart } from './analytics/clicks-chart';
import { AnalyticsDetailCard } from './analytics/analytics-detail-card';
import { LockedFeatureCard } from '@/components/locked-feature-card';

export const revalidate = 3600; // Revalidate every hour

export default async function DashboardPage() {
    const { user } = await validateRequest();
    if (!user || user.isAnonymous) {
        redirect('/auth/signin');
    }

    // Fetch both stats and summary in parallel
    const [stats, summary] = await Promise.all([
        getDashboardStats(),
        getAnalyticsSummary()
    ]);

    const isProOrAdmin = user.plan === 'pro' || user.plan === 'admin';

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Overview</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Clicks
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Across all your links
                    </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Links
                    </CardTitle>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{stats.totalLinks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Created by you
                    </p>
                    </CardContent>
                </Card>
            </div>
             <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-1 pt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Clicks Overview (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                         <ClicksChart data={summary.clicksByDay} />
                    </CardContent>
                </Card>
            </div>
             <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2 pt-6">
                 {isProOrAdmin ? (
                    <>
                        <AnalyticsDetailCard
                            title="Top Referrers"
                            data={summary.referrers}
                            categoryKey="referrer"
                            valueKey="clicks"
                            defaultIconName="globe"
                        />
                        <AnalyticsDetailCard
                            title="Clicks by Platform"
                            data={summary.platforms}
                            categoryKey="platform"
                            valueKey="clicks"
                            iconNameMap={{
                                'Windows': 'laptop',
                                'macOS': 'laptop',
                                'Linux': 'laptop',
                                'iOS': 'smartphone',
                                'Android': 'smartphonenfc',
                            }}
                        />
                    </>
                 ) : (
                    <>
                        <LockedFeatureCard title="Top Referrers" description="See which websites are sending you the most traffic.">
                            {/* Placeholder content for layout */}
                            <div className="space-y-4">
                                <div className="flex items-center"><div className="w-4 h-4 mr-3 bg-muted rounded-full" /><div className="flex-1 bg-muted h-4 rounded" /></div>
                                <div className="flex items-center"><div className="w-4 h-4 mr-3 bg-muted rounded-full" /><div className="flex-1 bg-muted h-4 rounded" /></div>
                                <div className="flex items-center"><div className="w-4 h-4 mr-3 bg-muted rounded-full" /><div className="flex-1 bg-muted h-4 rounded" /></div>
                            </div>
                        </LockedFeatureCard>
                        <LockedFeatureCard title="Clicks by Platform" description="Understand what devices your audience uses.">
                            {/* Placeholder content for layout */}
                             <div className="space-y-4">
                                <div className="flex items-center"><div className="w-4 h-4 mr-3 bg-muted rounded-full" /><div className="flex-1 bg-muted h-4 rounded" /></div>
                                <div className="flex items-center"><div className="w-4 h-4 mr-3 bg-muted rounded-full" /><div className="flex-1 bg-muted h-4 rounded" /></div>
                                <div className="flex items-center"><div className="w-4 h-4 mr-3 bg-muted rounded-full" /><div className="flex-1 bg-muted h-4 rounded" /></div>
                            </div>
                        </LockedFeatureCard>
                    </>
                 )}
            </div>
        </>
    );
}
