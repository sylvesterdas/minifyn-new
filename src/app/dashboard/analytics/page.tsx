
import { validateRequest } from '@/lib/auth';
import { getAnalyticsSummary } from '../actions';
import { ClicksChart } from './clicks-chart';
import { AnalyticsDetailCard } from './analytics-detail-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

export default async function AnalyticsPage() {
    const { user } = await validateRequest();
    
    // Allow 'pro' and 'admin' users to see this page
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
                            <Link href="/pricing">Upgrade to Pro</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Pro and Admin users can see the full page
    const summary = await getAnalyticsSummary();

    return (
         <div className="flex flex-col gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
             <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7 pt-6">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Clicks Overview (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                         <ClicksChart data={summary.clicksByDay} />
                    </CardContent>
                </Card>
                 <div className="lg:col-span-3 space-y-4">
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
         </div>
    );
}
