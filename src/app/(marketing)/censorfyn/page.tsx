import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, EyeOff, Lock, ShieldCheck, Smartphone, Sparkles, FileText, ScanFace } from "lucide-react";

const siteUrl = "https://www.minifyn.com";
const pageUrl = "/censorfyn";
const visualBase = "/images/censorfyn";
const title = "CensorFyn: Offline Media Redaction & Privacy App | MiniFyn";
const description =
  "CensorFyn is a 100% offline, privacy-first Android app by MiniFyn that automatically detects and redacts faces, passports, credit cards, PII text, and QR codes from your photos and media with pixel destruction.";

const screenshots = [
  {
    src: `${visualBase}/home.png`,
    alt: "CensorFyn home screen showing image privacy scanner",
    caption: "Scan any image locally for sensitive PII, faces, and document data.",
  },
  {
    src: `${visualBase}/editor.png`,
    alt: "CensorFyn editor with AI auto-detected redaction boxes",
    caption: "Select detected faces or sensitive text blocks to blur or cover.",
  },
  {
    src: `${visualBase}/export.png`,
    alt: "CensorFyn export screen with Social and Audit modes",
    caption: "Export sanitized media with true pixel destruction and EXIF metadata stripping.",
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
        url: `${siteUrl}${visualBase}/editor.png`,
        alt: "CensorFyn Android offline privacy redaction app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}${visualBase}/editor.png`],
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
    image: screenshots.map(({ src }) => `${siteUrl}${src}`),
    publisher: { "@type": "Organization", name: "MiniFyn", url: siteUrl },
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    featureList: [
      "100% On-device offline processing",
      "Auto-detect faces, passports, driver's licenses, and credit cards",
      "Regex PII scanner for phone numbers, emails, addresses, and SSNs",
      "Irreversible pixel destruction redaction (Blur, Pixelate, Solid Color)",
      "Automatic EXIF & GPS metadata stripping",
      "Optional Audit Mode for legal chain of custody SHA-256 manifest",
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />

      {/* Hero Section */}
      <section className="container mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-28">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">A MiniFyn Android App</p>
          <div className="flex items-center gap-4">
            <img
              src={`${visualBase}/logo.png`}
              alt="CensorFyn logo"
              width={80}
              height={80}
              className="h-16 w-16 rounded-2xl object-cover shadow-lg md:h-20 md:w-20"
            />
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">CensorFyn</h1>
          </div>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Redact sensitive data, faces, passports, and PII text from your photos 100% offline. Zero server uploads, total privacy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <Smartphone className="h-4 w-4 text-primary" /> Android
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> 100% Offline AI
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <Lock className="h-4 w-4 text-primary" /> Irreversible Pixel Destruction
            </span>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary">
              Coming Soon to Google Play
            </span>
          </div>
        </div>

        {/* Feature Visual Mock */}
        <div className="mx-auto w-full max-w-sm rounded-[2rem] border bg-card p-6 shadow-2xl shadow-primary/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-sm">Local Scanner Active</span>
              </div>
              <span className="text-xs text-muted-foreground">0 B Sent</span>
            </div>
            
            <div className="rounded-xl border border-dashed border-primary/40 bg-muted/30 p-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ScanFace className="h-6 w-6" />
              </div>
              <p className="mt-2 text-xs font-medium">3 Sensitive Items Detected</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">Passport Box</span>
                <span className="rounded-md bg-rose-500/10 px-2 py-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">Face (2)</span>
                <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">Credit Card</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg bg-background p-2.5 border">
                <span>Redaction Style</span>
                <span className="font-medium text-foreground">Pixelate / Blur</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background p-2.5 border">
                <span>EXIF Metadata</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Stripped (GPS Cleaned)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/40 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for Maximum Privacy & Security</h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Never worry about accidentally exposing passports, ID cards, or background faces again.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ScanFace className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Dual AI Detection</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Combines Google ML Kit with local ONNX models to detect faces, text, physical IDs, passports, and QR codes instantly.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">True Pixel Destruction</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Redactions irreversibly overwrite raw image pixel bytes. No vector layers, no ways to un-redact or inspect underneath.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Legal & Audit Mode</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Optional export mode that attaches a tamper-evident SHA-256 hash manifest and redaction timestamp for compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
