import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ClipFyn Privacy Policy | MiniFyn",
  description: "How ClipFyn handles videos, advertising, age signals, and purchases.",
  alternates: { canonical: "https://www.minifyn.com/clipfyn/legal/privacy" },
};

export default function ClipFynPrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
      <article className="prose prose-invert mx-auto">
        <h1>ClipFyn Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: August 12, 2026</p>
        <p>ClipFyn is a MiniFyn product operated by Sylvester Kumar Das (UDYAM-KL-12-0136086).</p>

        <h2>Your videos</h2>
        <ul>
          <li>Imported videos and conversion outputs are processed on your Android device.</li>
          <li>ClipFyn does not upload your videos to MiniFyn servers.</li>
          <li>Temporary outputs are kept in app-controlled storage and are removed by the app's cleanup process.</li>
          <li>A video leaves app-controlled storage only when you save it or share it to an app you choose.</li>
        </ul>

        <h2>Advertising and consent</h2>
        <p>
          The free app uses Google AdMob. Where required, Google's consent flow is shown before ads can be
          requested. Depending on your consent, age treatment, region, and Google settings, Google and its
          partners may process device identifiers, IP-derived approximate location, app interactions,
          diagnostics, and advertising data to provide, measure, prevent fraud in, and personalize ads.
          You can reopen privacy choices from ClipFyn's menu when Google requires that option.
        </p>

        <h2>Google Play Age Signals</h2>
        <p>
          ClipFyn includes support for the Google Play Age Signals API, but does not request signals unless a
          lawful age-appropriate content or experience requires them. Age Signals do not control advertising,
          marketing, analytics, profiling, purchases, or access to video preparation. ClipFyn does not retain the
          Play Age Signals install identifier or age range. The app is general audience and is not directed to children.
        </p>

        <h2>Purchases</h2>
        <p>
          Google Play processes the optional one-time remove-ads purchase. MiniFyn does not receive your complete
          payment-card details. ClipFyn receives purchase status and product information needed to unlock and
          restore the purchase.
        </p>

        <h2>Data we ask for</h2>
        <p>
          ClipFyn requires no account and does not ask for your name, email address, phone number, contacts, or
          precise location. Android and Google services may process technical data as described above and under
          their own policies.
        </p>

        <h2>Children and families</h2>
        <p>
          ClipFyn is not designed primarily for children. Its video-preparation features remain the same for all
          Age Signals states. Advertising consent and delivery are handled through Google's advertising controls,
          independently from Play Age Signals. Parents and guardians may use Google Play and device family controls.
        </p>

        <h2>Your choices</h2>
        <p>
          You may avoid sharing a video, remove the app and its local data, manage ad privacy through the app or
          Google settings, or buy the one-time ad-removal product. For privacy questions, use the <Link href="/contact">MiniFyn contact page</Link>.
        </p>
      </article>
    </main>
  );
}
