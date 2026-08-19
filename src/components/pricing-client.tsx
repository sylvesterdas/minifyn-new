'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, CreditCard, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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
          <span className={cn('text-sm', !feature.included && 'text-muted-foreground line-through')}>
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PricingPageClient() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const router = useRouter();

  const handleUpgradeClick = () => {
    const href = user ? '/dashboard/settings/billing' : `/auth/signup?plan=pro`;
    router.push(href);
  };

  if (isAuthLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <Card className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-11 w-full" />
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-11 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const userPlan = user?.plan;

  return (
    <div className="space-y-8">
      {/* Controls: Currency & Billing Cycle */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pb-2">
        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border">
          <Button
            type="button"
            size="sm"
            variant={currency === 'INR' ? 'default' : 'ghost'}
            onClick={() => setCurrency('INR')}
            className="h-8 text-xs gap-1"
          >
            <CreditCard className="h-3.5 w-3.5" />
            INR (₹)
          </Button>
          <Button
            type="button"
            size="sm"
            variant={currency === 'USD' ? 'default' : 'ghost'}
            onClick={() => setCurrency('USD')}
            className="h-8 text-xs gap-1"
          >
            <Globe className="h-3.5 w-3.5" />
            USD ($)
          </Button>
        </div>

        {/* Interval Switcher */}
        <div className="flex items-center gap-3">
          <Label
            htmlFor="pricing-interval"
            className={cn('text-sm cursor-pointer', interval === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground')}
          >
            Monthly
          </Label>
          <Switch
            id="pricing-interval"
            checked={interval === 'yearly'}
            onCheckedChange={(checked) => setInterval(checked ? 'yearly' : 'monthly')}
            aria-label="Toggle between monthly and yearly billing"
          />
          <Label
            htmlFor="pricing-interval"
            className={cn('text-sm cursor-pointer', interval === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground')}
          >
            Yearly <span className="text-primary font-semibold">{currency === 'USD' ? '(Save 37.5%)' : '(Save 44%)'}</span>
          </Label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Free Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for personal use and getting started with our platform.</CardDescription>
            <div className="pt-4">
              <span className="text-4xl font-bold">{currency === 'INR' ? '₹0' : '$0'}</span>
              <span className="text-muted-foreground">/{interval === 'monthly' ? 'month' : 'year'}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <FeatureList features={freeFeatures} />
          </CardContent>
          <CardFooter>
            {userPlan === 'free' ? (
              <Button size="lg" className="w-full" disabled>
                Your Current Plan
              </Button>
            ) : userPlan === 'pro' || userPlan === 'admin' ? (
              <Button size="lg" className="w-full" disabled variant="outline">
                Downgrade not supported
              </Button>
            ) : (
              <Button asChild size="lg" className="w-full">
                <Link href="/auth/signup?plan=free">Get Started for Free</Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col border-primary/50 shadow-lg shadow-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary font-semibold rounded-full">
                {currency === 'INR' ? 'Razorpay UPI & Cards' : 'PayPal & Cards'}
              </span>
            </div>
            <CardDescription>
              For power users and businesses who need more links and advanced analytics.
            </CardDescription>
            <div className="pt-4 transition-all duration-300">
              {currency === 'INR' ? (
                interval === 'monthly' ? (
                  <div>
                    <span className="text-4xl font-bold">₹149</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold">₹999</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                )
              ) : interval === 'monthly' ? (
                <div>
                  <span className="text-4xl font-bold">$2.00</span>
                  <span className="text-muted-foreground"> USD /month</span>
                </div>
              ) : (
                <div>
                  <span className="text-4xl font-bold">$15.00</span>
                  <span className="text-muted-foreground"> USD /year</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <FeatureList features={proFeatures} />
          </CardContent>
          <CardFooter>
            {userPlan === 'pro' || userPlan === 'admin' ? (
              <Button size="lg" className="w-full" disabled>
                Your Current Plan
              </Button>
            ) : (
              <Button size="lg" className="w-full" onClick={handleUpgradeClick}>
                Upgrade to Pro
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
