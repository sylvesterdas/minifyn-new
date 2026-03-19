import { getCountryFromIP } from "@/lib/ip-to-country";

const UNKNOWN_COUNTRY_CODES = new Set(["", "XX", "ZZ", "T1", "EU"]);

export function normalizeCountry(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().toUpperCase();
  if (!trimmed || UNKNOWN_COUNTRY_CODES.has(trimmed)) return null;
  return trimmed;
}

export async function resolveCountryFromRequest(params: {
  headers: Headers;
  ip?: string | null;
}): Promise<string | null> {
  const { headers, ip } = params;
  const headerCountry =
    normalizeCountry(headers.get("x-vercel-ip-country")) ||
    normalizeCountry(headers.get("cf-ipcountry"));

  if (headerCountry) return headerCountry;

  const fallbackIp = ip ? ip.split(",")[0]?.trim() : null;
  return getCountryFromIP(fallbackIp || null);
}

export function isAllowedCountry(country: string | null): boolean {
  const allowRaw = (process.env.LINKGUARD_ALLOWED_COUNTRY || "IN").trim();
  const allowList = allowRaw
    .split(",")
    .map((entry) => entry.trim().toUpperCase())
    .filter(Boolean);

  if (!country) return false;
  return allowList.includes(country.toUpperCase());
}
