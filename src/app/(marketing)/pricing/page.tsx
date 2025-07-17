
import { CheckCircle, XCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Pricing Plans | MiniFyn',
  description: 'Choose the right plan for your link shortening needs. Start for free or upgrade for more power.',
  alternates: {
    canonical: 'https://www.minifyn.com/pricing',
  },
};

const freeFeatures = [
    { text: '20 Links / Month', included: true },
    { text: 'Links Expire in 60 Days', included: true },
    { text: 'Dashboard & Analytics', included: true },
    { text: 'QR Code Generation', included: true },
    { text: 'Developer API Access', included: true },
    { text: 'Links Never Expire', included: false },
];

const proFeatures = [
    { text: '500 Links / Month', included: true },
    { text: 'Links Never Expire', included: true },
    { text: 'Dashboard & Analytics', included: true },
    { text: 'QR Code Generation', included: true },
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
                    <span className={cn(!feature.included && "text-muted-foreground line-through")}>
                        {feature.text}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default function PricingPage() {
  return (
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
                <CardDescription>For power users who need more links, longer-lasting links, and API access.</CardDescription>
                <div className="pt-4">
                    <span className="text-4xl font-bold">Coming Soon</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                 <FeatureList features={proFeatures} />
            </CardContent>
            <CardFooter>
                <Button size="lg" className="w-full" disabled>
                    Upgrade to Pro
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
