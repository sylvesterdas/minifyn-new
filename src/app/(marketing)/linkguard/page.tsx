import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Smartphone, ScanSearch, AlertTriangle, Lock, BadgeCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'LinkGuard | MiniFyn',
  description: 'LinkGuard is MiniFyn’s Android app for checking suspicious URLs before you open them.',
  alternates: {
    canonical: 'https://www.minifyn.com/linkguard',
  },
};

const featureCards = [
  {
    title: 'Paste link to check',
    description: 'Drop in a suspicious URL and get a quick safety-focused read before you open it.',
    icon: ScanSearch,
  },
  {
    title: 'Quick safety result',
    description: 'Fast checks help you decide whether a link looks risky, suspicious, or worth avoiding.',
    icon: BadgeCheck,
  },
  {
    title: 'Scam/phishing risk alerts',
    description: 'LinkGuard is built to highlight phishing and scam-style link patterns before you tap.',
    icon: AlertTriangle,
  },
  {
    title: 'Privacy focused',
    description: 'No unnecessary data collection and no cluttered experience getting in the way.',
    icon: Lock,
  },
];

export default function LinkGuardPage() {
  return (
    <>
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(10,95,144,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.08),transparent_28%)]" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Android safety app by MiniFyn
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/linkguard-logo.svg"
                    alt="LinkGuard logo"
                    width={64}
                    height={64}
                    className="h-14 w-14 rounded-2xl shadow-lg ring-1 ring-white/10"
                  />
                  <div className="min-w-0">
                    <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                      LinkGuard
                    </h1>
                    <p className="mt-1 text-xl text-muted-foreground sm:text-2xl">
                      Check suspicious links before you click.
                    </p>
                  </div>
                </div>

                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-[1.1rem]">
                  LinkGuard is an Android app that helps users check suspicious URLs for scam, phishing,
                  and risky links before opening them.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-background/45 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">By</p>
                  <p className="mt-2 text-base font-semibold text-foreground">MiniFyn</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/45 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Platforms</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                      <Smartphone className="h-4.5 w-4.5 text-primary" />
                      Android
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/90">iOS</span>
                      <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href="https://play.google.com/store/apps/details?id=com.minifyn.linkguard"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex transition-transform hover:-translate-y-0.5"
                  aria-label="Download LinkGuard on Google Play"
                >
                  <Image
                    src="/images/google-play-badge.svg"
                    alt="Get it on Google Play"
                    width={180}
                    height={60}
                    className="h-14 w-auto"
                  />
                </Link>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  Privacy focused, easy to use, and built to help users stay safer online.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative mx-auto w-full max-w-[300px]">
                <div className="absolute inset-x-8 bottom-6 top-8 -z-10 rounded-[3rem] bg-primary/10 blur-3xl" />
                <div className="mx-auto w-full rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-2.5 shadow-2xl">
                <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-zinc-700" />
                <div className="overflow-hidden rounded-[2rem] border border-black/20 bg-black">
                  <Image
                    src="/images/linkguard-app-screenshot.jpeg"
                    alt="LinkGuard Android app screenshot showing the URL Scanner screen"
                    width={368}
                    height={798}
                    className="h-auto w-full"
                  />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/40 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why LinkGuard</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A focused, easy-to-use Android tool for checking suspicious links before they turn into a mistake.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="rounded-3xl border bg-background/85 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border bg-background/80 p-8 shadow-sm">
              <h2 className="text-2xl font-bold sm:text-3xl">What it helps with</h2>
              <div className="mt-6 space-y-5 text-muted-foreground">
                <p>LinkGuard helps you look at an unknown link before acting on it.</p>
                <p>It is built for common moments where a URL feels off, unexpected, or potentially unsafe.</p>
                <p>Privacy focused / no unnecessary data collection.</p>
                <p>Built by MiniFyn to help users stay safer online.</p>
              </div>
            </div>

            <div className="rounded-3xl border bg-background/80 p-8 shadow-sm">
              <h2 className="text-2xl font-bold sm:text-3xl">Legal and policy links</h2>
              <p className="mt-4 text-muted-foreground">
                LinkGuard already has published legal pages inside MiniFyn.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild variant="outline">
                  <Link href="/linkguard/legal/privacy">Privacy Policy</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/linkguard/legal/terms">Terms of Use</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
