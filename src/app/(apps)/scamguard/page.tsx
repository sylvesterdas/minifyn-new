import type { Metadata } from 'next';
import Link from 'next/link';
import { TrackedPlayCta } from '@/components/scamguard/TrackedPlayCta';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  AlertTriangle,
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
const title = 'ScamGuard: Check Suspicious Links Before You Open | MiniFyn';
const description =
  'Check suspicious SMS, QR codes, and unfamiliar links before you open them with ScamGuard: Link Checker for Android.';
const socialImageBase = `${siteUrl}/images/scamguard-social`;
const ogImageUrl = `${socialImageBase}/scamguard-og-1200x630.png`;
const twitterImageUrl = `${socialImageBase}/scamguard-twitter-1600x900.png`;
const squareImageUrl = `${socialImageBase}/scamguard-square-1200x1200.png`;
const fourThreeImageUrl = `${socialImageBase}/scamguard-social-1200x900.png`;
const socialImageAlt = 'ScamGuard Link Checker showing a suspicious link check before opening';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${siteUrl}${pageUrl}`,
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Apps',
        item: `${siteUrl}/#apps`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'ScamGuard: Link Checker',
        item: `${siteUrl}${pageUrl}`,
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="relative overflow-hidden py-8 sm:py-12 lg:py-20">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(118deg,hsl(205_64%_7%)_0%,hsl(202_62%_11%)_56%,hsl(194_60%_9%)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_26%,hsl(0_72%_51%/0.13),transparent_28%),radial-gradient(circle_at_78%_45%,hsl(var(--primary)/0.2),transparent_30%)]" />

        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
            <div className="text-center">
              <div className="mx-auto mb-6 max-w-sm rounded-2xl rounded-bl-md border border-red-400/35 bg-red-950/45 p-4 text-left shadow-xl lg:hidden">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold tracking-wide text-red-200">
                  <span>DELIVERY FAILED</span>
                  <span className="font-normal text-red-300/80">Now</span>
                </div>
                <p className="mt-2 text-sm leading-5 text-red-50">
                  Your package is on hold. Pay a small fee now to reschedule.
                </p>
                <p className="mt-2 text-xs text-red-300">delivery-check.example/4xQ</p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/75 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Android link review app by MiniFyn
              </div>

              <p className="mt-6 text-base font-semibold text-primary sm:text-lg">ScamGuard: Link Checker</p>
              <h1 className="mx-auto mt-2 max-w-3xl text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                One convincing link could be all it takes.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8">
                Check suspicious messages, QR codes, and unfamiliar links before you open them.
              </p>

              <div className="mt-6 flex flex-col items-center gap-2">
                <TrackedPlayCta placement="hero" />
                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">PAUSE. CHECK. DECIDE.</p>
              </div>

              <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-primary/25 bg-background/70 p-4 text-left shadow-xl backdrop-blur lg:hidden">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">ScamGuard check</p>
                  <p className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Elevated signals
                  </p>
                </div>
                <p className="mt-3 text-lg font-semibold text-foreground">Review before opening</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Brand mismatch and an unfamiliar destination were detected.
                </p>
              </div>
            </div>

            <div className="relative hidden min-h-[560px] items-center justify-center lg:flex">
              <div className="absolute left-0 top-12 z-0 w-64 -rotate-3 rounded-2xl rounded-bl-md border border-red-400/35 bg-red-950/55 p-4 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold tracking-wide text-red-200">
                  <span>DELIVERY FAILED</span>
                  <span className="font-normal text-red-300/80">Now</span>
                </div>
                <p className="mt-2 text-sm leading-5 text-red-50">
                  Your package is on hold. Pay a small fee now to reschedule.
                </p>
                <p className="mt-2 text-xs text-red-300">delivery-check.example/4xQ</p>
              </div>

              <div className="absolute left-6 right-0 top-1/2 z-20 h-px -rotate-6 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_18px_hsl(var(--primary))]" />
              <div className="absolute right-0 top-28 z-30 flex h-16 w-16 items-center justify-center rounded-[1.25rem_1.25rem_1.75rem_1.75rem] border border-cyan-200/60 bg-cyan-900/80 text-cyan-100 shadow-[0_0_35px_hsl(var(--primary)/0.35)]">
                <ShieldCheck className="h-8 w-8" />
              </div>

              <div className="relative z-10 ml-16 w-full max-w-[300px]">
                <div className="absolute inset-x-6 bottom-5 top-8 -z-10 rounded-[3rem] bg-primary/20 blur-3xl" />
                <div className="rounded-[2.5rem] border border-zinc-700 bg-zinc-950 p-2.5 shadow-2xl">
                  <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-zinc-700" />
                  <div className="min-h-[440px] rounded-[2rem] border border-sky-950/80 bg-[linear-gradient(180deg,#092536,#061923)] px-5 py-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">ScamGuard check</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Check a link</h2>
                    <p className="mt-2 text-sm leading-5 text-slate-300">Review it before you hand it to your browser.</p>
                    <div className="mt-6 rounded-xl border border-sky-800/80 bg-slate-950/60 px-3 py-3 text-xs text-slate-200">
                      delivery-check.example/4xQ
                    </div>
                    <div className="mt-3 rounded-xl bg-sky-300 px-3 py-3 text-center text-sm font-semibold text-sky-950">
                      Check link
                    </div>
                    <div className="mt-6 rounded-2xl border border-amber-300/35 bg-amber-950/25 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                        <AlertTriangle className="h-4 w-4" />
                        Elevated risk signals
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-200">
                        The destination does not match the delivery message and is unfamiliar to this check.
                      </p>
                    </div>
                    <p className="mt-6 text-center text-xs font-medium tracking-[0.16em] text-sky-200">PAUSE. CHECK. DECIDE.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-card/35">
        <div className="container mx-auto grid max-w-5xl gap-px px-4 py-5 text-center sm:grid-cols-3 md:px-6">
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Check only when you choose</p>
            <p className="mt-1 text-xs text-muted-foreground">Built around user-initiated link review.</p>
          </div>
          <div className="border-white/10 px-4 py-3 sm:border-x">
            <p className="text-sm font-semibold text-foreground">Optional local history</p>
            <p className="mt-1 text-xs text-muted-foreground">Keep or disable on-device history.</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Available for Android</p>
            <p className="mt-1 text-xs text-muted-foreground">Install from Google Play.</p>
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get a clearer answer before you open a link</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              ScamGuard combines local checks, cloud reputation, signed risk policy, and AI-assisted review so you
              can understand the warning signs without needing a security background.
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
              <h2 className="text-2xl font-bold sm:text-3xl">Use it when a link feels off</h2>
              <p className="mt-4 text-muted-foreground">
                These are the everyday moments when pausing to check can help you make a more informed decision
                before opening an unfamiliar destination.
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
              <h2 className="text-2xl font-bold sm:text-3xl">Stay in control of your checks</h2>
              <div className="mt-6 space-y-5 text-muted-foreground">
                <p>Keep history optional and stored on your device when enabled.</p>
                <p>Turn daily caution reminders and app announcements off whenever you choose.</p>
                <p>Manage trusted quick-check domains and preferred browser handoff settings from the app.</p>
                <p>Use diagnostics to see app version, active plan, and AI analysis version when you need support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose how much context you want before deciding</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start with everyday checks, then add deeper reputation or AI-assisted context when you review links
              more often or need more detail.
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
                <h2 className="text-3xl font-bold tracking-tight">Trust, privacy, and support</h2>
                <p className="mt-4 text-muted-foreground">
                  Find the information you need to understand the app, review its policies, and get support before
                  you install or use ScamGuard.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href="/scamguard/legal/privacy">Privacy Policy</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/scamguard/legal/terms">Terms of Use</Link>
                  </Button>
                  <TrackedPlayCta placement="footer" />
                </div>
              </div>

              <div className="rounded-3xl border bg-card/60 p-6">
                <h3 className="text-xl font-semibold">Before you install</h3>
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
                    Checks are designed to start when you choose to review a link.
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
