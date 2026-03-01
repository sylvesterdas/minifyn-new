import { NextRequest, NextResponse } from "next/server";
import { messaging } from "@/lib/firebase-admin";

const TIPS = [
  "Hope you stay safe from scams today. Verify suspicious links before opening.",
  "Avoid clicking urgent links in messages. Open the official site directly.",
  "Even trusted contacts can be compromised. Verify unusual link requests.",
  "Shortened links can hide destinations. Expand or verify before tapping.",
  "Double-check domain spelling. One extra character can be a phishing trick.",
  "Never share OTPs or recovery codes from links in unsolicited messages.",
  "If a link asks for immediate action, pause and verify independently.",
  "Use official apps or bookmarks for banking and payment logins.",
  "A secure lock icon is not enough. Confirm the exact domain name too.",
  "Prize and giveaway links are common lures. Verify source authenticity first.",
  "When in doubt, do not tap. Checking first can prevent account takeover.",
  "Links in forwarded messages deserve extra caution before opening.",
  "Unexpected account alerts can be fake. Sign in manually to verify.",
  "Review URL path segments for odd words, typos, or random strings.",
  "Scam pages mimic brand style. Domain verification is your strongest signal.",
  "Don’t install APKs from links sent in chat. Use trusted app stores only.",
  "If a link asks for payment quickly, confirm through a known support channel.",
  "Look for mismatched brand/domain combinations before entering credentials.",
  "Public Wi-Fi plus unknown links is risky. Delay sensitive actions if possible.",
  "Phishing often starts with fear. Slow down before you click anything.",
  "Cross-check sender intent on a second channel when a link feels unusual.",
  "URL shorteners can be useful but still risky. Verify destination first.",
  "Keep app and OS updates current to reduce exploit risk from malicious links.",
  "If a page asks for card details unexpectedly, stop and verify legitimacy.",
  "Search for the company directly instead of opening links from unknown senders.",
  "Watch for swapped letters like rn/m or l/I in suspicious domain names.",
  "A familiar logo does not prove trust. Domains are harder to fake correctly.",
  "If a friend sends a strange link, confirm with them before opening it.",
  "Beware fake support pages asking remote access or payment immediately.",
  "Use unique passwords so one phishing event does not expose all accounts.",
  "Scammers exploit urgency. Deliberate clicks are safer than fast clicks.",
  "Consider link purpose: does this sender usually share this type of URL?",
  "Unexpected invoice or shipment links are common phishing themes.",
  "If the URL uses an IP address directly, treat it as high-risk by default.",
  "Carefully inspect TLDs on unfamiliar links, especially unusual extensions.",
  "Malicious pages often use long, noisy URLs to look technical and trustworthy.",
  "For account recovery links, prefer initiating recovery from the official app.",
  "Never disable browser security warnings just to open a link quickly.",
  "If a link asks you to log in again unexpectedly, verify before proceeding.",
  "Use this quick check before opening unknown links from chats or emails.",
];

export async function GET(request: NextRequest) {
  // Security Check: Only allow requests with the correct Bearer Token
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.LINKGUARD_BEARER_TOKEN}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    let topic = searchParams.get("topic");

    if (!topic) {
      const nowUtc = new Date();
      const currentHourUtc = nowUtc.getUTCHours();

      // Target: Morning (8:00 AM) in local time.
      // Users in target timezone currently have 8:00 AM.
      const targetOffset = 8 - currentHourUtc;

      // Construct topic name matching the Flutter side logic
      const prefix = targetOffset >= 0 ? "p" : "m";
      topic = `tips_offset_${prefix}${Math.abs(targetOffset)}`;
    }

    // Pick a tip based on the day of the year
    const nowUtc = new Date();
    const dayOfYear = Math.floor(
      (nowUtc.getTime() - new Date(nowUtc.getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const tipIndex = dayOfYear % TIPS.length;
    const message = TIPS[tipIndex];

    const payload = {
      notification: {
        title: "Daily Link Safety Tip",
        body: message,
      },
      android: {
        priority: "high" as const,
      },
      topic: topic,
    };

    // Using your existing messaging instance from @/lib/firebase-admin
    const response = await messaging.send(payload);

    return NextResponse.json({
      success: true,
      topic,
      message,
      fcmResponse: response,
    });
  } catch (error: any) {
    console.error("FCM Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
