import { NextRequest, NextResponse } from "next/server";

const WEBRISK_API_KEY = process.env.LINKGUARD_WEBRISK_API_KEY!;

export async function POST(req: NextRequest) {
  let url: string;

  // -------------------------------
  // Parse request
  // -------------------------------
  try {
    const data = await req.json();
    url = String(data?.url || "").trim();
  } catch {
    return NextResponse.json(
      { risk: "warning", reason: "Invalid request body" },
      { status: 400 }
    );
  }

  // -------------------------------
  // Basic validation
  // -------------------------------
  if (!isValidUrl(url)) {
    return NextResponse.json({
      risk: "warning",
      reason: "Invalid URL format",
    });
  }

  const normalizedUrl = normalizeUrl(url);

  // -------------------------------
  // HARD SIGNALS (must win)
  // -------------------------------
  let isHardRisk = false;

  // Google Web Risk
  try {
    const res = await fetch(
      `https://webrisk.googleapis.com/v1/uris:search?` +
        `uri=${encodeURIComponent(normalizedUrl)}` +
        `&threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING` +
        `&key=${WEBRISK_API_KEY}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const json = await res.json();
      if (json.threat?.threatTypes?.length > 0) {
        isHardRisk = true;
      }
    }
  } catch {
    // fail open
  }

  // OpenPhish (simple text feed)
  try {
    const feedRes = await fetch("https://openphish.com/feed.txt", {
      cache: "no-store",
    });

    if (feedRes.ok) {
      const text = await feedRes.text();
      const host = new URL(normalizedUrl).hostname;

      if (text.includes(host)) {
        isHardRisk = true;
      }
    }
  } catch {
    // fail open
  }

  if (isHardRisk) {
    return NextResponse.json({
      risk: "risky",
      reason: "This link matches known scam or malware reports",
    });
  }

  // -------------------------------
  // SOFT SIGNALS
  // -------------------------------
  if (isShortenedUrl(normalizedUrl)) {
    return NextResponse.json({
      risk: "warning",
      reason: "Shortened links can hide the final destination",
    });
  }

  if (!normalizedUrl.startsWith("https://")) {
    return NextResponse.json({
      risk: "warning",
      reason: "This link does not use a secure connection",
    });
  }

  // -------------------------------
  // DEFAULT
  // -------------------------------
  return NextResponse.json({
    risk: "safe",
    reason: "No known issues found",
  });
}

/* ---------------- helpers ---------------- */

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
    return shorteners.has(u.hostname);
  } catch {
    return false;
  }
}
