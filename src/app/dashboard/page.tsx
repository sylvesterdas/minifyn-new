
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Link as LinkIcon, BarChart3, CheckCircle } from 'lucide-react';
import { getDashboardStats, getAnalyticsSummary } from './actions';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ClicksChart } from './analytics/clicks-chart';
import { AnalyticsDetailCard } from './analytics/analytics-detail-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const { user } = await validateRequest();

    // Protect the page on the server. If the user is not logged in or is anonymous,
    // redirect them to the sign-in page before rendering anything.
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
                        <CardDescription>
                            This is an overview of clicks across all your links. For detailed, link-specific analytics, please visit the{' '}
                            <Link href="/dashboard/analytics" className="text-primary underline">Analytics</Link> page.
                        </CardDescription>
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
                            categoryKey="name"
                            valueKey="value"
                            defaultIconName="globe"
                        />
                        <AnalyticsDetailCard
                            title="Clicks by Platform"
                            data={summary.platforms}
                            categoryKey="name"
                            valueKey="value"
                            
                        />
                    </>
                 ) : (
                    <>
                       <Card>
                           <CardHeader>
                                <CardTitle>Advanced Analytics</CardTitle>
                                <CardDescription>Unlock detailed insights into your link performance with our Pro plan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> See top referrers</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Analyze clicks by country, platform, and browser</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Get 1-year data retention</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="secondary" disabled>
                                    <Link href="/dashboard/settings/billing">Pro Plan Coming Soon</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                         <Card>
                           <CardHeader>
                                <CardTitle>Permanent Links</CardTitle>
                                <CardDescription>Ensure your links work forever by upgrading to the Pro plan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <p className="text-sm text-muted-foreground">On the Free plan, links expire after 60 days. With Pro, your links are permanent and will never be deleted.</p>
                            </CardContent>
                             <CardFooter>
                                <Button asChild variant="secondary" disabled>
                                    <Link href="/dashboard/settings/billing">Pro Plan Coming Soon</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </>
                 )}
            </div>
        </>
    );
}
