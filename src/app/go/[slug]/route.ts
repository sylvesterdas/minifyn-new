import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug, recordClick } from "@/lib/data";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  if (!slug) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const link = await getLinkBySlug(slug);

    if (!link || !link.longUrl) {
      return new NextResponse(null, { status: 404 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("remote-addr") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "direct";
    const language = request.headers.get("accept-language") || "unknown";

    const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;

    recordClick(slug, {
      ip,
      userAgent,
      referer,
      language,
      country,
    }).catch((err) => {
      console.error(`[Go Route] Failed to record click for ${slug}:`, err);
    });

    let destinationUrl: URL;
    try {
      const rawTarget =
        link.longUrl.startsWith("http://") || link.longUrl.startsWith("https://")
          ? link.longUrl
          : `https://${link.longUrl}`;
      destinationUrl = new URL(rawTarget);
      if (destinationUrl.protocol !== "http:" && destinationUrl.protocol !== "https:") {
        return new NextResponse(null, { status: 404 });
      }
    } catch {
      return new NextResponse(null, { status: 404 });
    }

    const response = NextResponse.redirect(destinationUrl.toString(), 307);
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    return response;
  } catch (error) {
    console.error(`[Go Route] Error resolving slug '${slug}':`, error);
    return new NextResponse(null, { status: 404 });
  }
}
