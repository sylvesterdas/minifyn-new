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
  Hash,
  Download,
  ArrowRight,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const siteUrl = "https://www.minifyn.com";
const pageUrl = "/censorfyn";
const visualBase = "/images/censorfyn";
const title = "CensorFyn: 100% Offline Media Redaction & Privacy App | MiniFyn";
const description =
  "CensorFyn is an offline, privacy-first Android app by MiniFyn that automatically detects and irreversibly redacts faces, passports, credit cards, PII text, and QR codes with true pixel destruction.";

const playStoreUrl = "https://play.google.com/store/apps/details?id=com.minifyn.censorfyn";
const closedTestUrl = "https://play.google.com/apps/testing/com.minifyn.censorfyn";

const screenshots = [
  {
    src: `${visualBase}/screenshot_1_welcome.png`,
    title: "1. Instant Local Import",
    description: "Select from gallery or share directly into CensorFyn. Processing starts 100% offline.",
  },
  {
    src: `${visualBase}/screenshot_2_editor.png`,
    title: "2. Dual AI Detection",
    description: "Detects faces, passports, IDs, credit cards, phone numbers, and QR codes instantly.",
  },
  {
    src: `${visualBase}/screenshot_3_toolbar.png`,
    title: "3. Precision Masking",
    description: "Switch between Blur, Mosaic Pixelate, and Solid Color blocks or draw manual masks.",
  },
  {
    src: `${visualBase}/screenshot_4_export_options.png`,
    title: "4. Metadata Sanitization",
    description: "Strip EXIF and GPS tracking data, with optional legal SHA-256 audit manifest export.",
  },
  {
    src: `${visualBase}/screenshot_5_export_success.png`,
    title: "5. Safe to Share",
    description: "Irreversibly destructs raw image pixels so redactions can never be unmasked.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
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
    featureList: [
      "100% On-device offline processing",
      "Auto-detect faces, passports, driver's licenses, and credit cards",
      "Regex PII scanner for phone numbers, emails, addresses, and national IDs",
      "Irreversible pixel destruction redaction (Blur, Pixelate, Solid Color)",
      "Automatic EXIF & GPS metadata stripping",
      "Optional Audit Mode for legal chain of custody SHA-256 manifest",
    ],
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-card/50 to-background py-16 md:py-28">
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

            {/* Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card/80 px-3 py-1.5 shadow-sm">
                <Smartphone className="h-3.5 w-3.5 text-primary" /> Android App
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card/80 px-3 py-1.5 shadow-sm">
                <Lock className="h-3.5 w-3.5 text-emerald-500" /> Zero Cloud Uploads
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card/80 px-3 py-1.5 shadow-sm">
                <EyeOff className="h-3.5 w-3.5 text-blue-500" /> True Pixel Destruction
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button asChild size="lg" className="gap-2 font-semibold shadow-md">
                <a href={closedTestUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-5 w-5" />
                  <span>Join Closed Testing</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <span>View on Google Play</span>
                </a>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Currently in active Google Play closed testing. Requires Android 5.0+ (API 21+).
            </p>
          </div>

          {/* Right Mockup */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[290px] overflow-hidden rounded-[2.5rem] border-[6px] border-border/80 bg-black p-1 shadow-2xl shadow-primary/15">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-28 bg-black rounded-b-xl z-20" />
              <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2rem] bg-card">
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

      {/* Screenshot Showcase Section */}
      <section id="screenshots" className="border-b bg-card/30 py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              App Walkthrough
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              How CensorFyn Protects Your Data
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A frictionless 5-step flow from photo import to sanitized, metadata-clean export.
            </p>
          </div>

          {/* Screenshot Cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {screenshots.map((s, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-background transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="relative aspect-[9/18] w-full overflow-hidden bg-muted/40">
                  <Image
                    src={s.src}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 20vw"
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

      {/* Core Features Grid */}
      <section id="features" className="border-b py-20 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for True Data Destruction
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Unlike ordinary photo editors that apply cosmetic vector overlays, CensorFyn physically rewrites the image raster bytes.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ScanFace className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Dual AI &amp; Regex Engine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Combines Google ML Kit BlazeFace &amp; Vision OCR with local regex classifiers to automatically flag faces, credit card numbers, passports, driver&apos;s licenses, phone numbers, and QR codes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Irreversible Pixel Destruction</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Underlying pixel bytes are permanently overwritten using Gaussian Blur, Mosaic Pixelate, or Solid Color blocks. No vector layers exist that can be unmasked or recovered.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">EXIF &amp; GPS Sanitization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prevents accidental location tracking by stripping camera model info, GPS coordinates, capture timestamps, and hardware serials from all exported media.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Legal &amp; Audit Mode</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Export sanitized evidence with an optional tamper-evident SHA-256 cryptographic hash manifest and timestamp, perfect for legal discovery and chain of custody.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">System Share-Sheet Integration</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Directly share photos from your Android Gallery, Google Photos, WhatsApp, or Telegram into CensorFyn for instant redaction without manual file picking.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Zero Account / Zero Cloud</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No login, no registration, no tracking IDs. The app runs completely offline and requires zero network access for core image redactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Offline Architecture */}
      <section id="security" className="border-b bg-card/40 py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border bg-background p-8 md:p-12 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
              <h2 className="text-2xl sm:text-3xl font-bold">100% On-Device Privacy Architecture</h2>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              When handling sensitive photos like passports, tax filings, medical records, or family pictures, sending images to cloud servers creates unnecessary risk.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong className="text-foreground block mb-0.5">Isolated Background Isolates</strong>
                  <span className="text-muted-foreground">All heavy OCR and pixel modifications run in local Dart isolates.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong className="text-foreground block mb-0.5">Zero Image Uploads</strong>
                  <span className="text-muted-foreground">No telemetry or image data is ever transmitted over network sockets.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong className="text-foreground block mb-0.5">Strict Metadata Scrubbing</strong>
                  <span className="text-muted-foreground">Cleans GPS latitude/longitude, altitude, camera serials, and timestamps.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong className="text-foreground block mb-0.5">Temporary Sandbox Cleaning</strong>
                  <span className="text-muted-foreground">Working frame buffers are cleared immediately upon export or app exit.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
              <span>Read our complete transparency commitment:</span>
              <div className="flex items-center gap-4">
                <Link href="/censorfyn/legal/privacy" className="font-semibold text-primary hover:underline">
                  Privacy Policy →
                </Link>
                <Link href="/censorfyn/legal/terms" className="font-semibold text-primary hover:underline">
                  Terms of Use →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Download Section */}
      <section className="py-20 bg-gradient-to-t from-card/60 to-background">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Protect Your Visual Privacy?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Join the CensorFyn closed testing track on Google Play today. Redact sensitive data safely before sharing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="gap-2 font-semibold shadow-lg">
              <a href={closedTestUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-5 w-5" />
                <span>Join Closed Testing</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
                <Smartphone className="h-5 w-5" />
                <span>Google Play Listing</span>
              </a>
            </Button>
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
