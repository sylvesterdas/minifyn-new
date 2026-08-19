import { describe, it, expect } from "vitest";
import { resolveCountryFromRequest, isAllowedCountry, normalizeCountry } from "@/lib/geo";

describe("Geolocation & Country Detection Tests", () => {
  it("normalizes country codes correctly", () => {
    expect(normalizeCountry("in")).toBe("IN");
    expect(normalizeCountry("us")).toBe("US");
    expect(normalizeCountry("XX")).toBeNull();
    expect(normalizeCountry("")).toBeNull();
    expect(normalizeCountry(null)).toBeNull();
  });

  it("resolves country from x-vercel-ip-country header (US user)", async () => {
    const headers = new Headers({
      "x-vercel-ip-country": "US",
    });

    const country = await resolveCountryFromRequest({ headers });
    expect(country).toBe("US");
  });

  it("resolves country from x-vercel-ip-country header (Indian user)", async () => {
    const headers = new Headers({
      "x-vercel-ip-country": "IN",
    });

    const country = await resolveCountryFromRequest({ headers });
    expect(country).toBe("IN");
  });

  it("resolves country from cf-ipcountry fallback (UK user)", async () => {
    const headers = new Headers({
      "cf-ipcountry": "GB",
    });

    const country = await resolveCountryFromRequest({ headers });
    expect(country).toBe("GB");
  });

  it("isAllowedCountry allows all countries worldwide when wildcard or unset", () => {
    expect(isAllowedCountry("US")).toBe(true);
    expect(isAllowedCountry("IN")).toBe(true);
    expect(isAllowedCountry("DE")).toBe(true);
    expect(isAllowedCountry("GB")).toBe(true);
    expect(isAllowedCountry(null)).toBe(true);
  });
});
