import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { GoogleAuth } from "google-auth-library";

export const runtime = "nodejs";

const WEBRISK_API_KEY = process.env.LINKGUARD_WEBRISK_API_KEY || "";
const PLAY_INTEGRITY_ENABLED = process.env.LINKGUARD_PLAY_INTEGRITY_ENABLED === "true";
const PLAY_INTEGRITY_ENFORCE = process.env.LINKGUARD_PLAY_INTEGRITY_ENFORCE === "true";
const PLAY_INTEGRITY_DEBUG_LOGS =
  process.env.LINKGUARD_PLAY_INTEGRITY_DEBUG_LOGS === "true";
const PLAY_INTEGRITY_PACKAGE_NAME = process.env.LINKGUARD_PLAY_PACKAGE_NAME || "com.minifyn.linkguard";
const PLAY_INTEGRITY_SERVICE_ACCOUNT_JSON =
  process.env.LINKGUARD_PLAY_SERVICE_ACCOUNT_JSON || "";
const PLAY_INTEGRITY_ALLOWED_APP_VERDICTS = (
  process.env.LINKGUARD_PLAY_ALLOWED_APP_VERDICTS || "PLAY_RECOGNIZED"
)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const PLAY_INTEGRITY_ALLOWED_DEVICE_VERDICTS = (
  process.env.LINKGUARD_PLAY_ALLOWED_DEVICE_VERDICTS ||
  "MEETS_DEVICE_INTEGRITY,MEETS_BASIC_INTEGRITY,MEETS_STRONG_INTEGRITY"
)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const PLAY_INTEGRITY_REQUIRE_LICENSED =
  (process.env.LINKGUARD_PLAY_REQUIRE_LICENSED || "true") === "true";

const VERDICT_TTL_MS = 48 * 60 * 60 * 1000;
const FEED_REFRESH_MS = 30 * 60 * 1000;
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX_REQUESTS = 240;
type Risk = "safe" | "warning" | "risky";
type ReputationStatus = "hit" | "clean" | "unavailable";

type Verdict = {
  risk: Risk;
  reason: string;
  checked_at: number;
  sources_checked?: string[];
};

type CacheEntry = {
  value: Verdict;
  expiresAt: number;
};

type ThreatFeedCache = {
  hosts: Set<string>;
  urls: Set<string>;
  fetchedAt: number;
};

type RateEntry = {
  count: number;
  windowStart: number;
};

type RouteState = {
  verdictCache: Map<string, CacheEntry>;
  inFlightByHash: Map<string, Promise<Verdict>>;
  openPhish: ThreatFeedCache;
  urlHaus: ThreatFeedCache;
  rateByIp: Map<string, RateEntry>;
};

const globalState = globalThis as typeof globalThis & {
  __scamguardV1State__?: RouteState;
};

const state: RouteState =
  globalState.__scamguardV1State__ ||
  (globalState.__scamguardV1State__ = {
    verdictCache: new Map<string, CacheEntry>(),
    inFlightByHash: new Map<string, Promise<Verdict>>(),
    openPhish: { hosts: new Set<string>(), urls: new Set<string>(), fetchedAt: 0 },
    urlHaus: { hosts: new Set<string>(), urls: new Set<string>(), fetchedAt: 0 },
    rateByIp: new Map<string, RateEntry>(),
  });

