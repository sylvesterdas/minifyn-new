import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { GoogleAuth } from "google-auth-library";

export const runtime = "nodejs";

const WEBRISK_API_KEY = process.env.LINKGUARD_WEBRISK_API_KEY || "";
const PLAY_INTEGRITY_ENABLED = process.env.LINKGUARD_PLAY_INTEGRITY_ENABLED === "true";
const PLAY_INTEGRITY_ENFORCE = process.env.LINKGUARD_PLAY_INTEGRITY_ENFORCE === "true";
const PLAY_INTEGRITY_DEBUG_LOGS =
  process.env.LINKGUARD_PLAY_INTEGRITY_DEBUG_LOGS === "true";
const PLAY_INTEGRITY_PACKAGE_NAME = process.env.LINKGUARD_PLAY_PACKAGE_NAME || "";
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
const OPENPHISH_REFRESH_MS = 30 * 60 * 1000;
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX_REQUESTS = 120;
const OFFICIAL_SAFE_DOMAINS = new Set([
  "minifyn.com",
  "mnfy.in",
  "sylvesterdas.com",
]);
const PROTECTED_BRANDS = new Set([
  "paypal",
  "apple",
  "google",
  "microsoft",
  "amazon",
  "netflix",
  "instagram",
  "facebook",
  "whatsapp",
  "binance",
]);

type Risk = "safe" | "warning" | "risky";
type ReputationStatus = "hit" | "clean" | "unavailable";

type Verdict = {
  risk: Risk;
  reason: string;
  checked_at: number;
};

type CacheEntry = {
  value: Verdict;
  expiresAt: number;
};

type OpenPhishCache = {
  hosts: Set<string>;
  fetchedAt: number;
};

type RateEntry = {
  count: number;
  windowStart: number;
};

type RouteState = {
  verdictCache: Map<string, CacheEntry>;
  inFlightByHash: Map<string, Promise<Verdict>>;
  openPhish: OpenPhishCache;
  rateByIp: Map<string, RateEntry>;
};

const globalState = globalThis as typeof globalThis & {
  __linkguardState__?: RouteState;
};

const state: RouteState =
  globalState.__linkguardState__ ||
  (globalState.__linkguardState__ = {
    verdictCache: new Map<string, CacheEntry>(),
    inFlightByHash: new Map<string, Promise<Verdict>>(),
    openPhish: { hosts: new Set<string>(), fetchedAt: 0 },
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
      console.info("[linkguard][integrity]", {
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
          headers: { "x-linkguard-integrity": "blocked" },
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
      headers: { "x-linkguard-cache": "hit" },
    });
  }

  const active = state.inFlightByHash.get(urlHash);
  if (active) {
    const verdict = await active;
    return NextResponse.json(verdict, {
      status: 200,
      headers: { "x-linkguard-cache": "coalesced" },
    });
  }

  const task = computeVerdict(normalizedUrl, url);
  state.inFlightByHash.set(urlHash, task);

  try {
    const verdict = await task;
    setCachedVerdict(urlHash, verdict);

    return NextResponse.json(verdict, {
      status: 200,
      headers: { "x-linkguard-cache": "miss" },
    });
  } finally {
    state.inFlightByHash.delete(urlHash);
  }
}

function hasSuspiciousChars(
  normalizedUrl: string,
  rawUrl: string
): { reason: string } | null {
  try {
    const normalizedHost = new URL(normalizedUrl).hostname.toLowerCase();
    const rawHost = rawHostFromUrl(rawUrl) || normalizedHost;

    if (normalizedHost.includes("xn--")) {
      return { reason: "Internationalized/punycode host detected" };
    }

    // Check for invisible or zero-width characters.
    // U+200B: Zero Width Space
    // U+200C: Zero Width Non-Joiner
    // U+200D: Zero Width Joiner
    // U+FEFF: Zero Width No-Break Space / BOM
    // U+00AD: Soft Hyphen
    if (/[\u200B-\u200D\uFEFF\u00AD]/.test(rawHost)) {
      return { reason: "Link contains invisible characters" };
    }

    // Check for mixed scripts (e.g., Latin and Cyrillic characters).
    // This is a strong indicator of a potential homoglyph attack.
    const scripts: { [key: string]: RegExp } = {
      Latin: /[a-zA-Z]/,
      Cyrillic: /[\u0400-\u04FF]/,
      Greek: /[\u0370-\u03FF]/,
    };

    const detectedScripts = Object.keys(scripts).filter((script) =>
      scripts[script].test(rawHost)
    );

    if (detectedScripts.length > 1) {
      return {
        reason: `Link contains mixed scripts (${detectedScripts.join(", ")})`,
      };
    }
  } catch {
    return null;
  }
  return null;
}

