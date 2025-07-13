import { CheckCircle, QrCode, FileQuestion, LifeBuoy } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Features | MiniFyn',
  description: 'Discover the powerful features of MiniFyn URL Shortener.',
};

const featuresList = [
    { name: "Detailed Analytics", description: "Track clicks, referrers, and geographic data.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "Developer API", description: "Integrate our shortening service into your apps.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "Link Expiration", description: "Set links to expire automatically after a certain time.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "Domain Blocklist", description: "Stay safe with automatic filtering of malicious domains.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "User Tiers", description: "Generous limits for both anonymous and registered users.", icon: <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> },
    { name: "QR Code Generation", description: "Instantly generate and download a QR code for any shortened link, completely free.", icon: <QrCode className="h-6 w-6 text-primary-foreground" aria-hidden="true" /> }
]

export default function FeaturesPage() {
  return (
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
      
      <div className="mt-16 text-center border-t pt-12">
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
  );
}
