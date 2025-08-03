
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { syncRazorpaySubscription, createRazorpaySubscription, cancelRazorpaySubscription } from '@/app/payments/actions';
import { useState, useTransition, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { trackEvent } from '@/lib/gtag';
import { format } from 'date-fns';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface BillingClientComponentProps {
    user: any;
    initialSubscription: any;
    country: string | null;
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


export function BillingClientComponent({ user, initialSubscription, country }: BillingClientComponentProps) {
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
    const [subscription, setSubscription] = useState<any | null>(initialSubscription);
    const [isCancelling, startCancelTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setSubscription(initialSubscription);
    }, [initialSubscription]);

    const planDetails = getPlanDetails(user?.plan);
    const isFreePlan = user?.plan === 'free';
    const isProPlan = user?.plan === 'pro';
    const isAdminPlan = user?.plan === 'admin';
    const isCancellationPending = subscription?.cancel_scheduled === true;

    const handleUpgrade = async () => {
        if (!user || user.isAnonymous) {
            router.push(`/auth/signup?plan=${planType}`);
            return;
        }

        // Use the server-provided country code for the check
        if (country !== 'IN') {
             toast({
                title: "Coming Soon!",
                description: "The Pro plan is currently available in India only. We're working on expanding to more countries soon!",
            });
            return;
        }

        setIsLoadingPayment(true);
        trackEvent({ action: 'click_upgrade', category: 'conversion', label: 'upgrade_from_billing_page', value: planType === 'monthly' ? 149 : 999 });

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

                    if (syncResult.success) {
                        toast({ title: "Upgrade Complete!", description: "Your plan has been upgraded to Pro." });
                        trackEvent({ action: 'purchase', category: 'conversion', label: `pro_plan_upgrade_${planType}`, value: planType === 'monthly' ? 149 : 999 });
                        window.location.assign('/dashboard/settings/billing');
                    } else {
                         const errorMessage = ('error' in syncResult && syncResult.error) || "An unknown error occurred during activation.";
                         toast({ title: "Activation Pending", description: errorMessage, variant: 'destructive' });
                         setIsLoadingPayment(false);
                    }
                },
                modal: {
                    ondismiss: () => setIsLoadingPayment(false)
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
                setIsLoadingPayment(false);
            });
            rzp.open();

        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Could not initiate payment.',
                variant: 'destructive',
            });
            setIsLoadingPayment(false);
        }
    };
    
    const handleCancel = () => {
        startCancelTransition(async () => {
            const result = await cancelRazorpaySubscription();
            if (result.success && result.subscription) {
                toast({ title: 'Subscription Cancelled', description: 'Your Pro plan will remain active until the end of your current billing period.' });
                setSubscription(result.subscription);
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        });
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
                                    Yearly <span className="text-primary font-semibold">(Save 40%)</span>
                                </Label>
                            </div>
                            <div className="text-center pt-2 transition-all duration-300 text-4xl font-bold">
                                {planType === 'monthly' ? (
                                    <span>₹149 <span className="text-base font-normal text-muted-foreground">/month</span></span>
                                ) : (
                                    <span>₹999 <span className="text-base font-normal text-muted-foreground">/year</span></span>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                             <Button size="lg" className="w-full" onClick={handleUpgrade} disabled={isLoadingPayment}>
                                {isLoadingPayment ? <Loader2 className="animate-spin" /> : 'Upgrade to Pro'}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
                
                {isProPlan && (
                    subscription ? (
                             <Card>
                                <CardHeader>
                                    <CardTitle>Manage Subscription</CardTitle>
                                     <CardDescription>
                                        Manage your current Pro subscription plan.
                                     </CardDescription>
                                </CardHeader>
                                <CardContent>
                                   {isCancellationPending ? (
                                       <div className="p-4 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-3">
                                           <AlertTriangle className="h-5 w-5" />
                                           <div>
                                               <h4 className="font-semibold text-yellow-300">Cancellation Scheduled</h4>
                                               <p className="text-sm">Your subscription has been cancelled. Pro features will remain active until <span className="font-bold">{format(new Date(subscription.current_end * 1000), 'PPP')}.</span></p>
                                           </div>
                                       </div>
                                   ) : (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Status</span>
                                                <span className="font-medium capitalize flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{subscription.status}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Renews on</span>
                                                <span className="font-medium">{format(new Date(subscription.current_end * 1000), 'PPP')}</span>
                                            </div>
                                        </div>
                                   )}
                                </CardContent>
                                {!isCancellationPending && (
                                     <CardFooter className="border-t pt-6">
                                        <Button variant="destructive" onClick={handleCancel} disabled={isCancelling}>
                                            {isCancelling && <Loader2 className="mr-2 animate-spin" />}
                                            Cancel Subscription
                                        </Button>
                                    </CardFooter>
                                )}
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
        </>
    );
}
