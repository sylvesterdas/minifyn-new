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

        <section className="mt-16 max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">Which plan is right for you?</h2>
          <p>
            The Free plan suits personal use and occasional sharing. You can create up to 20 short links a day, download QR codes, use the developer API and see basic click counts for the last 7 days. Free links expire after 60 days, and every link is screened by our automatic threat and phishing shield.
          </p>
          <p>
            Pro is built for creators, marketers and businesses whose links need to keep working. It raises the limit to 100 links a day, makes links permanent so printed QR codes and published URLs never break, keeps a year of audience analytics, removes ads and includes priority support.
          </p>
          <p>
            Pro is available monthly or yearly. Payments in India support UPI, cards and netbanking, and international customers can pay by card or PayPal. Prices are shown in INR or USD based on your location.
          </p>
        </section>
      </div>
    </>
  );
}
