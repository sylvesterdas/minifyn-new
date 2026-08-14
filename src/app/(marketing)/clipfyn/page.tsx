import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clapperboard, ShieldCheck, SlidersHorizontal, Smartphone, Sparkles } from "lucide-react";

const siteUrl = "https://www.minifyn.com";
const pageUrl = "/clipfyn";
const visualBase = "/images/clipfyn";
const title = "ClipFyn: Android Video Preparation for Sharing | MiniFyn";
const description =
  "ClipFyn is an Android video preparation app that inspects and prepares videos locally for broadly compatible sharing, with crop, fit, preview, save, and share controls.";

const screenshots = [
  {
    src: `${visualBase}/home.png`,
    alt: "ClipFyn home screen showing device and video preparation status",
    caption: "Start with a clear device and source check.",
  },
  {
    src: `${visualBase}/format-options.png`,
    alt: "ClipFyn format options for vertical video preparation",
    caption: "Choose crop, fit, or original aspect ratio.",
  },
  {
    src: `${visualBase}/crop-comparison.png`,
    alt: "ClipFyn before and after crop comparison",
    caption: "Compare the source and prepared framing before saving.",
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
    publisher: { "@type": "Organization", name: "MiniFyn", url: siteUrl },
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    featureList: [
      "On-device Android video preparation",
      "Source inspection and output checks",
      "Vertical crop, blurred-background fit, and original aspect-ratio options",
      "Before-and-after frame comparison",
      "Save and Android share-sheet controls",
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <section className="container mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-28">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">A MiniFyn Android app</p>
          <div className="flex items-center gap-4">
            <img src={`${visualBase}/logo.png`} alt="ClipFyn logo" width={76} height={76} className="h-16 w-16 object-contain md:h-20 md:w-20" />
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">ClipFyn</h1>
          </div>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Prepare videos on Android for broadly compatible sharing, with clear controls and no MiniFyn video upload.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2"><Smartphone className="h-4 w-4 text-primary" /> Android</span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2"><ShieldCheck className="h-4 w-4 text-primary" /> On-device processing</span>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2"><Clapperboard className="h-4 w-4 text-primary" /> Video preparation</span>
          </div>
          <p className="mt-8 inline-flex rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-sm font-medium text-primary">Coming to Google Play</p>
        </div>
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border bg-card p-3 shadow-2xl shadow-primary/10">
          <img src={screenshots[0].src} alt={screenshots[0].alt} width={1080} height={1920} className="h-auto w-full rounded-[1.35rem]" />
        </div>
      </section>

      <section className="border-y bg-card/40">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Made for a clearer video-preparation workflow</h2>
            <p className="mt-4 text-muted-foreground">Inspect the source, choose a layout, review the result, then save or share when you are ready.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["Inspect before processing", "See useful source details and let ClipFyn decide whether preparation is needed.", Sparkles],
              ["Choose the framing", "Use vertical crop, fit with a blurred background, or retain the original aspect ratio.", SlidersHorizontal],
              ["Review and share", "Compare framing before export, then save the prepared file or use Android's share sheet.", CheckCircle2],
            ].map(([heading, body, Icon]) => {
              const FeatureIcon = Icon as typeof Sparkles;
              return <article key={heading as string} className="rounded-2xl border bg-background p-6"><FeatureIcon className="h-7 w-7 text-primary" /><h3 className="mt-5 text-xl font-semibold">{heading as string}</h3><p className="mt-3 leading-relaxed text-muted-foreground">{body as string}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Inside ClipFyn</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">A focused flow from source to prepared video</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {screenshots.map((screenshot) => <figure key={screenshot.src} className="overflow-hidden rounded-2xl border bg-card p-3"><img src={screenshot.src} alt={screenshot.alt} width={1080} height={1920} loading="lazy" className="w-full rounded-xl" /><figcaption className="px-2 pb-2 pt-4 text-sm text-muted-foreground">{screenshot.caption}</figcaption></figure>)}
        </div>
      </section>

      <section className="border-t bg-card/40">
        <div className="prose prose-invert mx-auto max-w-3xl px-4 py-16 md:py-20">
          <h2>Prepare video files with realistic expectations</h2>
          <p>ClipFyn uses Android&apos;s hardware media system to inspect and prepare video files locally. Your source video is not uploaded to MiniFyn for processing.</p>
          <p>Sharing platforms can still process every uploaded video. ClipFyn does not promise passthrough, prevent recompression, or guarantee a particular platform&apos;s delivered quality. It helps prepare a broadly compatible file and leaves delivery choices to the destination platform.</p>
          <p>ClipFyn is independent from Instagram, Meta, TikTok, YouTube, and their owners. Their names and trademarks belong to their respective owners.</p>
          <p>The app is free and uses restrained banner advertising. An optional Google Play one-time purchase removes ads; Google Play shows the local price before purchase.</p>
          <p><Link href="/clipfyn/legal/privacy">Privacy Policy</Link>{" · "}<Link href="/clipfyn/legal/terms">Terms of Use</Link>{" · "}<Link href="/contact">Contact MiniFyn</Link></p>
        </div>
      </section>
    </main>
  );
}
