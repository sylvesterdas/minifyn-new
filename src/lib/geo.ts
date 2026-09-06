import { getCountryFromIP } from "@/lib/ip-to-country";

const UNKNOWN_COUNTRY_CODES = new Set(["", "XX", "ZZ", "T1", "EU"]);

export function normalizeCountry(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().toUpperCase();
  if (!trimmed || UNKNOWN_COUNTRY_CODES.has(trimmed)) return null;
  return trimmed;
}

export function isLikelyProxyOrVpn(headers: Headers): boolean {
  const suspectHeaders = [
    "x-real-ip",
    "x-proxyuser-ip",
    "via",
    "forwarded",
  ];
  const viaHeader = headers.get("via")?.toLowerCase() || "";
  if (
    viaHeader.includes("vpn") ||
    viaHeader.includes("proxy") ||
    viaHeader.includes("tor") ||
    viaHeader.includes("squid")
  ) {
    return true;
  }
  return false;
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

export async function resolveValidatedCountry(params: {
  headers: Headers;
  ip?: string | null;
  selectedCurrency?: 'INR' | 'USD';
}): Promise<string | null> {
  const { headers, ip, selectedCurrency } = params;
  const detectedCountry = await resolveCountryFromRequest({ headers, ip });

  if (selectedCurrency === 'USD' && detectedCountry === 'IN') {
    return 'US';
  }

  if (isLikelyProxyOrVpn(headers) && detectedCountry === 'IN') {
    return 'US';
  }

  return detectedCountry;
}

export function isAllowedCountry(country: string | null): boolean {
  const allowRaw = (process.env.LINKGUARD_ALLOWED_COUNTRY || "*").trim();
  if (allowRaw === "*" || !allowRaw) return true;
  const allowList = allowRaw
    .split(",")
    .map((entry) => entry.trim().toUpperCase())
    .filter(Boolean);

  if (!country) return true;
  return allowList.includes(country.toUpperCase());
}
