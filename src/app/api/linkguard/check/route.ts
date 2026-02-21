import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

const WEBRISK_API_KEY = process.env.LINKGUARD_WEBRISK_API_KEY || "";

const VERDICT_TTL_MS = 48 * 60 * 60 * 1000;
const OPENPHISH_REFRESH_MS = 30 * 60 * 1000;
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX_REQUESTS = 120;

type Risk = "safe" | "warning" | "risky";

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

  try {
    const data = await req.json();
    url = String(data?.url || "").trim();
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

  const cached = getCachedVerdict(urlHash);
  if (cached) {
    return NextResponse.json(cached, {
      status: 200,
      headers: { "x-linkguard-cache": "hit" },
    });
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

  const active = state.inFlightByHash.get(urlHash);
  if (active) {
    const verdict = await active;
    return NextResponse.json(verdict, {
      status: 200,
      headers: { "x-linkguard-cache": "coalesced" },
    });
  }

  const task = computeVerdict(normalizedUrl);
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

async function computeVerdict(normalizedUrl: string): Promise<Verdict> {
  const checked_at = nowSec();

  const [webRiskHit, openPhishHit] = await Promise.all([
    checkWebRisk(normalizedUrl),
    checkOpenPhish(normalizedUrl),
  ]);

  if (webRiskHit || openPhishHit) {
    return {
      risk: "risky",
      reason: "This link matches known scam or malware reports",
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

async function checkWebRisk(normalizedUrl: string): Promise<boolean> {
  if (!WEBRISK_API_KEY) return false;

  const endpoint =
    "https://webrisk.googleapis.com/v1/uris:search" +
    `?uri=${encodeURIComponent(normalizedUrl)}` +
    "&threatTypes=MALWARE" +
    "&threatTypes=SOCIAL_ENGINEERING" +
    `&key=${WEBRISK_API_KEY}`;

  try {
    const res = await fetchWithTimeout(endpoint, 4000);
    if (!res.ok) return false;

    const json = (await res.json()) as {
      threat?: { threatTypes?: string[] };
    };

    return Boolean(json.threat?.threatTypes?.length);
  } catch {
    return false;
  }
}

async function checkOpenPhish(normalizedUrl: string): Promise<boolean> {
  try {
    const hosts = await loadOpenPhishHosts();
    const host = new URL(normalizedUrl).hostname.toLowerCase();
    return hosts.has(host);
  } catch {
    return false;
  }
}

async function loadOpenPhishHosts(): Promise<Set<string>> {
  const now = Date.now();
  if (
    state.openPhish.hosts.size > 0 &&
    now - state.openPhish.fetchedAt < OPENPHISH_REFRESH_MS
  ) {
    return state.openPhish.hosts;
  }

  const res = await fetchWithTimeout("https://openphish.com/feed.txt", 6000);
  if (!res.ok) return state.openPhish.hosts;

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

  return state.openPhish.hosts;
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
  u.hash = "";
  return u.toString().toLowerCase();
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
