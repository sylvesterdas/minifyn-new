
'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { createRazorpayOrder } from '@/app/payments/actions';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

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
                    <span className={cn(!feature.included && "text-muted-foreground line-through")}>
                        {feature.text}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default function PricingPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        if (!user) {
            toast({ title: 'Please sign in', description: 'You need to be signed in to upgrade your plan.', variant: 'destructive' });
            setIsLoading(false);
            return;
        }

        try {
            const orderResult = await createRazorpayOrder();
            if ('error' in orderResult) {
                throw new Error(orderResult.error);
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderResult.amount,
                currency: orderResult.currency,
                name: "MiniFyn Pro",
                description: "Monthly Subscription",
                order_id: orderResult.id,
                handler: function (response: any) {
                    toast({ title: 'Payment Successful!', description: 'Your plan has been upgraded to Pro.' });
                    window.location.href = '/dashboard';
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#3b82f6" // Accent color
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

  return (
    <>
    <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
    />
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Find Your Plan</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Whether you're just starting out or scaling up, we have a plan that fits your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Free Plan */}
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for personal use and getting started with our platform.</CardDescription>
                <div className="pt-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <FeatureList features={freeFeatures} />
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <Link href="/auth/signup">Get Started for Free</Link>
                </Button>
            </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col border-primary shadow-lg shadow-primary/10">
            <CardHeader>
                 <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For power users and businesses who need more links and advanced analytics.</CardDescription>
                <div className="pt-4">
                    <span className="text-4xl font-bold">₹89</span>
                    <span className="text-muted-foreground">/month</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                 <FeatureList features={proFeatures} />
            </CardContent>
            <CardFooter>
                <Button size="lg" className="w-full" onClick={handleUpgrade} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Upgrade to Pro'}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
    </>
  );
}
