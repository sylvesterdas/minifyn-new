import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  Crown,
  Lock,
  QrCode,
  ScanSearch,
  Settings,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

const siteUrl = 'https://www.minifyn.com';
const pageUrl = `/scamguard`;
const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.minifyn.linkguard';
const title = 'ScamGuard: AI Link Checker for Android | MiniFyn';
const description =
  'ScamGuard: Link Checker is MiniFyn’s Android app for reviewing suspicious URLs, QR links, and browser handoffs before you open them, with Free, Pro, and AI Mode checks.';
const socialImageBase = `${siteUrl}/images/scamguard-social`;
const ogImageUrl = `${socialImageBase}/scamguard-og-1200x630.png`;
const twitterImageUrl = `${socialImageBase}/scamguard-twitter-1600x900.png`;
const squareImageUrl = `${socialImageBase}/scamguard-square-1200x1200.png`;
const fourThreeImageUrl = `${socialImageBase}/scamguard-social-1200x900.png`;
const socialImageAlt = 'ScamGuard Link Checker showing AI Mode analysis on Android';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${pageUrl}`,
    siteName: 'MiniFyn',
    type: 'website',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: socialImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: twitterImageUrl, alt: socialImageAlt }],
  },
};

const featureCards = [
  {
    title: 'Check links before opening',
    description: 'Paste a URL from SMS, email, chat, or social media and review risk signals before you tap through.',
    icon: ScanSearch,
  },
  {
    title: 'Review QR links first',
    description: 'Use the camera only when you choose to scan a QR code, then review the discovered link before opening it.',
    icon: QrCode,
  },
  {
    title: 'Use Android quick checks',
    description: 'Set ScamGuard as part of your Android link flow to inspect links locally before handing them to a browser.',
    icon: Smartphone,
  },
  {
    title: 'See AI-assisted signals',
    description: 'A bundled AI baseline and signed model updates help surface suspicious patterns, with full details in AI Mode.',
    icon: BrainCircuit,
  },
  {
    title: 'Follow signed risk policy',
    description: 'Risk lists and domain rules are loaded through signed policy updates so checks can improve over time.',
    icon: BadgeCheck,
  },
  {
    title: 'Stay in control',
    description: 'History, reminders, announcements, trusted domains, and diagnostics are managed from app settings.',
    icon: Lock,
  },
];

const useCases = [
  'Unexpected payment or delivery links in SMS',
  'QR codes on posters, packages, or messages',
  'Login reset links that seem slightly off',
  'Offer, lottery, reward, or KYC messages',
  'Unknown links shared in chats or social posts',
  'Browser handoffs where you want a quick local warning',
];

const trustPoints = [
  'Android package: com.minifyn.linkguard',
  'Production checks use /api/linkguard/v3/check',
  'AI model metadata uses /api/scamguard-ai/v4/model-manifest',
  'Published app privacy policy and terms',
];

const currentCapabilities = [
  {
    title: 'Layered link analysis',
    description:
      'Local URL structure, HTTPS, domain, homoglyph, typosquatting, suspicious keyword, shortener, reputation, redirect, and AI-assisted checks work together.',
    icon: ShieldCheck,
  },
  {
    title: 'Native Android quick checks',
    description:
      'Quick-check handoff, preferred browser selection, and trusted quick-check domains help users review links before opening them.',
    icon: Smartphone,
  },
  {
    title: 'Private controls',
    description:
      'Optional on-device history, local cache, daily caution reminders, app announcements, and diagnostics stay visible and manageable.',
    icon: Settings,
  },
  {
    title: 'Model and policy updates',
    description:
      'The app includes a bundled AI model baseline and can fetch signed policy and model updates from MiniFyn infrastructure.',
    icon: BrainCircuit,
  },
];

const tierCards = [
  {
    title: 'Free',
    subtitle: 'Basic checks for everyday link review.',
    icon: ShieldCheck,
    items: [
      'Check suspicious links before opening them.',
      'Scan QR codes and inspect discovered links.',
      'See URL, HTTPS, domain, spoofing, and local AI baseline signals.',
      'Use optional local history and daily caution reminders.',
    ],
  },
  {
    title: 'Pro',
    subtitle: 'More detailed checks for people who scan often.',
    icon: Crown,
    items: [
      'Includes everything in Free.',
      'Cloud reputation checks for regular use.',
      'Structured Pro risk score: Low, Medium, or Elevated.',
      'Redirect, cross-domain, brand mismatch, and domain-ending checks.',
    ],
  },
  {
    title: 'AI Mode',
    subtitle: 'Advanced guidance for harder-to-judge links.',
    icon: BrainCircuit,
    items: [
      'Includes everything in Pro.',
      'Unlocks full AI review details for suspicious patterns.',
      'Shows plain-language model reasoning and risk context.',
      'Uses signed AI model metadata and model updates.',
      'Managed as a Google Play subscription under your Play account.',
    ],
  },
];

const faqs = [
  {
    question: 'What is ScamGuard: Link Checker?',
    answer:
      'ScamGuard: Link Checker is an Android app by MiniFyn that helps users review suspicious URLs, QR links, and Android link handoffs before opening them.',
  },
  {
    question: 'Who is ScamGuard: Link Checker for?',
    answer:
      'It is useful for anyone who receives unexpected links by SMS, email, QR code, chat, or social media and wants a quick risk check before clicking.',
  },
  {
    question: 'Does ScamGuard: Link Checker replace antivirus or browser security?',
    answer:
      'No. It is a focused link-checking tool that can add an extra layer of caution, but it should be used alongside normal device and account security practices.',
  },
  {
    question: 'What is the difference between Free, Pro, and AI Mode?',
    answer:
      'Free covers local link checks, QR scanning, reminders, and baseline AI-assisted signals. Pro adds cloud reputation and deeper redirect, brand, and domain checks. AI Mode includes Pro plus full AI review details for harder-to-judge links.',
  },
  {
    question: 'Does ScamGuard send every opened link to MiniFyn?',
    answer:
      'No. The app is designed around user-initiated checks and local controls. Links may be submitted for analysis when you choose to check them, while local history and trusted-domain settings stay on the device.',
  },
  {
    question: 'Where can I find ScamGuard: Link Checker policies?',
    answer:
      'The app privacy policy and terms are published on this site so users, reviewers, and partners can access them on a stable public URL.',
  },
];

export default function ScamGuardPage() {
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'ScamGuard: Link Checker',
    operatingSystem: 'Android',
    applicationCategory: 'SecurityApplication',
    description,
    url: `${siteUrl}${pageUrl}`,
    image: [ogImageUrl, squareImageUrl, fourThreeImageUrl, twitterImageUrl],
    publisher: {
      '@type': 'Organization',
      name: 'MiniFyn',
      url: siteUrl,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    downloadUrl: playStoreUrl,
    softwareVersion: '2.4.2',
    featureList: [
      'Suspicious URL checks',
      'QR code link scanning',
      'Android quick-check handoff',
      'Free, Pro, and AI Mode tiers',
      'AI-assisted risk analysis',
      'Daily caution reminders',
      'App announcements',
    ],
    sameAs: playStoreUrl,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(10,95,144,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:26px_26px]" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="space-y-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/75 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Android link review app by MiniFyn
              </div>

              <div className="space-y-5">
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src="/images/linkguard-logo.svg"
                    alt="ScamGuard: Link Checker logo"
                    width={64}
                    height={64}
                    className="h-14 w-14 rounded-2xl shadow-lg ring-1 ring-white/10"
                  />
                  <div className="min-w-0">
                    <h1 className="text-5xl font-semibold text-foreground sm:text-6xl lg:text-7xl">
                      ScamGuard: Link Checker
                    </h1>
                    <p className="mt-1 text-xl text-muted-foreground sm:text-2xl">
                      Check suspicious links before you click.
                    </p>
                  </div>
                </div>

                <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground sm:text-[1.1rem]">
                  ScamGuard: Link Checker helps people review suspicious URLs from messages, emails, QR codes,
                  chats, and Android link handoffs before opening them. It gives users a practical way to pause,
                  inspect, and spot scam or phishing-style risk signals.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Built By</p>
                  <p className="mt-2 text-base font-semibold text-foreground">MiniFyn</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Platform</p>
                  <div className="mt-2 inline-flex items-center justify-center gap-2 text-base font-semibold text-foreground">
                    <Smartphone className="h-4.5 w-4.5 text-primary" />
                    Android
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Focus</p>
                  <p className="mt-2 text-base font-semibold text-foreground">Link risk checks</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <Link href="/scamguard/legal/privacy">View Privacy Policy</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <Link href="/scamguard/legal/terms">View Terms</Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Use case</p>
                  <p className="mt-2 text-sm text-foreground">Review links and QR destinations first</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Availability</p>
                  <p className="mt-2 text-sm text-foreground">Android on Google Play</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {trustPoints.map((point) => (
                  <Badge
                    key={point}
                    variant="outline"
                    className="rounded-full border-primary/20 bg-background/60 px-3 py-1 text-sm text-foreground/85"
                  >
                    {point}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative mx-auto w-full max-w-[320px]">
                <div className="absolute inset-x-8 bottom-6 top-8 -z-10 rounded-[3rem] bg-primary/15 blur-3xl" />
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-background/65 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Android app</p>
                      <p className="mt-1 text-lg font-semibold">URL Scanner</p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      MiniFyn
                    </div>
                  </div>

                  <div className="mx-auto w-full rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-2.5 shadow-2xl">
                    <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-zinc-700" />
                    <div className="overflow-hidden rounded-[2rem] border border-black/20 bg-black">
                      <Image
                        src="/images/scamguard-link-checker-ai.png"
                        alt="ScamGuard Link Checker URL Scanner in AI Mode on Android"
                        width={1080}
                        height={2400}
                        className="h-auto w-full"
                      />
                    </div>
                  </div>

                </div>

                <div className="mt-4 flex justify-center">
                  <Link
                    href={playStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex transition-transform hover:-translate-y-0.5"
                    aria-label="Get ScamGuard: Link Checker on Google Play"
                  >
                    <Image
                      src="/images/google-play-badge.svg"
                      alt="Get it on Google Play"
                      width={180}
                      height={60}
                      className="h-16 w-auto"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/40 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why ScamGuard: Link Checker exists</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Most dangerous links do not look dangerous at first glance. ScamGuard is built for the moment when
              a URL, QR code, or browser handoff feels just suspicious enough that you want a second look first.
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
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Current check set</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The current app combines local checks, cloud reputation, signed risk policy, and AI-assisted review
              so users can understand risk without needing a security background.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2">
            {currentCapabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <div key={capability.title} className="rounded-3xl border bg-background/80 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{capability.title}</h3>
                  <p className="mt-2 text-muted-foreground">{capability.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-card/40 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border bg-background/80 p-8 shadow-sm">
              <h2 className="text-2xl font-bold sm:text-3xl">When people use it</h2>
              <p className="mt-4 text-muted-foreground">
                ScamGuard is designed for common, real-world situations where an unfamiliar link appears unexpectedly
                and the cautious choice is to verify first.
              </p>
              <ul className="mt-6 grid gap-3">
                {useCases.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border bg-card/60 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border bg-background/80 p-8 shadow-sm">
              <h2 className="text-2xl font-bold sm:text-3xl">What users can manage</h2>
              <div className="mt-6 space-y-5 text-muted-foreground">
                <p>History is optional and stored on device when enabled.</p>
                <p>Daily caution reminders and app announcements can be turned off in settings.</p>
                <p>Trusted quick-check domains and preferred browser handoff settings can be managed from the app.</p>
                <p>Diagnostics show app version, active plan, and AI analysis version for easier support and review.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Free, Pro, and AI Mode</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              ScamGuard has different checking levels depending on how often you review links and how much context
              you want before deciding.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
            {tierCards.map((tier) => {
              const Icon = tier.icon;

              return (
                <div key={tier.title} className="flex h-full flex-col rounded-3xl border bg-background/85 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">{tier.title}</h3>
                  <p className="mt-2 text-muted-foreground">{tier.subtitle}</p>
                  <ul className="mt-6 space-y-3">
                    {tier.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-card/40 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl rounded-[2rem] border bg-background/85 p-8 shadow-sm md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Policies, ownership, and support</h2>
                <p className="mt-4 text-muted-foreground">
                  This page is intended to be a stable public home for the app. It helps connect the
                  product name, the publisher, the Android listing, the package id, and the app’s legal documents.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href="/scamguard/legal/privacy">Privacy Policy</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/scamguard/legal/terms">Terms of Use</Link>
                  </Button>
                  <Link
                    href={playStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex transition-transform hover:-translate-y-0.5"
                    aria-label="View ScamGuard: Link Checker on Google Play"
                  >
                    <Image
                      src="/images/google-play-badge.svg"
                      alt="Get it on Google Play"
                      width={180}
                      height={60}
                      className="h-14 w-auto"
                    />
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border bg-card/60 p-6">
                <h3 className="text-xl font-semibold">What this page makes clear</h3>
                <ul className="mt-5 space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    The app name is ScamGuard: Link Checker.
                  </li>
                  <li className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    The publisher is MiniFyn.
                  </li>
                  <li className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    The app is available on Android.
                  </li>
                  <li className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    Public policy URLs are available for review.
                  </li>
                  <li className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    The app uses MiniFyn link-check and AI-model API routes.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Helpful context for users, reviewers, and partners checking the app’s purpose and public documentation.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border bg-background/80 px-6 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`faq-${index}`}
                    className="border-white/10 last:border-b-0"
                  >
                    <AccordionTrigger className="py-6 text-left text-lg font-semibold text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-base leading-7 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
