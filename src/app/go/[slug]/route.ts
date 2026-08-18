import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug, recordClick } from "@/lib/data";

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

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("remote-addr") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "direct";
    const language = request.headers.get("accept-language") || "unknown";

    recordClick(slug, {
      ip,
      userAgent,
      referer,
      language,
    }).catch((err) => {
      console.error(`[Go Route] Failed to record click for ${slug}:`, err);
    });

    const destination = link.longUrl.startsWith("http://") || link.longUrl.startsWith("https://")
      ? link.longUrl
      : `https://${link.longUrl}`;

    const response = NextResponse.redirect(destination, 307);
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return response;
  } catch (error) {
    console.error(`[Go Route] Error resolving slug '${slug}':`, error);
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
}
