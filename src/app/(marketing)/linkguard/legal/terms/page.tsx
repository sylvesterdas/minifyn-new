import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkGuard Terms of Use | MiniFyn",
  description: "Read the LinkGuard Terms of Use.",
};

export default function LinkGuardTermsPage() {
  const lastUpdated = "February 21, 2026";

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="prose prose-invert mx-auto">
        <h1 className="text-4xl font-bold">LinkGuard Terms of Use</h1>
        <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

        <p className="mb-4">
          These Terms govern your use of the LinkGuard app and related services.
          By using LinkGuard, you agree to these Terms.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Operator identity</h2>
        <p className="mb-6">
          LinkGuard is a MiniFyn product operated by <strong>LJS Works</strong>{" "}
          (registered MSME/Udhyam entity in India).
        </p>

        <h2 className="text-2xl font-semibold mb-3">Purpose of the app</h2>
        <p className="mb-6">
          LinkGuard provides informational URL risk analysis. Results are
          heuristic/security signals and not a guarantee that any link is safe or
          unsafe.
        </p>

        <h2 className="text-2xl font-semibold mb-3">No guarantees</h2>
        <p className="mb-6">
          LinkGuard is provided "as is" and "as available." We make no warranty
          on uninterrupted operation or perfect detection accuracy.
        </p>

        <h2 className="text-2xl font-semibold mb-3">User responsibilities</h2>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>You are responsible for your own online decisions and actions.</li>
          <li>You must not use LinkGuard for unlawful, abusive, or malicious activity.</li>
          <li>You must not attempt to abuse or overload LinkGuard infrastructure.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">Pro features and payments</h2>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>Pro is a one-time payment unlock (not a subscription).</li>
          <li>Pro purchase availability may be limited by region (currently India).</li>
          <li>
            Payments are processed by Razorpay and may be subject to Razorpay's
            terms and policies.
          </li>
          <li>
            Pro unlock is device-local in the current implementation and may be
            affected by reinstall/reset/backup behavior.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">Refund and cancellation</h2>
        <p className="mb-6">
          LinkGuard Pro is a one-time digital unlock. All payments are final.
          No refunds, returns, or cancellations are offered after purchase,
          except where required under applicable law.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Pricing and offers</h2>
        <p className="mb-6">
          Promotional pricing (for example launch offers) may be changed, paused,
          or removed at any time.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Limitation of liability</h2>
        <p className="mb-6">
          To the maximum extent permitted by law, LinkGuard and its operators are
          not liable for direct, indirect, incidental, or consequential damages
          arising from use of the app or reliance on its output.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Service changes</h2>
        <p className="mb-6">
          We may modify, suspend, or discontinue features at any time.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Governing law</h2>
        <p className="mb-6">These Terms are governed by the laws of India.</p>

        <h2 className="text-2xl font-semibold mb-3">Contact</h2>
        <p className="mb-4">
          For questions regarding these terms, contact us via{" "}
          <a
            href="https://www.minifyn.com"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            minifyn.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
