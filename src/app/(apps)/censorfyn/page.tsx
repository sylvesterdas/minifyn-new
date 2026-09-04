import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  ScanFace,
  FileText,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Share2,
  Fingerprint,
  Layers,
  SlidersHorizontal,
  Settings,
  HelpCircle,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrackedPlayCta } from "@/components/censorfyn/TrackedPlayCta";

const siteUrl = "https://www.minifyn.com";
const pageUrl = "/censorfyn";
const visualBase = "/images/censorfyn";
const playStoreUrl = "https://play.google.com/store/apps/details?id=com.minifyn.censorfyn";
const title = "CensorFyn: 100% Offline Media Redaction & Privacy App | MiniFyn";
const description =
  "CensorFyn is an offline, privacy-first Android app by MiniFyn that automatically detects and irreversibly redacts faces, passports, credit cards, PII text, and QR codes with true pixel destruction.";

const screenshots = [
  {
    src: `${visualBase}/screenshot_1_welcome.png`,
    title: "1. Instant Local Import",
    description: "Select photos or share directly from Gallery. Processing runs 100% offline with zero server uploads.",
  },
  {
    src: `${visualBase}/screenshot_2_editor.png`,
    title: "2. Dual AI Detection",
    description: "Combines BlazeFace & Vision OCR to detect faces, passports, credit cards, phone numbers, and QR codes.",
  },
  {
    src: `${visualBase}/screenshot_3_toolbar.png`,
    title: "3. Precision Masking",
    description: "Switch between Blur, Mosaic Pixelate, and Solid Color masks, or draw manual freehand boxes.",
  },
  {
    src: `${visualBase}/screenshot_4_export_options.png`,
    title: "4. Metadata Sanitization",
    description: "Strip EXIF and GPS tracking data, with optional legal SHA-256 audit manifest export.",
  },
  {
    src: `${visualBase}/screenshot_5_export_success.png`,
    title: "5. Safe to Share",
    description: "Irreversibly destructs raw image pixels so sensitive data can never be unmasked or recovered.",
  },
];

const whyCards = [
  {
    title: "Visual Privacy by Default",
    description: "Sharing photos on social media or messaging apps often leaks sensitive IDs, home addresses, license plates, or background faces without you noticing.",
    icon: EyeOff,
  },
  {
    title: "True Pixel Destruction",
    description: "Unlike basic markup tools that add removable vector layers, CensorFyn irreversibly overwrites the underlying raster pixel bytes before export.",
    icon: Lock,
  },
  {
    title: "100% On-Device AI",
    description: "Face recognition, OCR text scanning, and QR parsing run strictly on your phone's processor using background Dart isolates.",
    icon: ScanFace,
  },
  {
    title: "Legal Chain of Custody",
    description: "Optional Audit Mode generates tamper-evident SHA-256 hashes and timestamp manifests for legal compliance and court discovery.",
    icon: FileText,
  },
];

const useCases = [
  "Selling items online (masking serial numbers, shipping labels & home addresses)",
  "Sharing IDs or documents (hiding government numbers, CVVs & signatures)",
  "Social media photos (blurring background bystanders and children's faces)",
  "Screenshots of chats & apps (masking phone numbers, emails & account balances)",
  "Vehicle photos (redacting license plate numbers)",
  "Legal & compliance media (tamper-evident audit logging for discovery)",
];

const trustPoints = [
  "Package: com.minifyn.censorfyn",
  "100% On-Device / Zero Cloud Uploads",
  "BlazeFace & VisionKit OCR",
  "Automatic GPS / EXIF Scrubbing",
  "Publisher: MiniFyn (UDYAM-KL-12-0136086)",
];

const faqs = [
  {
    question: "Does CensorFyn upload my photos to any server?",
    answer: "No. CensorFyn operates 100% on-device and offline. Your photos, documents, and media never leave your phone. All face detection, OCR text parsing, and pixel-level blurring happen locally on your device's processor.",
  },
  {
    question: "Can someone undo or remove the redaction on exported photos?",
    answer: "No. CensorFyn applies true destructive redaction. When an image is exported, the underlying raw pixel bytes are permanently overwritten with Gaussian blur, mosaic pixels, or solid black/white color. There are no vector layers, hidden masks, or alpha channels to inspect underneath.",
  },
  {
    question: "What sensitive information does CensorFyn automatically detect?",
    answer: "CensorFyn uses on-device Google ML Kit (BlazeFace and Vision OCR) combined with local regex parsers to detect: human faces, passport numbers, credit/debit card numbers, driver's licenses, national ID formats, phone numbers, email addresses, vehicle plates, and QR/barcodes.",
  },
  {
    question: "What is Audit Mode?",
    answer: "Audit Mode is an optional export feature designed for legal, compliance, and investigative workflows. When enabled, CensorFyn exports the sanitized media alongside a companion SHA-256 cryptographic hash manifest and timestamp, allowing parties to verify data integrity without revealing the redacted content.",
  },
  {
    question: "Does CensorFyn remove EXIF and GPS location metadata?",
    answer: "Yes. By default, CensorFyn strips all camera metadata, device serials, capture timestamps, and precise GPS location coordinates from exported images to prevent secondary location tracking.",
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
        url: `${siteUrl}${visualBase}/feature_graphic_1024x500.png`,
        width: 1024,
        height: 500,
        alt: "CensorFyn Android offline privacy redaction app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}${visualBase}/feature_graphic_1024x500.png`],
  },
};

