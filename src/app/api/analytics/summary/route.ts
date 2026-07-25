import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export async function GET(request: NextRequest) {
  const expectedToken = process.env.SCAMGUARD_ANALYTICS_TOKEN;

  // Fail closed if token is unconfigured
  if (!expectedToken) {
    return NextResponse.json(
      { error: "SCAMGUARD_ANALYTICS_TOKEN environment variable is not configured on server" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  if (!validateBearerToken(authHeader, expectedToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startDate = request.nextUrl.searchParams.get("start") || getNDaysAgo(30);
  const endDate = request.nextUrl.searchParams.get("end") || new Date().toISOString().slice(0, 10);

  try {
    const { db } = await import("@/lib/firebase-admin");
    const ctaRef = db.ref("scamguard_analytics/cta_clicks");
    const campaignRef = db.ref("scamguard_analytics/campaign_clicks");

    const [ctaSnap, campaignSnap] = await Promise.all([
      ctaRef.once("value"),
      campaignRef.once("value")
    ]);

    const ctaData = ctaSnap.val() || {};
    const campaignData = campaignSnap.val() || {};

    let totalClicks = 0;
    const dateBreakdown: Record<string, number> = {};
    const placementBreakdown: Record<string, number> = { hero: 0, footer: 0 };
    const campaignBreakdown: Record<string, number> = {};

    for (const [dateStr, value] of Object.entries(ctaData)) {
      if (dateStr >= startDate && dateStr <= endDate) {
        if (typeof value === "number") {
          totalClicks += value;
          dateBreakdown[dateStr] = (dateBreakdown[dateStr] || 0) + value;
        } else if (typeof value === "object" && value !== null) {
          for (const [place, count] of Object.entries(value as Record<string, number>)) {
            const c = typeof count === "number" ? count : 0;
            totalClicks += c;
            dateBreakdown[dateStr] = (dateBreakdown[dateStr] || 0) + c;
            placementBreakdown[place] = (placementBreakdown[place] || 0) + c;
          }
        }
      }
    }

    for (const [dateStr, value] of Object.entries(campaignData)) {
      if (dateStr >= startDate && dateStr <= endDate && typeof value === "object" && value !== null) {
        for (const [camp, count] of Object.entries(value as Record<string, number>)) {
          const c = typeof count === "number" ? count : 0;
          campaignBreakdown[camp] = (campaignBreakdown[camp] || 0) + c;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      startDate,
      endDate,
      totalClicks,
      dateBreakdown,
      placementBreakdown,
      campaignBreakdown
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Analytics fetch error: ${err.message || String(err)}` }, { status: 500 });
  }
}

function validateBearerToken(header: string, expected: string): boolean {
  if (!header.startsWith("Bearer ")) return false;
  const token = header.slice(7).trim();
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);
  if (tokenBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(tokenBuf, expectedBuf);
}

function getNDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
