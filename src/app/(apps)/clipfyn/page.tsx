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
  Zap,
  AlertOctagon,
  Flame,
  Check,
  X,
  Gauge,
  Film,
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
    title: "Bypass Aggressive Android Compression",
    description: "Social media upload engines crush high-bitrate Android uploads. ClipFyn pre-conditions your footage to exact 1080p CFR BT.709 standards so platforms ingest it cleanly without quality loss.",
    icon: Flame,
  },
  {
    title: "Safe-Zone & Aspect Control",
    description: "Never lose crucial heads, captions, or product details to blind algorithmic crops. Choose Fill & Crop, Blurred Sidebars, or Native framing with live side-by-side preview.",
    icon: Crop,
  },
  {
    title: "100% On-Device Hardware Speed",
    description: "Renders directly on your phone using Android MediaCodec hardware acceleration. Instant exports, zero battery drain, and zero video uploads to external servers.",
    icon: Zap,
  },
  {
    title: "Studio Clarity Without a $1,200 iPhone",
    description: "Your Android camera is already great. ClipFyn fixes the upload pipeline so your Reels and Shorts look as crisp and fluid as top-tier creator content.",
    icon: Film,
  },
];

const useCases = [
  "Pre-conditioning sharp Android camera footage for Instagram Reels, TikTok & Shorts",
  "Fitting widescreen horizontal videos into 9:16 vertical feeds with aesthetic blurred sidebars",
  "Fixing Variable Frame Rate (VFR) jitter into locked 30 FPS Constant Frame Rate (CFR)",
  "Checking focal framing side-by-side before publishing to prevent bad platform crops",
  "Exporting directly via Android system share sheet with zero watermarks or cloud waitlists",
];

const trustPoints = [
  "Package: com.minifyn.clipfyn",
  "1080p 30 FPS CFR Standardized",
  "100% On-Device / Zero Video Uploads",
  "Zero Watermarks / Instant Export",
  "Publisher: MiniFyn (UDYAM-KL-12-0136086)",
];

