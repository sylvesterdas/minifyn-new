import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Lock,
  ScanSearch,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

const siteUrl = 'https://www.minifyn.com';
const pageUrl = `${siteUrl}/linkguard`;
const title = 'LinkGuard for Android | Suspicious Link Scanner by MiniFyn';
const description =
  'LinkGuard is MiniFyn’s Android app for checking suspicious URLs before you open them. Scan risky links, spot phishing-style patterns, and review privacy and policy details in one place.';
const ogImageUrl = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    siteName: 'MiniFyn',
    type: 'website',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'LinkGuard by MiniFyn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImageUrl],
  },
};

const featureCards = [
  {
    title: 'Paste a suspicious URL',
    description: 'Drop in a link from SMS, email, chat, or social media when something feels off.',
    icon: ScanSearch,
  },
  {
    title: 'Get a quick safety read',
    description: 'See a simple result that helps you decide whether the link deserves extra caution.',
    icon: BadgeCheck,
  },
  {
    title: 'Spot phishing-style risk',
    description: 'LinkGuard is designed to highlight scam and phishing patterns before you tap through.',
    icon: AlertTriangle,
  },
  {
    title: 'Keep the experience lightweight',
    description: 'The app is focused, straightforward, and built around practical link safety checks.',
    icon: Lock,
  },
];

const useCases = [
  'Unexpected payment or delivery links in SMS',
  'Login reset links that seem slightly off',
  'Offer, lottery, reward, or KYC messages',
  'Unknown URLs shared in chats or social posts',
];

const trustPoints = [
  'Public product page under the main MiniFyn domain',
  'Published privacy policy and terms for the app',
  'Google Play listing for Android distribution',
  'Clear product ownership and support context',
];

const faqs = [
  {
    question: 'What is LinkGuard?',
    answer:
      'LinkGuard is an Android app by MiniFyn that helps users review suspicious URLs before opening them.',
  },
  {
    question: 'Who is LinkGuard for?',
    answer:
      'It is useful for anyone who receives unexpected links by SMS, email, chat, or social media and wants a quick safety check before clicking.',
  },
  {
    question: 'Does LinkGuard replace antivirus or browser security?',
    answer:
      'No. It is a focused link-checking tool that can add an extra layer of caution, but it should be used alongside normal device and account security practices.',
  },
  {
    question: 'Where can I find LinkGuard policies?',
    answer:
      'The app privacy policy and terms are published on this site so users, reviewers, and partners can access them on a stable public URL.',
  },
];

export default function LinkGuardPage() {
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'LinkGuard',
    operatingSystem: 'Android',
    applicationCategory: 'SecurityApplication',
    description,
    url: pageUrl,
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
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.minifyn.linkguard',
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
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/75 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Android safety app by MiniFyn
              </div>

              <div className="space-y-5">
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
                  LinkGuard helps people review suspicious URLs from messages, emails, and chats before
                  opening them. It gives users a simple way to pause, inspect, and avoid obvious scam or
                  phishing-style links.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Built By</p>
                  <p className="mt-2 text-base font-semibold text-foreground">MiniFyn</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Platform</p>
                  <div className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-foreground">
                    <Smartphone className="h-4.5 w-4.5 text-primary" />
                    Android
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Focus</p>
                  <p className="mt-2 text-base font-semibold text-foreground">Risky URL checks</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <Link href="/linkguard/legal/privacy">View Privacy Policy</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <Link href="/linkguard/legal/terms">View Terms</Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Use case</p>
                  <p className="mt-2 text-sm text-foreground">Review links before opening them</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Availability</p>
                  <p className="mt-2 text-sm text-foreground">Android now, iOS later</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
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
                        src="/images/linkguard-app-screenshot.jpeg"
                        alt="LinkGuard Android app screenshot showing the URL Scanner screen"
                        width={368}
                        height={798}
                        className="h-auto w-full"
                      />
                    </div>
                  </div>

                </div>

                <div className="mt-4 flex justify-center">
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.minifyn.linkguard"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex transition-transform hover:-translate-y-0.5"
                    aria-label="Get LinkGuard on Google Play"
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why LinkGuard exists</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Most dangerous links do not look dangerous at first glance. LinkGuard is built for the
              moment when a URL feels just suspicious enough that you want a second look before tapping.
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
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border bg-background/80 p-8 shadow-sm">
              <h2 className="text-2xl font-bold sm:text-3xl">When people use it</h2>
              <p className="mt-4 text-muted-foreground">
                LinkGuard is designed for common, real-world situations where an unfamiliar link appears
                unexpectedly and the safest choice is to verify first.
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
              <h2 className="text-2xl font-bold sm:text-3xl">How it fits into trust and review</h2>
              <div className="mt-6 space-y-5 text-muted-foreground">
                <p>LinkGuard has a dedicated public page under the main MiniFyn domain for product context.</p>
                <p>It also links to app-specific privacy and legal information on stable public URLs.</p>
                <p>That makes it easier for users, store reviewers, payment partners, and verification teams to confirm ownership and intent.</p>
                <p>For a focused Android product at this stage, a clean path on the main company site is usually enough.</p>
              </div>
            </div>
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
                  product name, the publisher, the Android listing, and the app’s legal documents.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href="/linkguard/legal/privacy">Privacy Policy</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/linkguard/legal/terms">Terms of Use</Link>
                  </Button>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.minifyn.linkguard"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex transition-transform hover:-translate-y-0.5"
                    aria-label="View LinkGuard on Google Play"
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
                    The app name is LinkGuard.
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
