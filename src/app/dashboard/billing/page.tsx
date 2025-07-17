
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateRequest } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const revalidate = 0; // Don't cache this page

export default async function BillingPage() {
    const { user } = await validateRequest();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">Billing</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Your Plan</CardTitle>
                    <CardDescription>
                        Manage your subscription and billing details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="text-lg font-semibold">
                                MiniFyn {user?.plan === 'pro' ? 'Pro' : 'Free'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {user?.plan === 'pro' 
                                    ? "You have access to all premium features." 
                                    : "Upgrade to unlock advanced features."}
                            </p>
                        </div>
                         <Badge variant={user?.plan === 'pro' ? 'default' : 'secondary'} className="capitalize">
                            {user?.plan}
                        </Badge>
                    </div>
                    {user?.plan === 'pro' ? (
                        <p className="text-sm text-muted-foreground">
                            Your subscription is managed by Razorpay. To change your payment method or cancel your subscription, please visit the Razorpay customer portal.
                        </p>
                    ) : (
                         <Button asChild>
                            <Link href="/pricing">Upgrade to Pro</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