const faqs = [
  {
    question: "Why do Android videos look worse when uploaded to Instagram/Reels?",
    answer: "Most social apps on Android use generalized cloud compression profiles that aggressively downsample bitrates, drop frames on variable framerate (VFR) videos, and misalign color matrix profiles. ClipFyn pre-renders your video into standardized 1080p 30 FPS CFR with BT.709 color profiles, allowing social platforms to ingest your file cleanly with minimal re-encoding distortion.",
  },
  {
    question: "Do I need an expensive flagship phone to get high quality?",
    answer: "No. The main issue isn't your phone's camera sensor—it's how the social media apps re-encode Android media during upload. ClipFyn standardizes your video locally before upload so you get clean, crisp playback from your current device.",
  },
  {
    question: "Does ClipFyn upload my videos to any server?",
    answer: "No. ClipFyn processes all video files 100% locally on your Android device using the system's hardware media engine (MediaCodec). Your personal video files never leave your device.",
  },
  {
    question: "What formatting modes does ClipFyn support?",
    answer: "ClipFyn offers 3 primary layouts: (1) 9:16 Vertical Center/Pan Crop for full-screen short-form platforms, (2) Fit with Blurred Background sidebars (preserves entire source frame with aesthetic blurred wings), and (3) Original Aspect Ratio preservation.",
  },
  {
    question: "Does ClipFyn add watermarks to my exports?",
    answer: "Never. All exports from ClipFyn are completely watermark-free and render at full native quality.",
  },
  {
    question: "Is ClipFyn free to use?",
    answer: "Yes, ClipFyn is free to use. An optional one-time Google Play in-app purchase is available if you wish to remove banner ads and support independent development.",
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
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-card/30 to-background py-16 md:py-24">
        {/* Subtle Lens Flare and Spotlight Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-10 top-1/3 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-[100px]" />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Headline & Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                <Film className="h-3.5 w-3.5" /> For Android Creators &amp; Influencers
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                  Why do Android Reels look blurry? <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                    It&apos;s not your camera.
                  </span>
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Social apps use aggressive compression engines on Android uploads, destroying bitrates and dropping frames. 
                  ClipFyn pre-conditions your video to exact <strong>1080p CFR BT.709</strong> standards so platforms ingest your footage with studio-grade clarity.
                </p>
              </div>

              {/* Problem/Solution Contrast Callout */}
              <div className="grid gap-3 sm:grid-cols-2 text-left pt-1">
                <div className="rounded-2xl border border-red-500/25 bg-red-950/20 p-3.5 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wide">
                    <X className="h-4 w-4 shrink-0 text-red-400" /> Raw Android Upload
                  </div>
                  <p className="mt-1.5 text-xs text-red-200/80 leading-relaxed">
                    Crushed bitrates, variable framerate stutter, and unpredictable automatic head-cropping.
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/25 p-3.5 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wide">
                    <Check className="h-4 w-4 shrink-0 text-cyan-400" /> Pre-Rendered with ClipFyn
                  </div>
                  <p className="mt-1.5 text-xs text-cyan-100/90 leading-relaxed">
                    Locked 30 FPS CFR, BT.709 color profiles, and safe-zone 9:16 framing with zero quality loss.
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <TrackedPlayCta placement="hero" badgeWidth={180} badgeHeight={54} imgClassName="h-13 w-auto" />
                <Button asChild variant="outline" size="lg" className="h-12 border-border/80 hover:bg-card">
                  <Link href="#breakdown">See How It Works</Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                {trustPoints.map((point) => (
                  <Badge
                    key={point}
                    variant="outline"
                    className="rounded-full border-accent/20 bg-background/70 px-3 py-1 text-xs text-foreground/90 backdrop-blur"
                  >
                    <CheckCircle2 className="mr-1.5 h-3 w-3 text-cyan-400" />
                    {point}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right Visual Comparison Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
                {/* Glow behind device */}
                <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/30 to-accent/30 blur-2xl" />

                {/* Studio Frame container */}
                <div className="overflow-hidden rounded-3xl border border-border/80 bg-zinc-950/90 p-2 shadow-2xl backdrop-blur">
                  {/* Top Bar Header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Gauge className="h-3.5 w-3.5" /> 1080p CFR 30FPS
                    </span>
                    <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary-foreground font-sans">
                      BT.709 SDR
                    </span>
                  </div>

                  {/* Phone Screen Mockup */}
                  <div className="relative aspect-[9/18.5] w-full overflow-hidden rounded-2xl bg-black mt-2">
                    <Image
                      src={`${visualBase}/screenshot_3_comparison_preview.jpg`}
                      alt="ClipFyn Side-by-Side Comparison Preview"
                      fill
                      className="object-cover"
                      priority
                    />

                    {/* Interactive Comparison Floating Tag */}
                    <div className="absolute bottom-3 inset-x-3 rounded-xl bg-zinc-950/85 border border-cyan-400/40 p-2.5 backdrop-blur text-center shadow-lg">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
                        Side-by-Side Split Preview
                      </p>
                      <p className="text-xs text-zinc-200 mt-0.5">
                        Inspect focal clarity before publishing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why ClipFyn Exists */}
      <section id="breakdown" className="border-b bg-card/40 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              The Android Creator&apos;s Equalizer
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Why Your Content Deserves ClipFyn
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              You put hours into filming, lighting, and scripting. Don&apos;t let mobile platform compression engines sabotage your reach and viewer perception.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {whyCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-3xl border bg-background/85 p-6 shadow-sm space-y-3 transition-colors hover:border-cyan-400/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
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
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-6xl mx-auto">
            {screenshots.map((s, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border bg-card transition-all duration-300 hover:border-primary/60 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[9/18] w-full overflow-hidden bg-muted/40">
                  <Image
                    src={s.src}
                    alt={s.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 sm:line-clamp-none">{s.title}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
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
