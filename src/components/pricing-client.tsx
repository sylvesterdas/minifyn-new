
'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { createRazorpaySubscription } from '@/app/payments/actions';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { updateUserProfile } from '@/app/dashboard/settings/actions';
import { trackEvent } from '@/lib/gtag';

const freeFeatures = [
    { text: '20 Links / Day', included: true },
    { text: 'Links Expire in 60 Days', included: true },
    { text: 'Basic Clicks (7-day history)', included: true },
    { text: 'Developer API Access', included: true },
    { text: 'Advanced Analytics', included: false },
    { text: 'Links Never Expire', included: false },
];

const proFeatures = [
    { text: '100 Links / Day', included: true },
    { text: 'Links Never Expire', included: true },
    { text: 'Advanced (Geo & Referrers, 1-year history)', included: true },
    { text: 'Developer API Access', included: true },
    { text: 'Custom Slugs (Coming Soon)', included: true },
];

declare global {
    interface Window {
        Razorpay: any;
    }
}

function FeatureList({ features }: { features: { text: string; included: boolean }[] }) {
    return (
        <ul className="space-y-4">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={cn("text-sm", !feature.included && "text-muted-foreground line-through")}>
                        {feature.text}
                    </span>
                </li>
            ))}
        </ul>
    );
}

interface PricingPageClientProps {
    context?: 'pricingPage' | 'onboarding';
}

export function PricingPageClient({ context = 'pricingPage' }: PricingPageClientProps) {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
    const router = useRouter();

    const handleUpgrade = async () => {
        setIsLoading(true);

        const eventLabel = context === 'onboarding' ? 'upgrade_from_onboarding' : 'upgrade_from_pricing_page';
        trackEvent({ action: 'click_upgrade', category: 'conversion', label: eventLabel, value: planType === 'monthly' ? 89 : 899 });

        if (!user) {
            toast({ title: 'Please sign in', description: 'You need to sign up or sign in to upgrade your plan.', variant: 'destructive' });
            router.push('/auth/signup');
            setIsLoading(false);
            return;
        }

        try {
            const subscriptionResult = await createRazorpaySubscription(planType);
            if ('error' in subscriptionResult) {
                throw new Error(subscriptionResult.error);
            }
            
            // Mark onboarding as complete as part of the upgrade process
            const formData = new FormData();
            formData.append('name', user.name || '');
            formData.append('isOnboarding', 'true');
            await updateUserProfile(null, formData);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: subscriptionResult.subscriptionId,
                name: "MiniFyn Pro",
                description: planType === 'monthly' ? 'Monthly Subscription' : 'Yearly Subscription',
                handler: function (response: any) {
                    toast({ title: 'Payment Successful!', description: 'Your plan has been upgraded to Pro.' });
                    trackEvent({ action: 'purchase', category: 'conversion', label: 'pro_plan', value: planType === 'monthly' ? 89 : 899 });
                    window.location.href = '/dashboard';
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#3b82f6"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
            });
            rzp.open();

        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Could not initiate payment.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isAuthLoading && context === 'pricingPage') {
        return (
             <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <Card className="flex flex-col"><CardHeader><Skeleton className="h-8 w-1/4" /><Skeleton className="h-4 w-3/4 mt-2" /></CardHeader><CardContent className="flex-grow space-y-4">{[...Array(6)].map((_, i) => (<Skeleton key={i} className="h-6 w-full" />))}</CardContent><CardFooter><Skeleton className="h-11 w-full" /></CardFooter></Card>
                <Card className="flex flex-col"><CardHeader><Skeleton className="h-8 w-1/4" /><Skeleton className="h-4 w-3/4 mt-2" /></CardHeader><CardContent className="flex-grow space-y-4">{[...Array(5)].map((_, i) => (<Skeleton key={i} className="h-6 w-full" />))}</CardContent><CardFooter><Skeleton className="h-11 w-full" /></CardFooter></Card>
            </div>
        )
    }

    const userPlan = user?.plan;
    
    // Onboarding context has a different layout, we only show the Pro part.
    if (context === 'onboarding') {
        return (
             <>
                <Script
                    id="razorpay-checkout-js"
                    src="https://checkout.razorpay.com/v1/checkout.js"
                />
                <div className="flex justify-center items-center gap-4 mb-6">
                    <Label htmlFor="plan-toggle" className={cn('text-sm', planType === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</Label>
                    <Switch
                        id="plan-toggle"
                        checked={planType === 'yearly'}
                        onCheckedChange={(checked) => setPlanType(checked ? 'yearly' : 'monthly')}
                        aria-label="Toggle between monthly and yearly billing"
                    />
                    <Label htmlFor="plan-toggle" className={cn('text-sm', planType === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
                        Yearly <span className="text-primary font-semibold">(Save 15%)</span>
                    </Label>
                </div>
                <div className="text-center pt-2 transition-all duration-300">
                     {planType === 'monthly' ? (
                        <>
                            <span className="text-4xl font-bold">₹89</span>
                            <span className="text-muted-foreground">/month</span>
                        </>
                     ) : (
                        <>
                            <span className="text-4xl font-bold">₹899</span>
                            <span className="text-muted-foreground">/year</span>
                        </>
                     )}
                </div>
                 <div className="my-6">
                    <FeatureList features={proFeatures} />
                 </div>
                <Button size="lg" className="w-full" onClick={handleUpgrade} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Get Pro Now'}
                </Button>
            </>
        )
    }


    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <div className="flex justify-center items-center gap-4 mb-8">
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
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Free Plan */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free</CardTitle>
                        <CardDescription>Perfect for personal use and getting started with our platform.</CardDescription>
                        <div className="pt-4">
                            <span className="text-4xl font-bold">₹0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <FeatureList features={freeFeatures} />
                    </CardContent>
                    <CardFooter>
                        {userPlan === 'free' ? (
                            <Button size="lg" className="w-full" disabled>Your Current Plan</Button>
                        ) : userPlan === 'pro' ? (
                            <Button size="lg" className="w-full" disabled variant="outline">Downgrade not supported</Button>
                        ) : (
                            <Button asChild size="lg" className="w-full">
                                <Link href="/auth/signup">Get Started for Free</Link>
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="flex flex-col border-primary shadow-lg shadow-primary/10">
                    <CardHeader>
                        <CardTitle className="text-2xl">Pro</CardTitle>
                        <CardDescription>For power users and businesses who need more links and advanced analytics.</CardDescription>
                        <div className="pt-4 transition-all duration-300">
                             {planType === 'monthly' ? (
                                <>
                                    <span className="text-4xl font-bold">₹89</span>
                                    <span className="text-muted-foreground">/month</span>
                                </>
                             ) : (
                                <>
                                    <span className="text-4xl font-bold">₹899</span>
                                    <span className="text-muted-foreground">/year</span>
                                </>
                             )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <FeatureList features={proFeatures} />
                    </CardContent>
                    <CardFooter>
                        {userPlan === 'pro' ? (
                            <Button size="lg" className="w-full" disabled>Your Current Plan</Button>
                        ) : (
                            <Button size="lg" className="w-full" onClick={handleUpgrade} disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : (user && !user.isAnonymous ? 'Upgrade to Pro' : 'Get Pro')}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
