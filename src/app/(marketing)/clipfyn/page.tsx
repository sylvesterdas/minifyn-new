import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ClipFyn — Prepare videos for reliable sharing | MiniFyn",
  description: "ClipFyn prepares videos on your Android device for broadly compatible social-video sharing.",
  alternates: { canonical: "https://www.minifyn.com/clipfyn" },
};

export default function ClipFynPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-16 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">A MiniFyn product</p>
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">ClipFyn</h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Prepare videos on your Android device for reliable sharing, without uploading your footage to MiniFyn.
        </p>
        <p className="mt-8 inline-flex rounded-full border px-5 py-2 text-sm">Coming to Google Play</p>
      </div>

      <section className="mx-auto mt-20 grid max-w-4xl gap-6 md:grid-cols-3">
        {[
          ["Compatible output", "Inspects each source and produces a broadly compatible video when conversion is needed."],
          ["On-device processing", "Video preparation runs locally using Android's hardware media system."],
          ["Simple sharing", "Save the result or send it to a compatible app using Android's share sheet."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="prose prose-invert mx-auto mt-16 max-w-3xl">
        <h2>Honest expectations</h2>
        <p>
          Social platforms may process every uploaded video. ClipFyn does not promise passthrough, prevent
          recompression, or guarantee a particular platform's delivered quality. It prepares files for
          compatibility and lets the destination platform make the final delivery decision.
        </p>
        <p>
          ClipFyn is independent from Instagram, Meta, TikTok, YouTube, and their owners. Their names and
          trademarks belong to their respective owners.
        </p>
        <p>
          The app is free and supported by restrained advertising. A Google Play managed one-time purchase
          removes ads; its local price is shown by Google Play before purchase.
        </p>
        <p>
          <Link href="/clipfyn/legal/privacy">Privacy Policy</Link>{" · "}
          <Link href="/clipfyn/legal/terms">Terms of Use</Link>{" · "}
          <Link href="/contact">Contact</Link>
        </p>
      </section>
    </main>
  );
}
