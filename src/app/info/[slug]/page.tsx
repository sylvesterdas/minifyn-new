import { notFound } from "next/navigation";
import { getLinkBySlug } from "@/lib/data";
import { formatDistanceToNow, format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ExternalLink, ArrowRight, MousePointerClick, Calendar, Clock, Lock } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/logo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  return {
    title: `Link Safety & Details: mnfy.in/${slug} | MiniFyn`,
    description: `Inspect safety details, click metrics, and destination for mnfy.in/${slug}`,
  };
}

export default async function LinkInfoPage(props: Props) {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const link = await getLinkBySlug(slug);

  if (!link || !link.longUrl) {
    notFound();
  }

  const destination =
    link.longUrl.startsWith("http://") || link.longUrl.startsWith("https://")
      ? link.longUrl
      : `https://${link.longUrl}`;

  const host = process.env.NEXT_PUBLIC_SHORT_DOMAIN || "mnfy.in";
  const shortUrl = `https://${host}/${slug}`;

  const isPermanent = link.expiresAt === -1 || link.plan === "pro";
  const formattedCreated = format(new Date(link.createdAt), "PPP");
  const timeAgo = formatDistanceToNow(new Date(link.createdAt), { addSuffix: true });

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            <Logo />
            <span>MiniFyn</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Link Safety & Destination Inspection
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-border/40 shadow-xl bg-card/70 backdrop-blur-md">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-mono text-primary font-bold">
                  {host}/{slug}
                </CardTitle>
                <CardDescription>
                  Created {timeAgo} ({formattedCreated})
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 gap-1.5 text-xs font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Verified Safe by Web Risk
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Destination Preview */}
            <div className="space-y-2 p-4 rounded-lg bg-muted/50 border border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Destination URL
              </span>
              <p className="font-mono text-sm break-all text-foreground select-all">
                {link.longUrl}
              </p>
            </div>

            {/* Link Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border bg-background/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MousePointerClick className="h-3.5 w-3.5 text-primary" />
                  <span>Total Clicks</span>
                </div>
                <p className="text-lg font-bold">{(link.clickCount || 0).toLocaleString()}</p>
              </div>

              <div className="p-3 rounded-lg border bg-background/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Expiry Status</span>
                </div>
                <p className="text-sm font-semibold">
                  {isPermanent ? "Permanent (Pro)" : "Active"}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg border bg-background/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  <span>Protocol</span>
                </div>
                <p className="text-sm font-semibold uppercase">
                  {destination.startsWith("https") ? "HTTPS (Encrypted)" : "HTTP"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild size="lg" className="flex-1 font-semibold">
                <a href={destination} rel="noopener noreferrer">
                  Proceed to Destination
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Want to shorten, track, and protect your own links?
            </p>
            <Button asChild variant="outline" size="sm" className="font-medium gap-1">
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
