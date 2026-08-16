import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ClipFyn Terms of Use | MiniFyn",
  description: "Terms governing use of the ClipFyn Android app.",
  alternates: { canonical: "https://www.minifyn.com/clipfyn/legal/terms" },
};

export default function ClipFynTermsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
      <article className="prose prose-invert mx-auto">
        <h1>ClipFyn Terms of Use</h1>
        <p className="text-muted-foreground">Last updated: August 12, 2026</p>
        <p>ClipFyn is a MiniFyn product operated by Sylvester Kumar Das (UDYAM-KL-12-0136086). By using the app, you agree to these terms.</p>

        <h2>Purpose and permitted use</h2>
        <p>
          ClipFyn prepares user-selected videos for broadly compatible sharing. You must own the content or have
          permission to process and share it, and you must comply with applicable law and the destination service's terms.
        </p>

        <h2>No platform affiliation or delivery guarantee</h2>
        <p>
          ClipFyn is not sponsored, endorsed, or operated by Instagram, Meta, TikTok, YouTube, or their owners.
          Destination services control their own upload processing. ClipFyn does not guarantee passthrough, no
          recompression, higher quality, acceptance, reach, engagement, or a specific delivered rendition.
        </p>

        <h2>Advertising and remove-ads purchase</h2>
        <ul>
          <li>The free app may display Google-served ads.</li>
          <li>Ad availability and treatment depend on consent, region, age signals, and Google policies.</li>
          <li>The remove-ads product is a one-time, non-consumable purchase managed by Google Play.</li>
          <li>The price and applicable taxes are those shown by Google Play before confirmation and may vary by country.</li>
          <li>Restoration and refund eligibility are governed by Google Play and applicable law.</li>
        </ul>

        <h2>Availability and responsibility</h2>
        <p>
          Hardware media support varies by device and source. Review important output before publishing and keep
          your originals. The app is provided “as is” and “as available.” To the maximum extent permitted by law,
          MiniFyn is not liable for indirect, incidental, or consequential loss arising from use of the app.
        </p>

        <h2>Changes and governing law</h2>
        <p>Features and these terms may change. Material policy changes will be reflected by the date above. These terms are governed by the laws of India.</p>

        <h2>Contact</h2>
        <p>Questions can be sent through the <Link href="/contact">MiniFyn contact page</Link>.</p>
      </article>
    </main>
  );
}
