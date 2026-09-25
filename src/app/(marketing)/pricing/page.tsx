import type { Metadata } from 'next';
import { PricingView, pricingMetadata } from './pricing-view';

export const dynamic = 'force-static';

export const metadata: Metadata = pricingMetadata;

export default function PricingPage() {
  return <PricingView tier="tier1" />;
}
