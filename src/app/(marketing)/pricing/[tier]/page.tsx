import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRICING_TIERS, type PricingTier } from '@/lib/plans';
import { PricingView, pricingMetadata } from '../pricing-view';

export const dynamicParams = false;

export const metadata: Metadata = pricingMetadata;

export function generateStaticParams() {
  return PRICING_TIERS.map((tier) => ({ tier }));
}

export default async function PricingTierPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  if (!PRICING_TIERS.includes(tier as PricingTier)) notFound();
  return <PricingView tier={tier as PricingTier} />;
}