export async function POST(req: NextRequest) {
  let url: string;
  let incomingHash = "";
  let integrityToken = "";
  let integrityRequestHash = "";

  try {
    const data = await req.json();
    url = String(data?.url || "").trim();
    incomingHash = String(data?.url_hash || "").trim();
    integrityToken = String(data?.play_integrity_token || "").trim();
    integrityRequestHash = String(data?.play_integrity_request_hash || "").trim();
  } catch {
    return NextResponse.json(
      { risk: "warning", reason: "Invalid request body", checked_at: nowSec() },
      { status: 400 }
    );
  }

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { risk: "warning", reason: "Invalid URL format", checked_at: nowSec() },
      { status: 400 }
    );
  }

  const normalizedUrl = normalizeUrl(url);
  const urlHash = sha256Hex(normalizedUrl);
  const alternateUrlHash = sha256Hex(alternateNormalizeForHash(normalizedUrl));
  if (incomingHash && incomingHash !== urlHash && incomingHash !== alternateUrlHash) {
    return NextResponse.json(
      {
        risk: "warning",
        reason: "URL hash mismatch.",
        checked_at: nowSec(),
      },
      { status: 400 }
    );
  }

  if (PLAY_INTEGRITY_ENABLED) {
    const alternateNormalizedUrl = alternateNormalizeForHash(normalizedUrl);
    const expectedRequestHashes = new Set<string>([
      buildIntegrityRequestHash(normalizedUrl, urlHash),
      buildIntegrityRequestHash(alternateNormalizedUrl, alternateUrlHash),
    ]);

    const integrityCheck = await verifyPlayIntegrity({
      token: integrityToken,
      requestHash: integrityRequestHash,
      expectedRequestHashes: Array.from(expectedRequestHashes),
    });

    if (PLAY_INTEGRITY_DEBUG_LOGS) {
      console.info("[scamguard-v1][integrity]", {
        ok: integrityCheck.ok,
        enforce: PLAY_INTEGRITY_ENFORCE,
        reason: integrityCheck.reason,
        hasToken: Boolean(integrityToken),
        hasRequestHash: Boolean(integrityRequestHash),
        urlHashPrefix: urlHash.slice(0, 10),
      });
    }

    if (!integrityCheck.ok && PLAY_INTEGRITY_ENFORCE) {
      return NextResponse.json(
        {
          risk: "warning",
          reason: integrityCheck.reason,
          checked_at: nowSec(),
        },
        {
          status: 403,
          headers: { "x-scamguard-integrity": "blocked" },
        }
      );
    }
  }

  const ip = clientIp(req);
  if (!allowRequest(ip)) {
    return NextResponse.json(
      {
        risk: "warning",
        reason: "Too many requests. Please retry later.",
        checked_at: nowSec(),
      },
      { status: 429 }
    );
  }

  const cached = getCachedVerdict(urlHash);
  if (cached) {
    return NextResponse.json(cached, {
      status: 200,
      headers: { "x-scamguard-cache": "hit" },
    });
  }

  const active = state.inFlightByHash.get(urlHash);
  if (active) {
    const verdict = await active;
    return NextResponse.json(verdict, {
      status: 200,
      headers: { "x-scamguard-cache": "coalesced" },
    });
  }

  const task = computeVerdict(normalizedUrl);
  state.inFlightByHash.set(urlHash, task);

  try {
    const verdict = await task;
    setCachedVerdict(urlHash, verdict);

    return NextResponse.json(verdict, {
      status: 200,
      headers: { "x-scamguard-cache": "miss" },
    });
  } finally {
    state.inFlightByHash.delete(urlHash);
  }
}

async function computeVerdict(normalizedUrl: string): Promise<Verdict> {
  const checked_at = nowSec();

  const [webRiskStatus, openPhishStatus, urlHausStatus] = await Promise.all([
    checkWebRisk(normalizedUrl),
    checkOpenPhish(normalizedUrl),
    checkUrlHaus(normalizedUrl),
  ]);

  if (
    webRiskStatus === "hit" ||
    openPhishStatus === "hit" ||
    urlHausStatus === "hit"
  ) {
    return {
      risk: "risky",
      reason: "This link matches known scam or malware reports",
      checked_at,
      sources_checked: ["webrisk", "openphish", "urlhaus"],
    };
  }

  if (
    webRiskStatus === "unavailable" &&
    openPhishStatus === "unavailable" &&
    urlHausStatus === "unavailable"
  ) {
    return {
      risk: "warning",
      reason: "Reputation checks are unavailable right now. Treat this link with caution.",
      checked_at,
    };
  }

  return {
    risk: "safe",
    reason: "No known issues found",
    checked_at,
    sources_checked: ["webrisk", "openphish", "urlhaus"],
  };
}

function getCachedVerdict(urlHash: string): Verdict | null {
  cleanupCache();
  const entry = state.verdictCache.get(urlHash);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    state.verdictCache.delete(urlHash);
    return null;
  }
  return entry.value;
}

function setCachedVerdict(urlHash: string, value: Verdict): void {
  state.verdictCache.set(urlHash, {
    value,
    expiresAt: Date.now() + VERDICT_TTL_MS,
  });
}

function cleanupCache(): void {
  const now = Date.now();
  for (const [key, value] of state.verdictCache) {
    if (now >= value.expiresAt) {
      state.verdictCache.delete(key);
    }
  }

  for (const [ip, entry] of state.rateByIp) {
    if (now - entry.windowStart >= IP_WINDOW_MS) {
      state.rateByIp.delete(ip);
    }
  }
}

function allowRequest(ip: string): boolean {
  cleanupCache();

  const now = Date.now();
  const entry = state.rateByIp.get(ip);

  if (!entry || now - entry.windowStart >= IP_WINDOW_MS) {
    state.rateByIp.set(ip, { count: 1, windowStart: now });
    return true;
  }

  entry.count += 1;
  return entry.count <= IP_MAX_REQUESTS;
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  return forwarded.split(",")[0].trim() || "unknown";
}

