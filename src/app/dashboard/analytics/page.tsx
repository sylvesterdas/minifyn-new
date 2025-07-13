'use server';

import { validateRequest } from '@/lib/auth';
import { getAnalyticsSummary } from '../actions';
import { SUPER_USER_ID } from '@/lib/config';
import { ClicksChart } from './clicks-chart';
import { AnalyticsDetailCard } from './analytics-detail-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function AnalyticsPage() {
    const { user } = await validateRequest();

    // Only allow SUPER_USER to see this page for now
    if (user?.uid !== SUPER_USER_ID) {
        return (
             <div className="flex items-center justify-center h-full">
                <Card className="text-center max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                           <Lock className="h-8 w-8 text-primary"/>
                            Coming Soon
                        </CardTitle>
                        <CardDescription>
                           Detailed, link-specific analytics will be available here soon as a premium feature!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This page is currently under construction.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Super user can see the full page
    const summary = await getAnalyticsSummary();

    return (
         <div className="flex flex-col gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">Full Analytics (Admin View)</h1>
             <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7 pt-6">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Clicks Overview</CardTitle>
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
