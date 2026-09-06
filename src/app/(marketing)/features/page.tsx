
import { Zap, Cpu, ShieldCheck, Lock, Unlock } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Features | MiniFyn',
  description: 'Discover the powerful features of MiniFyn URL Shortener, from free QR codes and developer API access to advanced analytics and permanent links with our Pro plan.',
  alternates: {
    canonical: 'https://www.minifyn.com/features',
  },
};

interface FeatureItem {
  title: string;
  description: string;
  isComingSoon?: boolean;
}

const freeFeatures: FeatureItem[] = [
  {
    title: "Instant Clean Links in One Tap",
    description: "Shorten up to 20 links daily to remove visual clutter and boost click confidence.",
  },
  {
    title: "Auto-Expiring 60-Day Links",
    description: "Keep links self-cleaning for temporary shares, seasonal promotions, and quick posts.",
  },
  {
    title: "Live 7-Day Click Tracking",
    description: "See real-time audience engagement the moment your campaigns go live.",
  },
  {
    title: "Instant Downloadable QR Codes",
    description: "Bridge offline print and real-world media to digital destinations in seconds.",
  },
  {
    title: "High-Speed Developer API",
    description: "Automate link shortening inside your apps and workflows with sub-second latency.",
  },
  {
    title: "Automatic Threat & Phishing Shield",
    description: "Protect your recipients and your reputation by blocking unsafe domains automatically.",
  },
];

const proFeatures: FeatureItem[] = [
  {
    title: "Unthrottled 100 Links / Day",
    description: "Scale campaigns and outreach freely without hitting daily limits or bottlenecks.",
  },
  {
    title: "Permanent Links That Never Expire",
    description: "Never lose traffic again—your printed collateral and evergreen links stay active forever.",
  },
  {
    title: "1-Year Deep Audience Analytics",
    description: "Unlock full country, device, and referrer insights retained for 365 days.",
  },
  {
    title: "100% Distraction-Free Ad-Free UI",
    description: "Manage and analyze your links in a lightning-fast workspace with zero advertisements.",
  },
  {
    title: "Custom Branded Slugs",
    description: "Build instant brand recognition and trust with personalized link aliases.",
    isComingSoon: true,
  },
  {
    title: "Priority Direct Support",
    description: "Get rapid assistance so your critical links and campaigns never stop running.",
  },
];

function FeatureCard({
  title,
  description,
  isPro = false,
  isComingSoon = false,
}: {
  title: string;
  description: string;
  isPro?: boolean;
  isComingSoon?: boolean;
}) {
  return (
    <div className="relative pl-10 space-y-1">
      <dt className="flex items-center gap-2">
        <div
          className={cn(
            "absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-lg shadow-sm",
            isPro ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {isPro ? (
            <Unlock className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">{title}</span>
        {isComingSoon && (
          <Badge variant="outline" className="border-primary/50 text-primary text-[10px] py-0 px-1.5 shrink-0">
            Coming Soon
          </Badge>
        )}
      </dt>
      <dd className="text-sm text-muted-foreground leading-relaxed">{description}</dd>
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
            MiniFyn gives you total control over your links with speed, clarity, and safety designed for every level of use.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <NextLink href="/pricing">View Plans & Pricing</NextLink>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl space-y-16 sm:mt-20 lg:mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Free Plan Features</CardTitle>
              <CardDescription>Everything you need to launch clean, secure links with zero friction.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid sm:grid-cols-2 gap-8 text-base leading-7">
                {freeFeatures.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Pro Plan Features</CardTitle>
              <CardDescription>Advanced permanence, deep intelligence, and unthrottled scale for professionals.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid sm:grid-cols-2 gap-8 text-base leading-7">
                {proFeatures.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                    isPro
                    isComingSoon={feature.isComingSoon}
                  />
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
              Built from the ground up for speed, reliability, and audience trust.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Sub-15ms Instant Redirects</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                No clutter, no intermediate ads, and edge-routed redirects so you never lose impatient clicks.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Rich Previews & Live Insights</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Automatic metadata previews give your links social authority, paired with live click attribution.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Proactive Scam & Abuse Shield</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Continuous threat scanning protects your audience while our high-speed API scales seamlessly.
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
