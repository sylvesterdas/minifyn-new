
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
  benefit: string;
  name: string;
  description: string;
  isComingSoon?: boolean;
}

const freeFeatures: FeatureItem[] = [
  {
    benefit: "Frictionless First Impressions",
    name: "Instant URL Shortening",
    description: "Transform long, messy URLs into neat, shareable links in one tap to eliminate visual clutter and boost click confidence.",
  },
  {
    benefit: "Worry-Free Temporary Campaigns",
    name: "60-Day Active Lifecycle",
    description: "Keep your shared assets lean and active without manual maintenance—ideal for seasonal promotions, social posts, and quick event shares.",
  },
  {
    benefit: "Immediate Engagement Visibility",
    name: "7-Day Real-Time Click Insights",
    description: "Know instantly when and how often your links are engaged with, giving you clarity on audience response as campaigns launch.",
  },
  {
    benefit: "Seamless Real-World Connection",
    name: "Instant Branded QR Codes",
    description: "Bridge offline audiences to digital destinations effortlessly with downloadable, high-resolution QR codes that scan reliably every time.",
  },
  {
    benefit: "Effortless Workflow Automation",
    name: "High-Performance Developer API",
    description: "Automate link creation straight inside your workflows and apps with minimal latency, saving hours of manual copy-pasting.",
  },
  {
    benefit: "Proactive Audience Protection",
    name: "Automated Threat & Phishing Filter",
    description: "Protect your recipients and your reputation with automated screening that blocks malicious destinations before links go live.",
  },
];

const proFeatures: FeatureItem[] = [
  {
    benefit: "Unrestricted Campaign Growth",
    name: "High-Volume Link Creation (100/day)",
    description: "Scale your marketing outreach and team workflows freely without hitting daily roadblocks or throttling.",
  },
  {
    benefit: "Zero Link Rot & Permanent Peace of Mind",
    name: "Non-Expiring Links",
    description: "Never worry about broken links or lost traffic again. Your printed collateral, documentation, and evergreen campaigns remain permanently active.",
  },
  {
    benefit: "360° Strategic Audience Intelligence",
    name: "Granular Geo & Referrer Analytics (1 Year)",
    description: "Make confident marketing decisions with deep country-by-country data, device breakdowns, and source attribution retained for 365 days.",
  },
  {
    benefit: "Distraction-Free, Premium Focus",
    name: "100% Ad-Free Clean UI",
    description: "Focus purely on managing and analyzing your links in a blazing-fast, distraction-free environment with zero ads.",
  },
  {
    benefit: "Memorable Brand Recognition",
    name: "Custom Branded Slugs",
    description: "Reinforce your authority and brand recall with custom aliases that readers recognize and trust at a glance.",
    isComingSoon: true,
  },
  {
    benefit: "Direct Reassurance When It Matters Most",
    name: "Priority Support & Rapid Assistance",
    description: "Rest easy knowing dedicated help is just an email away, ensuring your mission-critical campaigns never skip a beat.",
  },
];

function FeatureCard({
  benefit,
  title,
  description,
  isPro = false,
  isComingSoon = false,
}: {
  benefit: string;
  title: string;
  description: string;
  isPro?: boolean;
  isComingSoon?: boolean;
}) {
  return (
    <div className="relative pl-9 space-y-1">
      <dt className="font-semibold text-foreground">
        <div
          className={cn(
            "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-lg",
            isPro ? "bg-primary" : "bg-secondary"
          )}
        >
          {isPro ? (
            <Unlock className="h-4 w-4 text-primary-foreground" />
          ) : (
            <Lock className="h-4 w-4 text-secondary-foreground" />
          )}
        </div>
        <span className="text-primary font-medium text-xs tracking-wide uppercase block">
          {benefit}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-base text-foreground font-semibold">{title}</span>
          {isComingSoon && (
            <Badge variant="outline" className="border-primary/50 text-primary text-[10px] py-0 px-1.5">
              Coming Soon
            </Badge>
          )}
        </div>
      </dt>
      <dd className="text-sm text-muted-foreground leading-relaxed pt-0.5">{description}</dd>
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
                    key={feature.name}
                    benefit={feature.benefit}
                    title={feature.name}
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
                    key={feature.name}
                    benefit={feature.benefit}
                    title={feature.name}
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
              <span className="text-primary font-medium text-xs uppercase tracking-wide mb-1">
                Zero Friction, Maximum Retention
              </span>
              <h3 className="text-xl font-semibold">Blazing Fast & Clean</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                No clutter, no ads, just instantaneous redirects (~15ms) that respect your users' time and never lose impatient visitors.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Cpu className="h-8 w-8" />
              </div>
              <span className="text-primary font-medium text-xs uppercase tracking-wide mb-1">
                Total Clarity on Every Campaign
              </span>
              <h3 className="text-xl font-semibold">Intelligent & Insightful</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Automatic metadata previews give your shared links instant social credibility, paired with analytics that reveal exactly where your audience engages.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <span className="text-primary font-medium text-xs uppercase tracking-wide mb-1">
                Bulletproof Credibility & Protection
              </span>
              <h3 className="text-xl font-semibold">Secure & Developer-Friendly</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Built-in malicious URL screening protects your audience, while an edge-optimized API allows your systems to scale effortlessly.
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
