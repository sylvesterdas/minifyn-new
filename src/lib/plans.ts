export type PricingTier = 'in' | 'tier1' | 'tier2' | 'tier3';

export interface PlanPricing {
  tier: PricingTier;
  currency: 'INR' | 'USD';
  symbol: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyFormatted: string;
  yearlyFormatted: string;
  yearlySavingsPercentage: number;
  yearlyMonthlyEquivalent: string;
}

// Tier 1: High-Income Economies (US, UK, Western Europe, Japan, Nordics, Australia, etc.)
const TIER_1_COUNTRIES = new Set([
  'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'NL', 'SE', 'CH', 'SG', 'NZ', 'IE', 'NO', 'DK', 'FI',
  'AT', 'BE', 'LU', 'IS', 'IL', 'AE', 'QA', 'HK', 'KR', 'IT', 'ES', 'PT', 'TW', 'MO', 'KW', 'BH'
]);

// Tier 2: Upper-Middle Income & Emerging Tech Hubs (Latin America, Eastern Europe, Southeast Asia, etc.)
const TIER_2_COUNTRIES = new Set([
  'BR', 'MX', 'PL', 'TR', 'MY', 'TH', 'ZA', 'RO', 'AR', 'CL', 'CO', 'ID', 'CZ', 'HU', 'GR', 'BG',
  'HR', 'SK', 'SI', 'EE', 'LV', 'LT', 'PE', 'UY', 'CR', 'PA', 'SA', 'OM', 'RS', 'VN', 'PH', 'UA'
]);

// Tier 3: Developing Economies (South Asia, Sub-Saharan Africa, Central America, etc.)
// Any country not in IN, TIER_1, or TIER_2 automatically maps here if detected, or Tier 1 as fallback for unknown.

export function resolvePricingTier(countryCode: string | null | undefined): PricingTier {
  if (!countryCode) return 'tier1'; // Safe default for unresolvable global visitors

  const code = countryCode.trim().toUpperCase();

  if (code === 'IN') {
    return 'in';
  }

  if (TIER_1_COUNTRIES.has(code)) {
    return 'tier1';
  }

  if (TIER_2_COUNTRIES.has(code)) {
    return 'tier2';
  }

  return 'tier3';
}

export const PRICING_CONFIG: Record<PricingTier, PlanPricing> = {
  in: {
    tier: 'in',
    currency: 'INR',
    symbol: '₹',
    monthlyPrice: 149,
    yearlyPrice: 999,
    monthlyFormatted: '₹149',
    yearlyFormatted: '₹999',
    yearlySavingsPercentage: 44,
    yearlyMonthlyEquivalent: '₹83.25',
  },
  tier1: {
    tier: 'tier1',
    currency: 'USD',
    symbol: '$',
    monthlyPrice: 4.99,
    yearlyPrice: 39.0,
    monthlyFormatted: '$4.99',
    yearlyFormatted: '$39.00',
    yearlySavingsPercentage: 35,
    yearlyMonthlyEquivalent: '$3.25',
  },
  tier2: {
    tier: 'tier2',
    currency: 'USD',
    symbol: '$',
    monthlyPrice: 2.99,
    yearlyPrice: 24.0,
    monthlyFormatted: '$2.99',
    yearlyFormatted: '$24.00',
    yearlySavingsPercentage: 33,
    yearlyMonthlyEquivalent: '$2.00',
  },
  tier3: {
    tier: 'tier3',
    currency: 'USD',
    symbol: '$',
    monthlyPrice: 1.49,
    yearlyPrice: 12.0,
    monthlyFormatted: '$1.49',
    yearlyFormatted: '$12.00',
    yearlySavingsPercentage: 33,
    yearlyMonthlyEquivalent: '$1.00',
  },
};

export function getPlanPricing(tier: PricingTier): PlanPricing {
  return PRICING_CONFIG[tier] || PRICING_CONFIG.tier1;
}

export function getPlanPricingForCountry(countryCode: string | null | undefined): PlanPricing {
  const tier = resolvePricingTier(countryCode);
  return getPlanPricing(tier);
}
