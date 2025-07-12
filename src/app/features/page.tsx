import { CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features | MiniFyn',
  description: 'Discover the powerful features of MiniFyn URL Shortener.',
};

const featuresList = [
    { name: "Detailed Analytics", description: "Track clicks, referrers, and geographic data." },
    { name: "Developer API", description: "Integrate our shortening service into your apps." },
    { name: "Link Expiration", description: "Set links to expire automatically after a certain time." },
    { name: "Domain Blocklist", description: "Stay safe with automatic filtering of malicious domains." },
    { name: "User Tiers", description: "Generous limits for both anonymous and registered users." }
]

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Powerful Features, Simple Interface</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          MiniFyn provides everything you need to manage your links effectively and securely.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {featuresList.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-foreground">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <CheckCircle className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
