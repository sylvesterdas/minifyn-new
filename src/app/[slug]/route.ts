import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug, recordClick } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  if (!slug) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  try {
    const link = await getLinkBySlug(slug);

    if (!link || !link.longUrl) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // Extract headers efficiently
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("remote-addr") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "direct";
    const language = request.headers.get("accept-language") || "unknown";
    // Zero-overhead edge geolocation provided by Vercel / Cloudflare
    const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;

    // Fire and forget click recording to avoid blocking the redirect response
    recordClick(slug, {
      ip,
      userAgent,
      referer,
      language,
      country,
    }).catch((err) => {
      console.error(`[Redirect Route] Failed to record click for ${slug}:`, err);
    });

    let destinationUrl: URL;
    try {
      const rawTarget =
        link.longUrl.startsWith("http://") || link.longUrl.startsWith("https://")
          ? link.longUrl
          : `https://${link.longUrl}`;
      destinationUrl = new URL(rawTarget);
      if (destinationUrl.protocol !== "http:" && destinationUrl.protocol !== "https:") {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    const response = NextResponse.redirect(destinationUrl.toString(), 307);
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    return response;
  } catch (error) {
    console.error(`[Redirect Route] Error resolving slug '${slug}':`, error);
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
}
