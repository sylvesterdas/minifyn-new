import { NextRequest, NextResponse } from "next/server";

const WEBRISK_API_KEY = process.env.LINKGUARD_WEBRISK_API_KEY!;
const BEARER_TOKEN = process.env.LINKGUARD_BEARER_TOKEN!;


export async function POST(req: NextRequest) {
  let url: string;

  try {
    const data = await req.json();
    url = String(data?.url || "").trim();
  } catch {
    return NextResponse.json(
      { risk: "warning", reason: "Invalid request body" },
      { status: 400 }
    );
  }

  // 1. Basic validation
  if (!isValidUrl(url)) {
    return NextResponse.json({
      risk: "warning",
      reason: "Invalid URL format",
    });
  }

  const normalizedUrl = normalizeUrl(url);

  // 2. Google Web Risk (hard signal)
  try {
    const webRiskRes = await fetch(
      `https://webrisk.googleapis.com/v1/uris:search?` +
        `uri=${encodeURIComponent(normalizedUrl)}` +
        `&threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING` +
        `&key=${WEBRISK_API_KEY}`,
      { cache: "no-store" }
    );

    console.log(await webRiskRes.text())
    if (webRiskRes.ok) {
      const json = await webRiskRes.json();
      if (json.threat?.threatTypes?.length > 0) {
        return NextResponse.json({
          risk: "risky",
          reason: "This link matches known scam reports",
        });
      }
    }
  } catch {
    // Fail open — do NOT block user if API fails
  }

  // 3. Heuristics (soft signals)
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

  // 4. Default
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
  u.hash = ""; // remove fragment
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
