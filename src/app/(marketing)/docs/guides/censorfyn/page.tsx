import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Film, FileCheck, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CensorFyn User Guide & Documentation | MiniFyn',
  description:
    'Complete guide to on-device offline media redaction, video keyframe tracking, audio stripping, and cryptographic audit manifest verification with CensorFyn.',
  alternates: { canonical: 'https://www.minifyn.com/docs/guides/censorfyn' },
};

export default function CensorFynGuide() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/docs/guides"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All Guides
      </Link>

      <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        CensorFyn User Guide
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        CensorFyn is an offline, privacy-first Android app designed to detect and irreversibly redact sensitive information from photos, documents, and videos with zero cloud dependencies.
      </p>

      <div className="mt-10 space-y-12">
        <section className="rounded-xl border bg-card/60 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              1. Redacting Photos & Screenshots
            </h2>
          </div>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Import Media:</strong> Select an image from your gallery or share it directly to CensorFyn from another app.
            </li>
            <li>
              <strong className="text-foreground">Review Automatic Detections:</strong> CensorFyn’s on-device BlazeFace and Vision OCR models highlight faces, credit cards, passport numbers, emails, and phone numbers.
            </li>
            <li>
              <strong className="text-foreground">Customize Redaction Style:</strong> Choose Gaussian Blur, Mosaic Pixelate, or Solid Blackout. Use freehand drawing or lasso tools to redact custom un-detected regions.
            </li>
            <li>
              <strong className="text-foreground">Export:</strong> Tap Export to apply true mathematical pixel destruction. EXIF, camera serials, and GPS coordinates are automatically purged.
            </li>
          </ol>
        </section>

        <section className="rounded-xl border bg-card/60 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-500">
              <Film className="h-6 w-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              2. Video Redaction & Audio Muting
            </h2>
          </div>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Select Video:</strong> Load a video to launch the hardware-accelerated preview session.
            </li>
            <li>
              <strong className="text-foreground">Track Moving Objects:</strong> Scrub the timeline to keyframe positions. Add masks over moving faces or objects; CensorFyn smoothly interpolates mask geometry across intermediate frames.
            </li>
            <li>
              <strong className="text-foreground">Trim Mask Duration:</strong> Tap any mask to adjust its active time range or enable full-video tracking.
            </li>
            <li>
              <strong className="text-foreground">Mute / Strip Audio:</strong> In the export options sheet, enable &quot;Mute / Strip Audio&quot; to permanently remove audio tracks without re-encoding delays.
            </li>
          </ol>
        </section>

        <section className="rounded-xl border bg-card/60 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
              <FileCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              3. Legal Audit Manifests & Verification
            </h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            For legal compliance and chain-of-custody verification, CensorFyn offers an optional Audit Export Mode:
          </p>
          <ol className="mt-3 list-decimal space-y-3 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Generate Companion Manifest:</strong> In export options, choose &quot;Audit Compliant Mode&quot;. CensorFyn saves a companion <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">.json</code> file embedding the SHA-256 hash, UTC timestamp, and redaction parameters.
            </li>
            <li>
              <strong className="text-foreground">Verify Authenticity:</strong> Open <strong className="text-foreground">More Tools &gt; Audit Manifest Verifier</strong> inside CensorFyn. Pick the exported media and companion JSON file to verify cryptographic integrity.
            </li>
            <li>
              <strong className="text-foreground">Terminal Verification:</strong> Alternatively, run <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">sha256sum &lt;exported_file&gt;</code> and compare the digest with the hash in the JSON file.
            </li>
          </ol>
        </section>

        <section className="rounded-xl border bg-card/60 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              4. 100% On-Device Privacy Guarantee
            </h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            CensorFyn has zero runtime server dependencies. Photos and videos never leave your phone, and no telemetry or biometric data is ever collected or transmitted.
          </p>
        </section>
      </div>

      <div className="mt-12 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Need support or have feedback? Reach out to{' '}
          <a href="mailto:support@minifyn.com" className="font-semibold text-amber-500 underline">
            support@minifyn.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
