import { NextRequest, NextResponse } from "next/server";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.minifyn.linkguard";

const BOT_UA_REGEX = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|preview|fetch|headless|lighthouse/i;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAgent = request.headers.get("user-agent") || "";
  const isPrefetch = request.headers.get("purpose") === "prefetch" || request.headers.get("sec-purpose") === "prefetch";

  // Build target Play Store redirect URL preserving UTM parameters
  const playUrl = new URL(PLAY_STORE_URL);
  const utmSource = sanitizeParam(searchParams.get("utm_source") || "direct");
  const utmMedium = sanitizeParam(searchParams.get("utm_medium") || "organic");
  const utmCampaign = sanitizeParam(searchParams.get("utm_campaign") || "none");
  const utmContent = sanitizeParam(searchParams.get("utm_content") || "none");
  const placement = sanitizeParam(searchParams.get("placement") || "hero");

  if (utmSource !== "direct") {
    playUrl.searchParams.set("referrer", `utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&utm_content=${utmContent}`);
  }

  // Count qualified clicks if not a bot or prefetch request
  if (!isPrefetch && !BOT_UA_REGEX.test(userAgent)) {
    try {
      const { db } = await import("@/lib/firebase-admin");
      const today = new Date().toISOString().slice(0, 10);
      // Placement breakdown
      const clickRef = db.ref(`scamguard_analytics/cta_clicks/${today}/${placement}`);
      await clickRef.transaction((current) => (current || 0) + 1);

      // Campaign breakdown
      if (utmCampaign !== "none") {
        const campaignRef = db.ref(`scamguard_analytics/campaign_clicks/${today}/${utmCampaign}`);
        await campaignRef.transaction((current) => (current || 0) + 1);
      }
    } catch {
      // Storage errors must never prevent user redirect
    }
  }

  // Return no-cache 302 redirect
  const response = NextResponse.redirect(playUrl.toString(), 302);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  return response;
}

function sanitizeParam(value: string | null): string {
  if (!value) return "none";
  return value.replace(/[^a-zA-Z0-9_\-\.]/g, "").slice(0, 50) || "none";
}
