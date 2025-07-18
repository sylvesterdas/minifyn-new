
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
import { auth } from '@/lib/firebase';

function RestorePurchaseButton() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleRestore = () => {
        startTransition(async () => {
            const user = auth.currentUser;
            if (!user) {
                toast({ title: 'Authentication Error', description: 'Please sign in again to restore your purchase.', variant: 'destructive' });
                return;
            }
            
            // Get the latest ID token to pass to the server action
            const idToken = await user.getIdToken(true);
            const result = await syncRazorpaySubscription(idToken);

            if (result.success) {
                toast({
                    title: 'Success!',
                    description: result.message,
                });
                // Refresh the entire page to reflect new auth claims and UI changes
                window.location.reload();
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

function getPlanDetails(plan: string | undefined) {
    switch(plan) {
        case 'pro':
            return {
                name: 'Pro',
                description: 'You have access to all premium features.',
                badgeVariant: 'default'
            };
        case 'admin':
            return {
                name: 'Admin',
                description: 'You have full administrative access to all features.',
                badgeVariant: 'destructive'
            };
        default:
            return {
                name: 'Free',
                description: 'Upgrade to unlock advanced features.',
                badgeVariant: 'secondary'
            };
    }
}


export default function BillingPage() {
    const { user } = useAuth();
    const planDetails = getPlanDetails(user?.plan);

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
                            MiniFyn {planDetails.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {planDetails.description}
                        </p>
                    </div>
                    <Badge variant={planDetails.badgeVariant as any} className="capitalize">
                        {user?.plan}
                    </Badge>
                </div>
                {(user?.plan === 'free' || !user?.plan) && (
                    <Button asChild>
                        <Link href="/pricing">Upgrade to Pro</Link>
                    </Button>
                )}
                 {user?.plan === 'pro' && (
                     <p className="text-sm text-muted-foreground">
                        Your subscription is managed by Razorpay. To change your payment method or cancel your subscription, please visit the Razorpay customer portal.
                    </p>
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
