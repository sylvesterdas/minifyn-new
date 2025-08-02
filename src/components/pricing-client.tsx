
'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

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

export function PricingPageClient() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    if (isAuthLoading) {
        return (
             <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <Card className="flex flex-col"><CardHeader><Skeleton className="h-8 w-1/4" /><Skeleton className="h-4 w-3/4 mt-2" /></CardHeader><CardContent className="flex-grow space-y-4">{[...Array(6)].map((_, i) => (<Skeleton key={i} className="h-6 w-full" />))}</CardContent><CardFooter><Skeleton className="h-11 w-full" /></CardFooter></Card>
                <Card className="flex flex-col"><CardHeader><Skeleton className="h-8 w-1/4" /><Skeleton className="h-4 w-3/4 mt-2" /></CardHeader><CardContent className="flex-grow space-y-4">{[...Array(5)].map((_, i) => (<Skeleton key={i} className="h-6 w-full" />))}</CardContent><CardFooter><Skeleton className="h-11 w-full" /></CardFooter></Card>
            </div>
        )
    }

    const userPlan = user?.plan;

    return (
        <>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
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
                        ) : userPlan === 'pro' || userPlan === 'admin' ? (
                            <Button size="lg" className="w-full" disabled variant="outline">Downgrade not supported</Button>
                        ) : (
                            <Button asChild size="lg" className="w-full">
                                <Link href="/auth/signup">Get Started for Free</Link>
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                <Card className="flex flex-col border-primary/50 shadow-lg shadow-primary/10">
                    <CardHeader>
                        <CardTitle className="text-2xl">Pro</CardTitle>
                        <CardDescription>For power users and businesses who need more links and advanced analytics.</CardDescription>
                        <div className="pt-4 transition-all duration-300">
                             <span className="text-4xl font-bold">Coming Soon</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <FeatureList features={proFeatures} />
                    </CardContent>
                    <CardFooter>
                         <Button size="lg" className="w-full" disabled>
                            Coming Soon
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
