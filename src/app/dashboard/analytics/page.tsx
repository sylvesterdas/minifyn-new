import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalyticsSummary } from '../actions';
import { ClicksChart } from './clicks-chart';
import { AnalyticsDetailCard } from './analytics-detail-card';
import { Globe, Smartphone, Laptop, SmartphoneNfc } from 'lucide-react';


export default async function AnalyticsPage() {
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
                    icon={Globe}
                 />
                <AnalyticsDetailCard
                    title="Clicks by Platform"
                    data={summary.platforms}
                    categoryKey="platform"
                    valueKey="clicks"
                    iconMap={{
                        'Windows': Laptop,
                        'macOS': Laptop,
                        'Linux': Laptop,
                        'iOS': Smartphone,
                        'Android': SmartphoneNfc,
                    }}
                 />
            </div>
        </div>
    )
}
