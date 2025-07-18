
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { syncRazorpaySubscription, createRazorpaySubscription } from '@/app/payments/actions';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { trackEvent } from '@/lib/gtag';
import { setSessionCookie } from '@/app/auth/cookie';

declare global {
    interface Window {
        Razorpay: any;
    }
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


export default function BillingPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
    const { toast } = useToast();
    const router = useRouter();

    const planDetails = getPlanDetails(user?.plan);
    const isFreePlan = user?.plan === 'free';

    const handleUpgrade = async () => {
        if (!user || user.isAnonymous) {
            toast({ title: 'Please sign in to upgrade.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        trackEvent({ action: 'click_upgrade', category: 'conversion', label: 'upgrade_from_billing_page', value: planType === 'monthly' ? 89 : 899 });

        try {
            const subscriptionResult = await createRazorpaySubscription(planType);
            if ('error' in subscriptionResult) {
                throw new Error(subscriptionResult.error);
            }
            
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: subscriptionResult.subscriptionId,
                name: "MiniFyn Pro",
                description: planType === 'monthly' ? 'Monthly Subscription' : 'Yearly Subscription',
                handler: async function (response: any) {
                    toast({ title: 'Payment Successful!', description: 'Finalizing your upgrade...' });
                    
                    const syncResult = await syncRazorpaySubscription();

                    if (syncResult.success && syncResult.sessionCookie) {
                        await setSessionCookie(syncResult.sessionCookie);
                        toast({ title: "Upgrade Complete!", description: "Your plan has been upgraded to Pro." });
                        trackEvent({ action: 'purchase', category: 'conversion', label: `pro_plan_upgrade_${planType}`, value: planType === 'monthly' ? 89 : 899 });
                         // Use window.location.assign for a hard refresh to ensure user claims are updated.
                        window.location.assign('/dashboard');
                    } else {
                        toast({ title: "Activation Pending", description: "Your payment was successful, but activation is taking a moment. Please try restoring your purchase or refresh the page in a few minutes.", variant: 'destructive' });
                    }
                    setIsLoading(false);
                },
                modal: {
                    ondismiss: () => setIsLoading(false) // Reset loading state if modal is closed
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#1e40af"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
                setIsLoading(false);
            });
            rzp.open();

        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Could not initiate payment.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };


    return (
        <>
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
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
                                Choose a billing cycle and unlock all premium features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="flex justify-center items-center gap-4">
                                <Label htmlFor="plan-toggle" className={cn(planType === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</Label>
                                <Switch
                                    id="plan-toggle"
                                    checked={planType === 'yearly'}
                                    onCheckedChange={(checked) => setPlanType(checked ? 'yearly' : 'monthly')}
                                    aria-label="Toggle between monthly and yearly billing"
                                />
                                <Label htmlFor="plan-toggle" className={cn(planType === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
                                    Yearly <span className="text-primary font-semibold">(Save 15%)</span>
                                </Label>
                            </div>
                            <div className="text-center pt-2 transition-all duration-300 text-4xl font-bold">
                                {planType === 'monthly' ? (
                                    <span>₹89 <span className="text-base font-normal text-muted-foreground">/month</span></span>
                                ) : (
                                    <span>₹899 <span className="text-base font-normal text-muted-foreground">/year</span></span>
                                )}
                            </div>
                            <Button size="lg" className="w-full" onClick={handleUpgrade} disabled={isLoading || isAuthLoading}>
                                {isLoading || isAuthLoading ? <Loader2 className="animate-spin" /> : 'Upgrade and Pay'}
                            </Button>
                        </CardContent>
                    </Card>
                )}

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
            </div>
        </>
    );
}
