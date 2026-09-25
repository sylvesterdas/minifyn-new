import type { Metadata } from 'next';
import type { OfferCatalog, WithContext } from 'schema-dts';
import { PricingPageClient } from '@/components/pricing-client';
import { getPlanPricing, type PricingTier } from '@/lib/plans';

const siteUrl = 'https://www.minifyn.com';

export const pricingMetadata: Metadata = (() => {
  const title = 'Pricing Plans | MiniFyn';
  const description = 'Choose the perfect plan for your needs. Start for free or upgrade to Pro for advanced features like permanent links and higher usage limits.';
  const ogImageUrl = `${siteUrl}/og.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/pricing`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/pricing`,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'MiniFyn Pricing Plans',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
})();

export function PricingView({ tier }: { tier: PricingTier }) {
  const pricing = getPlanPricing(tier);

  const jsonLd: WithContext<OfferCatalog> = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'MiniFyn Subscription Plans',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Free Plan',
        price: '0.00',
        priceCurrency: pricing.currency,
        description: 'Perfect for personal use and getting started with our platform.',
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan Monthly',
        price: pricing.monthlyPrice.toFixed(2),
        priceCurrency: pricing.currency,
        description: 'For power users and businesses who need more links and advanced analytics.',
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan Yearly',
        price: pricing.yearlyPrice.toFixed(2),
        priceCurrency: pricing.currency,
        description: 'For power users and businesses who need more links and advanced analytics, with a discount for yearly payment.',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Find Your Plan</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Whether you're just starting out or scaling up, we have a plan that fits your needs.
          </p>
        </div>
        <PricingPageClient tier={tier} />
      </div>
    </>
  );
}
