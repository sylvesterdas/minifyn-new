import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Clapperboard,
  ShieldCheck,
  Smartphone,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  Settings,
  HelpCircle,
  Crop,
  Video,
  Eye,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrackedPlayCta } from "@/components/clipfyn/TrackedPlayCta";

const siteUrl = "https://www.minifyn.com";
const pageUrl = "/clipfyn";
const visualBase = "/images/clipfyn";
const playStoreUrl = "https://play.google.com/store/apps/details?id=com.minifyn.clipfyn";
const title = "ClipFyn: Android Video Preparation for Sharing | MiniFyn";
const description =
  "ClipFyn is an Android video preparation app that inspects and prepares videos locally for broadly compatible sharing, with crop, fit, preview, save, and share controls.";

const screenshots = [
  {
    src: `${visualBase}/screenshot_1_welcome.jpg`,
    title: "1. Instant Import & Diagnostics",
    description: "Inspect resolution, rotation, frame cadence, and hardware encoder capabilities.",
  },
  {
    src: `${visualBase}/screenshot_2_aspect_modes.jpg`,
    title: "2. Smart 9:16 Aspect Modes",
    description: "Choose Fill & Crop, Blurred Letterbox, or Original Aspect Ratio preservation.",
  },
  {
    src: `${visualBase}/screenshot_3_comparison_preview.jpg`,
    title: "3. Side-by-Side Clarity Preview",
    description: "Split-screen comparison slider to inspect video framing and clarity before saving.",
  },
  {
    src: `${visualBase}/screenshot_4_export_standards.jpg`,
    title: "4. Standardized Output Checks",
    description: "Verify 1080p, 30 FPS CFR, BT.709 SDR, and share directly via Android share sheet.",
  },
  {
    src: `${visualBase}/screenshot_5_hardware_profile.jpg`,
    title: "5. Hardware Profile & Engine",
    description: "Dedicated SoC hardware encoder details and background performance controls.",
  },
  {
    src: `${visualBase}/screenshot_6_minifyn_suite.jpg`,
    title: "6. MiniFyn Suite Integration",
    description: "Seamlessly access companion offline utilities including ScamGuard and CensorFyn.",
  },
];

const whyCards = [
  {
    title: "No Surprise Platform Crops",
    description: "Social media and messaging platforms often force-crop horizontal videos unpredictably. ClipFyn gives you full preview control beforehand.",
    icon: Crop,
  },
  {
    title: "100% On-Device Processing",
    description: "Video transcoding, cropping, and blurred-background fits are rendered directly on your phone hardware. Zero video uploads to external servers.",
    icon: ShieldCheck,
  },
  {
    title: "Smart Hardware Acceleration",
    description: "Leverages Android's native hardware media codecs (MediaCodec) for ultra-fast exports that save battery and preserve source clarity.",
    icon: Video,
  },
  {
    title: "Side-by-Side Comparison",
    description: "Inspect original vs rendered framing side-by-side to guarantee your focal points remain sharp and properly centered.",
    icon: Eye,
  },
];

const useCases = [
  "Preparing landscape videos for TikTok, Instagram Reels, and YouTube Shorts",
  "Fitting widescreen clips with aesthetic blurred-background sidebars",
  "Checking video resolution and codecs before sending over messaging apps",
  "Pre-cropping home videos without lossy multi-pass cloud re-encoding",
  "Sharing directly via the Android system share sheet",
];

const trustPoints = [
  "Package: com.minifyn.clipfyn",
  "100% On-Device / Zero Video Uploads",
  "Android MediaCodec Hardware Accelerated",
  "Vertical Crop & Blurred Fit Options",
  "Publisher: MiniFyn (UDYAM-KL-12-0136086)",
];