async function checkWebRisk(normalizedUrl: string): Promise<ReputationStatus> {
  if (!WEBRISK_API_KEY) return "unavailable";

  const endpoint =
    "https://webrisk.googleapis.com/v1/uris:search" +
    `?uri=${encodeURIComponent(normalizedUrl)}` +
    "&threatTypes=MALWARE" +
    "&threatTypes=SOCIAL_ENGINEERING" +
    "&threatTypes=UNWANTED_SOFTWARE" +
    "&threatTypes=SOCIAL_ENGINEERING_EXTENDED_COVERAGE" +
    `&key=${WEBRISK_API_KEY}`;

  try {
    const res = await fetchWithTimeout(endpoint, 4000);
    if (!res.ok) return "unavailable";

    const json = (await res.json()) as {
      threat?: { threatTypes?: string[] };
    };

    return json.threat?.threatTypes?.length ? "hit" : "clean";
  } catch {
    return "unavailable";
  }
}

async function checkOpenPhish(normalizedUrl: string): Promise<ReputationStatus> {
  try {
    const openPhish = await loadOpenPhish();
    if (!openPhish.available) return "unavailable";
    const host = new URL(normalizedUrl).hostname.toLowerCase();
    return openPhish.hosts.has(host) ? "hit" : "clean";
  } catch {
    return "unavailable";
  }
}

async function loadOpenPhish(): Promise<{ hosts: Set<string>; available: boolean }> {
  const now = Date.now();
  if (
    state.openPhish.hosts.size > 0 &&
    now - state.openPhish.fetchedAt < FEED_REFRESH_MS
  ) {
    return { hosts: state.openPhish.hosts, available: true };
  }

  const res = await fetchWithTimeout("https://openphish.com/feed.txt", 6000);
  if (!res.ok) {
    return {
      hosts: state.openPhish.hosts,
      available: state.openPhish.hosts.size > 0,
    };
  }

  const text = await res.text();
  const hosts = new Set<string>();

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    try {
      const host = new URL(line).hostname.toLowerCase();
      hosts.add(host);
    } catch {
      // Ignore malformed feed lines.
    }
  }

  if (hosts.size > 0) {
    state.openPhish = { hosts, urls: new Set(), fetchedAt: now };
  }

  return {
    hosts: state.openPhish.hosts,
    available: state.openPhish.hosts.size > 0,
  };
}

async function checkUrlHaus(normalizedUrl: string): Promise<ReputationStatus> {
  try {
    const urlHaus = await loadUrlHaus();
    if (!urlHaus.available) return "unavailable";
    const host = new URL(normalizedUrl).hostname.toLowerCase();
    return urlHaus.hosts.has(host) ? "hit" : "clean";
  } catch {
    return "unavailable";
  }
}

async function loadUrlHaus(): Promise<{ hosts: Set<string>; available: boolean }> {
  const now = Date.now();
  if (
    state.urlHaus.hosts.size > 0 &&
    now - state.urlHaus.fetchedAt < FEED_REFRESH_MS
  ) {
    return { hosts: state.urlHaus.hosts, available: true };
  }

  const res = await fetchWithTimeout("https://urlhaus.abuse.ch/downloads/csv_recent/", 6000);
  if (!res.ok) {
    return {
      hosts: state.urlHaus.hosts,
      available: state.urlHaus.hosts.size > 0,
    };
  }

  const text = await res.text();
  const hosts = new Set<string>();

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    try {
      const parts = line.split('","');
      const urlCandidate = parts[2]?.replace(/^"|"$/g, "") || line.split(",")[2] || "";
      if (urlCandidate.startsWith("http://") || urlCandidate.startsWith("https://")) {
        const host = new URL(urlCandidate).hostname.toLowerCase();
        hosts.add(host);
      }
    } catch {
      // Ignore malformed lines.
    }
  }

  if (hosts.size > 0) {
    state.urlHaus = { hosts, urls: new Set(), fetchedAt: now };
  }

  return {
    hosts: state.urlHaus.hosts,
    available: state.urlHaus.hosts.size > 0,
  };
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeUrl(value: string): string {
  const u = new URL(value);
  return new URL(
    `${u.protocol.toLowerCase()}//${u.hostname.toLowerCase()}${u.pathname}${u.search}`
  ).toString();
}

function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  init: RequestInit = {}
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      cache: "no-store",
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

type IntegrityVerificationInput = {
  token: string;
  requestHash: string;
  expectedRequestHashes: string[];
};

type IntegrityVerificationResult = {
  ok: boolean;
  reason: string;
};

