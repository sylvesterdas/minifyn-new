import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="text-center max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                       <BarChart3 className="h-8 w-8 text-primary"/>
                        Detailed Analytics
                    </CardTitle>
                    <CardDescription>
                        This page is under construction. Detailed, link-specific analytics will be available here soon!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        In the meantime, you can see an overview of your total clicks on the main dashboard.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