async function computeVerdict(normalizedUrl: string, rawUrl: string): Promise<Verdict> {
  const checked_at = nowSec();

  if (isOfficialSafeUrl(normalizedUrl)) {
    return {
      risk: "safe",
      reason: "Official trusted domain",
      checked_at,
    };
  }

  const suspiciousChars = hasSuspiciousChars(normalizedUrl, rawUrl);
  if (suspiciousChars) {
    return {
      risk: "risky",
      reason: suspiciousChars.reason,
      checked_at,
    };
  }

  const lookalike = detectProtectedBrandLookalike(normalizedUrl);
  if (lookalike) {
    return {
      risk: "risky",
      reason: lookalike.reason,
      checked_at,
    };
  }

  const [webRiskStatus, openPhishStatus] = await Promise.all([
    checkWebRisk(normalizedUrl),
    checkOpenPhish(normalizedUrl),
  ]);

  if (webRiskStatus === "hit" || openPhishStatus === "hit") {
    return {
      risk: "risky",
      reason: "This link matches known scam or malware reports",
      checked_at,
    };
  }

  if (webRiskStatus === "unavailable" && openPhishStatus === "unavailable") {
    return {
      risk: "warning",
      reason: "Reputation checks are unavailable right now. Treat this link with caution.",
      checked_at,
    };
  }

  if (isShortenedUrl(normalizedUrl)) {
    return {
      risk: "warning",
      reason: "Shortened links can hide the final destination",
      checked_at,
    };
  }

  if (!normalizedUrl.startsWith("https://")) {
    return {
      risk: "warning",
      reason: "This link does not use a secure connection",
      checked_at,
    };
  }

  return { risk: "safe", reason: "No known issues found", checked_at };
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
    const openPhish = await loadOpenPhishHosts();
    if (!openPhish.available) return "unavailable";
    const host = new URL(normalizedUrl).hostname.toLowerCase();
    return openPhish.hosts.has(host) ? "hit" : "clean";
  } catch {
    return "unavailable";
  }
}

async function loadOpenPhishHosts(): Promise<{ hosts: Set<string>; available: boolean }> {
  const now = Date.now();
  if (
    state.openPhish.hosts.size > 0 &&
    now - state.openPhish.fetchedAt < OPENPHISH_REFRESH_MS
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
    state.openPhish = { hosts, fetchedAt: now };
  }

  return {
    hosts: state.openPhish.hosts,
    available: state.openPhish.hosts.size > 0,
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

function isShortenedUrl(value: string): boolean {
  const shorteners = new Set([
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "is.gd",
    "buff.ly",
    "ow.ly",
    "cutt.ly",
  ]);

  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    return shorteners.has(host);
  } catch {
    return false;
  }
}

function isOfficialSafeUrl(value: string): boolean {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" || u.username || u.password) return false;
    const host = u.hostname.toLowerCase();
    return Array.from(OFFICIAL_SAFE_DOMAINS).some(
      (domain) => host === domain || host.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

function detectProtectedBrandLookalike(value: string): { reason: string } | null {
  try {
    const host = new URL(value).hostname.toLowerCase();
    const rootLabel = extractRootLabel(host);
    const rootSkeleton = brandSkeleton(rootLabel);

    for (const brand of PROTECTED_BRANDS) {
      if (rootLabel === brand) continue;
      if (
        rootSkeleton === brand ||
        levenshtein(rootLabel, brand) <= 1 ||
        levenshtein(rootSkeleton, brand) <= 1
      ) {
        return { reason: `Domain looks like a fake ${brand} lookalike` };
      }
    }
  } catch {
    return null;
  }
  return null;
}

function rawHostFromUrl(value: string): string {
  const trimmed = value.trim();
  const withoutScheme = trimmed.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const authority = withoutScheme.split(/[/?#]/, 1)[0] || "";
  const withoutUserinfo = authority.includes("@")
    ? authority.slice(authority.lastIndexOf("@") + 1)
    : authority;
  return withoutUserinfo.replace(/:\d+$/, "").toLowerCase();
}

function extractRootLabel(host: string): string {
  const labels = host.split(".").filter(Boolean);
  return labels.length < 2 ? host : labels[labels.length - 2];
}

function brandSkeleton(value: string): string {
  const mapped = Array.from(value.toLowerCase())
    .map((char) => {
      switch (char) {
        case "а":
        case "α":
          return "a";
        case "с":
        case "ϲ":
          return "c";
        case "е":
        case "ε":
          return "e";
        case "і":
        case "ι":
          return "i";
        case "о":
        case "ο":
          return "o";
        case "р":
        case "ρ":
          return "p";
        case "ѕ":
          return "s";
        case "х":
        case "χ":
          return "x";
        case "у":
          return "y";
        default:
          return char;
      }
    })
    .join("");
  return mapped.replaceAll("rn", "m");
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const rows = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = rows[0];
    rows[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = rows[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[j] = Math.min(rows[j] + 1, rows[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return rows[b.length];
}

function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
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
    // Flutter Uri.toString() may omit trailing "/" on root path, including
    // root URLs that still carry query params.
    if (u.pathname === "/") {
      return `${u.protocol}//${u.host}${u.search}`;
    }
  } catch {
    // Keep default if URL parsing fails unexpectedly.
  }
  return normalizedUrl;
}
