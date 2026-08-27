import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = process.env.LINKGUARD_BEARER_TOKEN || process.env.CRON_SECRET;
  
  if (bearerToken && authHeader !== `Bearer ${bearerToken}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const results: Record<string, { count: number; status: string }> = {};

  // 1. Fetch OpenPhish feed
  try {
    const res = await fetch("https://openphish.com/feed.txt", {
      headers: { "User-Agent": "MiniFyn-ThreatHub/1.0" },
      cache: "no-store",
    });
    if (res.ok) {
      const text = await res.text();
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      results.openphish = { count: lines.length, status: "synced" };
    } else {
      results.openphish = { count: 0, status: `failed_${res.status}` };
    }
  } catch (err: unknown) {
    results.openphish = { count: 0, status: err instanceof Error ? err.message : "error" };
  }

  // 2. Fetch URLhaus feed
  try {
    const res = await fetch("https://urlhaus.abuse.ch/downloads/csv_recent/", {
      headers: { "User-Agent": "MiniFyn-ThreatHub/1.0" },
      cache: "no-store",
    });
    if (res.ok) {
      const text = await res.text();
      const lines = text.split("\n").filter((l) => l.trim().length > 0 && !l.startsWith("#"));
      results.urlhaus = { count: lines.length, status: "synced" };
    } else {
      results.urlhaus = { count: 0, status: `failed_${res.status}` };
    }
  } catch (err: unknown) {
    results.urlhaus = { count: 0, status: err instanceof Error ? err.message : "error" };
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    feeds: results,
  });
}
