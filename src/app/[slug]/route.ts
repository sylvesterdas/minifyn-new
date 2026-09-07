import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug, recordClick } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await props.params;

  if (!rawSlug) {
    return new NextResponse(null, { status: 404 });
  }

  const pathname = request.nextUrl?.pathname || "";
  const isInfoRequest =
    pathname.endsWith("+") ||
    pathname.endsWith("%2B") ||
    rawSlug.endsWith("+") ||
    rawSlug.endsWith("%2B") ||
    rawSlug.endsWith(" ");

  const slug = isInfoRequest
    ? (rawSlug.trim().replace(/\+$/, "").replace(/%2B$/, "") || pathname.replace(/^\//, "").replace(/\+$/, "").replace(/%2B$/, "").trim())
    : rawSlug.trim();

  if (isInfoRequest && slug) {
    const infoUrl = new URL(`/info/${slug}`, request.url);
    return NextResponse.redirect(infoUrl, 307);
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
        return new NextResponse(null, { status: 404 });
      }
    } catch {
      return new NextResponse(null, { status: 404 });
    }

    const response = NextResponse.redirect(destinationUrl.toString(), 307);
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    return response;
  } catch (error) {
    console.error(`[Redirect Route] Error resolving slug '${slug}':`, error);
    return new NextResponse(null, { status: 404 });
  }
}
