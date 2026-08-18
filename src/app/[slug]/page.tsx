import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getLinkBySlug, recordClick } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ShortLinkPage(props: Props) {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const link = await getLinkBySlug(slug);

  if (!link || !link.longUrl) {
    notFound();
  }

  const reqHeaders = await headers();
  const forwarded = reqHeaders.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : reqHeaders.get("remote-addr") || "unknown";
  const userAgent = reqHeaders.get("user-agent") || "unknown";
  const referer = reqHeaders.get("referer") || "direct";
  const language = reqHeaders.get("accept-language") || "unknown";

  // Record click analytics asynchronously
  recordClick(slug, {
    ip,
    userAgent,
    referer,
    language,
  }).catch((err) => {
    console.error(`[Redirect] Failed to record click for ${slug}:`, err);
  });

  const destination = link.longUrl.startsWith("http://") || link.longUrl.startsWith("https://")
    ? link.longUrl
    : `https://${link.longUrl}`;

  redirect(destination);
}
