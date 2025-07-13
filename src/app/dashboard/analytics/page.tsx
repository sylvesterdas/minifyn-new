import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalyticsSummary } from '../actions';
import { ClicksChart } from './clicks-chart';
import { AnalyticsDetailCard } from './analytics-detail-card';
import { validateRequest } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function AnalyticsPage() {
    const { user } = await validateRequest();
    
    // For now, we'll consider verified users as "paid" or "premium" users
    const isPremiumUser = user?.email_verified;

    if (!isPremiumUser) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="text-center max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                           <BarChart3 className="h-8 w-8 text-primary"/>
                            Unlock Detailed Analytics
                        </CardTitle>
                        <CardDescription>
                            Gain deeper insights into your link performance by upgrading your account. Track trends, referrers, platforms, and more.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/dashboard/settings">Upgrade Your Account</Link>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-3">
                            For now, just verify your email to unlock this page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const summary = await getAnalyticsSummary();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Clicks Overview</CardTitle>
                    <CardDescription>An overview of link clicks over the past 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ClicksChart data={summary.clicksByDay} />
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
            </div>
        </div>
    )
}