type DecodedIntegrityPayload = {
  tokenPayloadExternal?: {
    requestDetails?: {
      requestPackageName?: string;
      requestHash?: string;
      timestampMillis?: string;
    };
    appIntegrity?: {
      appRecognitionVerdict?: string;
    };
    deviceIntegrity?: {
      deviceRecognitionVerdict?: string[];
    };
    accountDetails?: {
      appLicensingVerdict?: string;
    };
  };
};

async function verifyPlayIntegrity(
  input: IntegrityVerificationInput
): Promise<IntegrityVerificationResult> {
  if (!PLAY_INTEGRITY_ENABLED) {
    return { ok: true, reason: "Play Integrity disabled." };
  }

  if (!PLAY_INTEGRITY_PACKAGE_NAME || !PLAY_INTEGRITY_SERVICE_ACCOUNT_JSON) {
    return {
      ok: false,
      reason: "Play Integrity env is not configured on backend.",
    };
  }

  if (!input.token || !input.requestHash) {
    return {
      ok: false,
      reason: "Missing Play Integrity token.",
    };
  }

  if (!input.expectedRequestHashes.includes(input.requestHash)) {
    return {
      ok: false,
      reason: "Play Integrity request hash mismatch.",
    };
  }

  try {
    const decoded = await decodeIntegrityToken(input.token);
    const external = decoded.tokenPayloadExternal;
    const requestDetails = external?.requestDetails;
    const appIntegrity = external?.appIntegrity;
    const deviceIntegrity = external?.deviceIntegrity;
    const accountDetails = external?.accountDetails;

    if (requestDetails?.requestPackageName !== PLAY_INTEGRITY_PACKAGE_NAME) {
      return {
        ok: false,
        reason: "Package name mismatch in Play Integrity token.",
      };
    }

    if (
      !requestDetails?.requestHash ||
      !input.expectedRequestHashes.includes(requestDetails.requestHash)
    ) {
      return {
        ok: false,
        reason: "Play Integrity token request hash mismatch.",
      };
    }

    const appVerdict = appIntegrity?.appRecognitionVerdict || "";
    if (!PLAY_INTEGRITY_ALLOWED_APP_VERDICTS.includes(appVerdict)) {
      return {
        ok: false,
        reason: `Disallowed app verdict: ${appVerdict || "unknown"}.`,
      };
    }

    const deviceVerdicts = deviceIntegrity?.deviceRecognitionVerdict || [];
    const hasAllowedDeviceVerdict = deviceVerdicts.some((verdict) =>
      PLAY_INTEGRITY_ALLOWED_DEVICE_VERDICTS.includes(verdict)
    );
    if (!hasAllowedDeviceVerdict) {
      return {
        ok: false,
        reason: "Device integrity verdict is not acceptable.",
      };
    }

    if (
      PLAY_INTEGRITY_REQUIRE_LICENSED &&
      accountDetails?.appLicensingVerdict !== "LICENSED"
    ) {
      return {
        ok: false,
        reason: "App licensing verdict is not LICENSED.",
      };
    }

    return { ok: true, reason: "Play Integrity verification passed." };
  } catch (error) {
    return {
      ok: false,
      reason: `Play Integrity verification failed: ${error instanceof Error ? error.message : "unknown"}`,
    };
  }
}

async function decodeIntegrityToken(token: string): Promise<DecodedIntegrityPayload> {
  const raw = decodeServiceAccountJson(PLAY_INTEGRITY_SERVICE_ACCOUNT_JSON);
  const credentials = JSON.parse(raw) as Record<string, unknown>;

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/playintegrity"],
  });
  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  const accessToken = accessTokenResponse.token;
  if (!accessToken) {
    throw new Error("Could not obtain Google access token.");
  }

  const endpoint = `https://playintegrity.googleapis.com/v1/${PLAY_INTEGRITY_PACKAGE_NAME}:decodeIntegrityToken`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ integrityToken: token }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google decode failed (${response.status}): ${body}`);
  }

  return (await response.json()) as DecodedIntegrityPayload;
}

function decodeServiceAccountJson(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("{")) return trimmed;
  return Buffer.from(trimmed, "base64").toString("utf8");
}

function buildIntegrityRequestHash(normalizedUrl: string, urlHash: string): string {
  const input = `url=${normalizedUrl}&url_hash=${urlHash}`;
  const digest = crypto.createHash("sha256").update(input).digest();
  return digest.toString("base64url");
}

function alternateNormalizeForHash(normalizedUrl: string): string {
  try {
    const u = new URL(normalizedUrl);
    if (u.pathname === "/") {
      return `${u.protocol}//${u.host}${u.search}`;
    }
  } catch {
    // Keep default if parsing fails.
  }
  return normalizedUrl;
}