export default function CensorFynPage() {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "CensorFyn",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Android",
    description,
    url: `${siteUrl}${pageUrl}`,
    image: `${siteUrl}${visualBase}/feature_graphic_1024x500.png`,
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
      "100% On-device offline processing",
      "Auto-detect faces, passports, driver's licenses, and credit cards",
      "Regex PII scanner for phone numbers, emails, addresses, and national IDs",
      "Irreversible pixel destruction redaction (Blur, Pixelate, Solid Color)",
      "Automatic EXIF & GPS metadata stripping",
      "Optional Audit Mode for legal chain of custody SHA-256 manifest",
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
        name: "CensorFyn",
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
              <ShieldCheck className="h-4 w-4" /> 100% Offline Android Privacy
            </div>

            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border bg-card shadow-lg sm:h-20 sm:w-20">
                <Image
                  src={`${visualBase}/logo.png`}
                  alt="CensorFyn Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                  CensorFyn
                </h1>
                <p className="text-sm font-medium text-muted-foreground">by MiniFyn</p>
              </div>
            </div>

            <p className="text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Irreversible media redaction on Android. Automatically detect and permanently destroy sensitive faces, passports, credit card numbers, and PII text.
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
                  <Smartphone className="h-4 w-4 text-primary" /> Android 5.0+
                </p>
              </div>
              <div className="rounded-2xl border bg-background/70 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Privacy</p>
                <p className="mt-1 text-sm font-semibold text-emerald-500">100% On-Device</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <TrackedPlayCta placement="hero" badgeWidth={175} badgeHeight={52} imgClassName="h-12 w-auto" />
              <Button asChild variant="outline" size="lg" className="h-12">
                <Link href="/censorfyn/legal/privacy">Privacy Policy</Link>
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
          <div className="md:col-span-5 flex justify-center pt-4 md:pt-0">
            <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] overflow-hidden rounded-2xl border-[3px] sm:border-[4px] border-border/80 bg-black p-0.5 shadow-2xl shadow-primary/15">
              <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-xl bg-card">
                <Image
                  src={`${visualBase}/screenshot_2_editor.png`}
                  alt="CensorFyn Editor Interface"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why CensorFyn Exists */}
      <section className="border-b bg-card/40 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why CensorFyn Exists</h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Most photo editing apps either upload your images to cloud servers or simply overlay colored boxes that can easily be stripped away. CensorFyn was built to solve both problems completely.
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
      <section id="screenshots" className="border-b bg-background py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              App Walkthrough
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              A Smooth 5-Step Sanitization Flow
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              From photo import to sanitized, metadata-clean export with zero hassle.
            </p>
          </div>

          {/* Screenshot Cards */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
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
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
              <h2 className="text-2xl font-bold sm:text-3xl">When People Use CensorFyn</h2>
              <p className="text-sm text-muted-foreground">
                Built for everyday scenarios where you need to share a photo or document without exposing identity or sensitive numbers.
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
              <h2 className="text-2xl font-bold sm:text-3xl">What You Can Customize</h2>
              <p className="text-sm text-muted-foreground">
                Take full control over how your media is processed and exported.
              </p>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <SlidersHorizontal className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block font-medium">3 Redaction Styles:</strong>
                    Choose between Gaussian Blur (soft natural aesthetic), Mosaic Pixelate (classic privacy), or Solid Color blocks.
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block font-medium">Manual Gestures &amp; Box Tools:</strong>
                    Draw custom freehand masks or drag rectangular boxes for any background details AI missed.
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <Fingerprint className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block font-medium">Automatic EXIF Stripping:</strong>
                    Removes GPS coordinates, camera model, and timestamps automatically before saving.
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block font-medium">Optional Legal Audit Mode:</strong>
                    Embeds a tamper-evident SHA-256 hash manifest for legal proof and compliance.
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
                  This page serves as the verified public home for CensorFyn, connecting the product identity, the publisher, the Google Play listing, and the official legal policies.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button asChild variant="outline">
                    <Link href="/docs/guides/censorfyn">User Guide</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/censorfyn/legal/privacy">Privacy Policy</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/censorfyn/legal/terms">Terms of Use</Link>
                  </Button>
                  <TrackedPlayCta placement="card" badgeWidth={135} badgeHeight={42} imgClassName="h-10 w-auto" />
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-6 space-y-3">
                <h3 className="font-semibold text-base text-foreground">Verified Publisher Details</h3>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span><strong>App Name:</strong> CensorFyn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span><strong>Package ID:</strong> com.minifyn.censorfyn</span>
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
              Clear answers regarding privacy, data destruction, and device compatibility.
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
            Ready to Protect Your Visual Privacy?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Download CensorFyn for Android and redact sensitive data safely before sharing.
          </p>

          <div className="flex items-center justify-center pt-2">
            <TrackedPlayCta placement="footer" badgeWidth={180} badgeHeight={54} imgClassName="h-14 w-auto" />
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Questions or bug reports? Contact us directly at{" "}
            <a href="mailto:sylvesterdas.dev@gmail.com" className="underline hover:text-foreground">
              sylvesterdas.dev@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
