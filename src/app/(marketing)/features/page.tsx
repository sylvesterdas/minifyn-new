
import { CheckCircle, QrCode, FileQuestion, LifeBuoy, Zap, Cpu, ShieldCheck, Link as LinkIcon, Lock, Unlock } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';



export const metadata: Metadata = {
  title: 'Features | MiniFyn',
  description: 'Discover the powerful features of MiniFyn URL Shortener, from free QR codes and developer API access to advanced analytics and permanent links with our Pro plan.',
  alternates: {
    canonical: 'https://www.minifyn.com/features',
  },
};

const freeFeatures = [
    { name: "URL Shortening", description: "Create up to 20 short links per day." },
    { name: "Link Expiration", description: "Links are active for 60 days." },
    { name: "Basic Analytics", description: "Track total clicks for the last 7 days." },
    { name: "QR Code Generation", description: "Instantly create and download branded QR codes." },
    { name: "Developer API", description: "Integrate our service into your applications." },
    { name: "Domain Blocklist", description: "Automatic filtering of known malicious domains." },
];

const proFeatures = [
    { name: "Higher Limits", description: "Create up to 100 short links per day." },
    { name: "Permanent Links", description: "Your links will never expire." },
    { name: "Advanced Analytics", description: "Track referrers, geographic data, and more with 1-year data retention." },
    { name: "All Free Features", description: "Includes everything in the Free plan." },
    { name: "Custom Slugs", description: "Personalize your links (Coming Soon)." },
    { name: "Priority Support", description: "Get faster help when you need it." },
];

function FeatureCard({ title, description, isPro = false }: { title: string; description: string; isPro?: boolean }) {
    return (
        <div className="relative pl-9">
            <dt className="inline font-semibold text-foreground">
                <div className={cn(
                    "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-lg",
                    isPro ? "bg-primary" : "bg-secondary"
                )}>
                    {isPro ? <Unlock className="h-4 w-4 text-primary-foreground" /> : <Lock className="h-4 w-4 text-secondary-foreground" />}
                </div>
                {title}
            </dt>
            <dd className="inline pl-2 text-muted-foreground">{description}</dd>
        </div>
    );
}


export default function FeaturesPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Powerful Features, Simple Interface</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            MiniFyn provides everything you need to manage your links effectively and securely, with plans for every level of use.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                  <NextLink href="/pricing">View Plans & Pricing</NextLink>
              </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl space-y-16 sm:mt-20 lg:mt-24">
            {/* Free Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Free Plan Features</CardTitle>
                    <CardDescription>Everything you need to get started. Completely free.</CardDescription>
                </CardHeader>
                <CardContent>
                    <dl className="space-y-6 text-base leading-7">
                        {freeFeatures.map((feature) => (
                           <FeatureCard key={feature.name} title={feature.name} description={feature.description} />
                        ))}
                    </dl>
                </CardContent>
            </Card>
            
            {/* Pro Features */}
            <Card className="border-primary shadow-lg shadow-primary/10">
                <CardHeader>
                    <CardTitle className="text-2xl">Pro Plan Features</CardTitle>
                    <CardDescription>Unlock powerful tools for professionals and businesses.</CardDescription>
                </CardHeader>
                <CardContent>
                     <dl className="space-y-6 text-base leading-7">
                        {proFeatures.map((feature) => (
                           <FeatureCard key={feature.name} title={feature.name} description={feature.description} isPro />
                        ))}
                    </dl>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="py-12 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose MiniFyn?</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    In a sea of URL shorteners, MiniFyn stands out by focusing on speed, intelligence, and a clean user experience.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                        <Zap className="h-8 w-8"/>
                    </div>
                    <h3 className="text-xl font-semibold">Blazing Fast & Clean</h3>
                    <p className="text-muted-foreground mt-2">
                        No clutter, no ads, just a fast, modern interface and even faster redirects. We get you and your users where you need to go, instantly.
                    </p>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                        <Cpu className="h-8 w-8"/>
                    </div>
                    <h3 className="text-xl font-semibold">Intelligent & Insightful</h3>
                    <p className="text-muted-foreground mt-2">
                        MiniFyn automatically fetches metadata to give your links a professional edge on social media, while providing the analytics you need.
                    </p>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                        <ShieldCheck className="h-8 w-8"/>
                    </div>
                    <h3 className="text-xl font-semibold">Secure & Developer-Friendly</h3>
                    <p className="text-muted-foreground mt-2">
                        With built-in protection against malicious links and a simple, robust API, MiniFyn is built for both security and scalability.
                    </p>
                </div>
            </div>
            <div className="mt-12 text-center">
                <Button asChild size="lg">
                    <NextLink href="/auth/signup">Experience the Difference</NextLink>
                </Button>
            </div>
        </div>
      </div>

    </>
  );
}
