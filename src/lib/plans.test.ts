import { describe, it, expect } from "vitest";
import {
  resolvePricingTier,
  getPlanPricing,
  getPlanPricingForCountry,
  PRICING_CONFIG,
} from "@/lib/plans";

describe("PPP Plans & Pricing Tests", () => {
  it("resolves India correctly", () => {
    expect(resolvePricingTier("IN")).toBe("in");
    expect(resolvePricingTier("in")).toBe("in");
    const pricing = getPlanPricingForCountry("IN");
    expect(pricing.currency).toBe("INR");
    expect(pricing.monthlyPrice).toBe(149);
    expect(pricing.yearlyPrice).toBe(999);
  });

  it("resolves Tier 1 countries correctly (USA, UK, France, Germany, Japan)", () => {
    expect(resolvePricingTier("US")).toBe("tier1");
    expect(resolvePricingTier("GB")).toBe("tier1");
    expect(resolvePricingTier("FR")).toBe("tier1");
    expect(resolvePricingTier("DE")).toBe("tier1");
    expect(resolvePricingTier("JP")).toBe("tier1");

    const pricing = getPlanPricingForCountry("US");
    expect(pricing.currency).toBe("USD");
    expect(pricing.monthlyPrice).toBe(4.99);
    expect(pricing.yearlyPrice).toBe(39.0);
  });

  it("resolves Tier 2 countries correctly (Brazil, Mexico, Poland, Turkey, South Africa)", () => {
    expect(resolvePricingTier("BR")).toBe("tier2");
    expect(resolvePricingTier("MX")).toBe("tier2");
    expect(resolvePricingTier("PL")).toBe("tier2");
    expect(resolvePricingTier("TR")).toBe("tier2");
    expect(resolvePricingTier("ZA")).toBe("tier2");

    const pricing = getPlanPricingForCountry("BR");
    expect(pricing.currency).toBe("USD");
    expect(pricing.monthlyPrice).toBe(2.99);
    expect(pricing.yearlyPrice).toBe(24.0);
  });

  it("resolves Tier 3 countries correctly (Nepal, Bangladesh, Pakistan, Nigeria, Egypt)", () => {
    expect(resolvePricingTier("NP")).toBe("tier3");
    expect(resolvePricingTier("BD")).toBe("tier3");
    expect(resolvePricingTier("PK")).toBe("tier3");
    expect(resolvePricingTier("NG")).toBe("tier3");
    expect(resolvePricingTier("EG")).toBe("tier3");

    const pricing = getPlanPricingForCountry("NP");
    expect(pricing.currency).toBe("USD");
    expect(pricing.monthlyPrice).toBe(1.49);
    expect(pricing.yearlyPrice).toBe(12.0);
  });

  it("falls back to Tier 1 when country is unknown or null", () => {
    expect(resolvePricingTier(null)).toBe("tier1");
    expect(resolvePricingTier("")).toBe("tier1");
    expect(resolvePricingTier(undefined)).toBe("tier1");

    const pricing = getPlanPricingForCountry(null);
    expect(pricing.currency).toBe("USD");
    expect(pricing.monthlyPrice).toBe(4.99);
    expect(pricing.yearlyPrice).toBe(39.0);
  });

  it("ensures all tiers have consistent structure and yearly savings", () => {
    const tiers = ["in", "tier1", "tier2", "tier3"] as const;
    for (const t of tiers) {
      const plan = PRICING_CONFIG[t];
      expect(plan.monthlyPrice).toBeGreaterThan(0);
      expect(plan.yearlyPrice).toBeGreaterThan(0);
      expect(plan.yearlyPrice).toBeLessThan(plan.monthlyPrice * 12);
      expect(plan.yearlySavingsPercentage).toBeGreaterThan(0);
    }
  });
});
