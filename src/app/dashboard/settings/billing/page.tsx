
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { syncRazorpaySubscription } from '@/app/payments/actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

function RestorePurchaseButton() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    const handleRestore = () => {
        startTransition(async () => {
            const result = await syncRazorpaySubscription();
            if (result.success) {
                toast({
                    title: 'Success!',
                    description: result.message,
                });
                // Refresh the entire page to reflect new auth claims and UI changes
                router.refresh();
            } else {
                 toast({
                    title: 'No Active Subscription Found',
                    description: result.error,
                    variant: 'destructive'
                });
            }
        });
    }
    
    return (
        <Button onClick={handleRestore} variant="secondary" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 animate-spin" /> : <RefreshCw className="mr-2" />}
            Restore Purchase
        </Button>
    )
}

export default function BillingPage() {
    const { user } = useAuth();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Plan</CardTitle>
                <CardDescription>
                    Manage your subscription and billing details.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
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
            <CardFooter className="border-t pt-6 flex-col items-start gap-4">
                <div>
                     <h3 className="font-semibold">Missing your Pro features?</h3>
                     <p className="text-sm text-muted-foreground">
                        If you've paid but don't see your Pro features, click here to sync your latest subscription status.
                     </p>
                </div>
                <RestorePurchaseButton />
            </CardFooter>
        </Card>
    );
}
