
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { syncRazorpaySubscription } from '@/app/payments/actions';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface BillingClientComponentProps {
    user: any; // Replace with actual User type
    initialSubscription: any; // Replace with actual Subscription type
}

function RestorePurchaseButton() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleRestore = () => {
        startTransition(async () => {
            const result = await syncRazorpaySubscription();
            if (result.success) {
                toast({
                    title: 'Success!',
                    description: 'Your Pro plan has been successfully synced!',
                    variant: 'default',
                });
                window.location.reload();
            } else {
                 toast({
                    title: 'No Active Subscription Found',
                    description: 'We could not find an active Pro subscription associated with your account.',
                    variant: 'default'
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
                description: 'You are on the Free plan.',
                badgeVariant: 'secondary'
            };
    }
}

export function BillingClientComponent({ user, initialSubscription }: BillingClientComponentProps) {
    const [subscription, setSubscription] = useState<any | null>(initialSubscription);
    const { toast } = useToast();

    const planDetails = getPlanDetails(user?.plan);
    const isFreePlan = user?.plan === 'free';
    const isProPlan = user?.plan === 'pro';

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Plan</CardTitle>
                    <CardDescription>
                        {planDetails.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div>
                            <h3 className="text-lg font-semibold">
                                MiniFyn {planDetails.name}
                            </h3>
                        </div>
                        <Badge variant={planDetails.badgeVariant as any} className="capitalize">
                            {user?.plan}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
            
            {isFreePlan && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upgrade to Pro</CardTitle>
                        <CardDescription>
                           The Pro plan is currently invite-only while we migrate our payment systems.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground">Please check back soon for updates. We appreciate your patience!</p>
                    </CardContent>
                </Card>
            )}
            
            {isProPlan && (
                subscription ? (
                         <Card>
                            <CardHeader>
                                <CardTitle>Manage Subscription</CardTitle>
                                 <CardDescription>
                                    Your subscription is managed by Razorpay. Please note that cancellation is temporarily disabled.
                                 </CardDescription>
                            </CardHeader>
                            <CardContent>
                               <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className="font-medium capitalize">{subscription.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Renews on</span>
                                            <span className="font-medium">{format(new Date(subscription.current_end * 1000), 'PPP')}</span>
                                        </div>
                                    </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscription Not Found</CardTitle>
                                <CardDescription>We could not find your subscription details, but your Pro plan is active. To manage billing, please use the restore purchase button or contact support.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RestorePurchaseButton />
                            </CardContent>
                        </Card>
                    )
            )}

            {isFreePlan && (
                 <Card>
                    <CardHeader>
                         <CardTitle>Restore Purchase</CardTitle>
                         <CardDescription>
                            If you've paid but don't see your Pro features, click here to sync your latest subscription status.
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RestorePurchaseButton />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