const faqs = [
  {
    question: "Does ClipFyn upload my videos to any server?",
    answer: "No. ClipFyn processes all video files 100% locally on your Android device using the system's hardware media engine. Your personal video files are never uploaded to MiniFyn servers.",
  },
  {
    question: "What formatting modes does ClipFyn support?",
    answer: "ClipFyn offers 3 primary preparation layouts: (1) 9:16 Vertical Center/Pan Crop for full-screen short-form platforms, (2) Fit with Blurred Background sidebars (maintains entire source frame without cropping content), and (3) Original Aspect Ratio preservation.",
  },
  {
    question: "Does ClipFyn guarantee passthrough quality on third-party platforms?",
    answer: "ClipFyn prepares broadly compatible video files with standardized aspect ratios and container formats. However, external platforms (like Instagram, TikTok, or YouTube) always apply their own compression algorithms upon upload.",
  },
  {
    question: "Is ClipFyn free to use?",
    answer: "Yes, ClipFyn is free to use. An optional one-time Google Play in-app purchase is available to remove banner ads.",
  },
  {
    question: "How do I report bugs or suggest new features?",
    answer: "You can submit private feedback directly on Google Play or email the developer at sylvesterdas.dev@gmail.com.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}${pageUrl}` },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${pageUrl}`,
    siteName: "MiniFyn",
    type: "website",
    images: [
      {
        url: `${siteUrl}${visualBase}/crop-comparison.png`,
        alt: "ClipFyn Android video preparation app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}${visualBase}/crop-comparison.png`],
  },
};

export default function ClipFynPage() {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "ClipFyn",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Android",
    description,
    url: `${siteUrl}${pageUrl}`,
    image: screenshots.map(({ src }) => `${siteUrl}${src}`),
    publisher: {
      "@type": "Organization",
      name: "MiniFyn",
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    downloadUrl: playStoreUrl,
    featureList: [
      "On-device Android video preparation",
      "Source inspection and output checks",
      "Vertical crop, blurred-background fit, and original aspect-ratio options",
      "Before-and-after frame comparison",
      "Save and Android share-sheet controls",
    ],
    sameAs: playStoreUrl,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Apps",
        item: `${siteUrl}/#apps`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "ClipFyn",
        item: `${siteUrl}${pageUrl}`,
      },
    ],
  };

  return (
    <div className="flex flex-col">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-card/50 to-background py-16 md:py-24">
        <div className="container mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-12 md:items-center">
          
          {/* Left Text */}
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Clapperboard className="h-4 w-4" /> Android Video Preparation App
            </div>

            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border bg-card p-1 shadow-lg sm:h-20 sm:w-20">
                <Image
                  src={`${visualBase}/logo.png`}
                  alt="ClipFyn Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                  ClipFyn
                </h1>
                <p className="text-sm font-medium text-muted-foreground">by MiniFyn</p>
              </div>
            </div>

            <p className="text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Prepare videos on Android for broadly compatible sharing, with clear layout controls, frame preview, and no server uploads.
            </p>

            {/* Quick Specs Grid */}
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="rounded-2xl border bg-background/70 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Built By</p>
                <p className="mt-1 text-sm font-semibold text-foreground">MiniFyn</p>
              </div>
              <div className="rounded-2xl border bg-background/70 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Platform</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Smartphone className="h-4 w-4 text-primary" /> Android
                </p>
              </div>
              <div className="rounded-2xl border bg-background/70 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Processing</p>
                <p className="mt-1 text-sm font-semibold text-blue-500">100% On-Device</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <TrackedPlayCta placement="hero" badgeWidth={175} badgeHeight={52} imgClassName="h-12 w-auto" />
              <Button asChild variant="outline" size="lg" className="h-12">
                <Link href="/clipfyn/legal/privacy">Privacy Policy</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {trustPoints.map((point) => (
                <Badge
                  key={point}
                  variant="outline"
                  className="rounded-full border-primary/20 bg-background/60 px-3 py-1 text-xs text-foreground/85"
                >
                  <CheckCircle2 className="mr-1.5 h-3 w-3 text-primary" />
                  {point}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right Mockup */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[290px] overflow-hidden rounded-2xl border-[4px] border-border/80 bg-black p-0.5 shadow-2xl shadow-primary/15">
              <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-xl bg-card">
                <Image
                  src={`${visualBase}/screenshot_1_welcome.jpg`}
                  alt="ClipFyn Home Interface"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why ClipFyn Exists */}
      <section className="border-b bg-card/40 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why ClipFyn Exists</h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Posting horizontal or unconventional videos to modern vertical video apps often results in bad crops or blurred faces. ClipFyn gives you full control before you share.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {whyCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-3xl border bg-background/85 p-6 shadow-sm space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshot Showcase Section */}
      <section className="border-b bg-background py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Inside ClipFyn
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              A Focused Flow from Source to Prepared Video
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Inspect the source, choose a framing layout, compare results, and save or share.
            </p>
          </div>

          {/* Screenshot Cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {screenshots.map((s, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:border-primary/60 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[9/18] w-full overflow-hidden bg-muted/40">
                  <Image
                    src={s.src}
                    alt={s.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-sm text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Use Cases & User Controls */}
      <section className="border-b bg-card/40 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border bg-background p-8 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold sm:text-3xl">When People Use ClipFyn</h2>
              <p className="text-sm text-muted-foreground">
                Designed for everyday situations where you have a video that needs clean vertical reformatting or inspection.
              </p>
              <ul className="mt-6 grid gap-3">
                {useCases.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border bg-card/60 p-3.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border bg-background p-8 shadow-sm space-y-5">
              <h2 className="text-2xl font-bold sm:text-3xl">What You Can Control</h2>
              <p className="text-sm text-muted-foreground">
                Simple, transparent controls over video aspect ratios and export quality.
              </p>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <Crop className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block font-medium">Vertical 9:16 Center Crop:</strong>
                    Fills the full smartphone screen for high-impact social clips.
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block font-medium">Blurred Background Fit:</strong>
                    Preserves the entire original framing with a dynamic blurred background.
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block font-medium">Interactive Frame Compare:</strong>
                    Check source and output side-by-side before rendering.
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <Share2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block font-medium">Direct System Sharing:</strong>
                    Export directly to the Android share sheet or save to your local Gallery.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency, Policies, & Support Box */}
      <section className="border-b py-16 md:py-24 bg-background">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border bg-card/60 p-8 md:p-10 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Policies, Ownership &amp; Support</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This page serves as the verified public home for ClipFyn, connecting the product identity, the publisher, the Google Play listing, and the official legal policies.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button asChild variant="outline">
                    <Link href="/clipfyn/legal/privacy">Privacy Policy</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/clipfyn/legal/terms">Terms of Use</Link>
                  </Button>
                  <TrackedPlayCta placement="card" badgeWidth={135} badgeHeight={42} imgClassName="h-10 w-auto" />
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-6 space-y-3">
                <h3 className="font-semibold text-base text-foreground">Verified Publisher Details</h3>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span><strong>App Name:</strong> ClipFyn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span><strong>Package ID:</strong> com.minifyn.clipfyn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span><strong>Publisher:</strong> Sylvester Kumar Das (UDYAM-KL-12-0136086)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span><strong>Contact Email:</strong> sylvesterdas.dev@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 md:py-24 bg-card/30 border-b">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Helpful context on video preparation, device requirements, and local processing.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border bg-background px-6 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="border-border/60 last:border-b-0"
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
      </section>

      {/* Final Download CTA */}
      <section className="py-20 bg-gradient-to-t from-card/60 to-background">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Prepare Your Videos on Android with ClipFyn
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            ClipFyn is currently undergoing Google Play production-access review. Follow the listing for availability updates.
          </p>

          <div className="flex items-center justify-center pt-2">
            <TrackedPlayCta placement="footer" badgeWidth={180} badgeHeight={54} imgClassName="h-14 w-auto" />
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Questions or suggestions? Contact us directly at{" "}
            <a href="mailto:sylvesterdas.dev@gmail.com" className="underline hover:text-foreground">
              sylvesterdas.dev@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
