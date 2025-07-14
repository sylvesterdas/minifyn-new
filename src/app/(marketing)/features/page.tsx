
import { CheckCircle, QrCode, FileQuestion, LifeBuoy, Zap, Cpu, ShieldCheck, LinkPreview } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Features | MiniFyn',
  description: 'Discover the powerful features of MiniFyn URL Shortener, from automatic link previews to blazing-fast redirects.',
  alternates: {
    canonical: 'https://www.minifyn.com/features',
  },
};

const featuresList = [
    { name: "Detailed Analytics", description: "Track clicks, referrers, and geographic data for every link you create.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "Automatic Link Previews", description: "Automatically fetches page titles and descriptions from your long URLs for better social sharing.", icon: <LinkPreview className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "QR Code Generation", description: "Instantly generate and download a custom-branded QR code for any link, completely free.", icon: <QrCode className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "Developer API", description: "Integrate our powerful and simple link shortening service directly into your applications.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "Link Expiration", description: "Set links to expire automatically after a certain time for time-sensitive campaigns.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "Domain Blocklist", description: "Stay safe with automatic filtering of known malicious or harmful domains.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "Generous User Tiers", description: "Start for free with 5 links/day, or sign up to get 20 links/day that last even longer.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
]

export default function FeaturesPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Powerful Features, Simple Interface</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            MiniFyn provides everything you need to manage your links effectively and securely.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                  <Link href="/auth/signup">Get started for free</Link>
              </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {featuresList.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    {feature.icon}
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
              </div>
            ))}
          </dl>
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
                    <Link href="/auth/signup">Experience the Difference</Link>
                </Button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center border-t pt-12">
          <h3 className="text-2xl font-semibold">Need More Help?</h3>
          <p className="mt-2 text-muted-foreground">
            If you can't find what you're looking for, check out these resources.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/help/faq">
                <FileQuestion className="mr-2 h-4 w-4" />
                Read our FAQ
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
