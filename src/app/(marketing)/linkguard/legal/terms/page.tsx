import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkGuard Terms of Use | MiniFyn",
  description: "Read the LinkGuard Terms of Use.",
};

export default function LinkGuardTermsPage() {
  const lastUpdated = "January 13, 2026";
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="prose prose-invert mx-auto">
        <h1 className="text-4xl font-bold">LinkGuard Terms of Use</h1>
        <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

        <p className="mb-4">
          These Terms of Use govern your use of the LinkGuard mobile application
          and related services. By using LinkGuard, you agree to these terms.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Purpose of the app</h2>
        <p className="mb-6">
          LinkGuard provides informational analysis of URLs to help identify
          potential security risks. It does not guarantee that a link is safe or
          unsafe and should not be treated as definitive security advice.
        </p>

        <h2 className="text-2xl font-semibold mb-3">No guarantees</h2>
        <p className="mb-6">
          LinkGuard is provided on an “as-is” and “as-available” basis. We make
          no warranties regarding accuracy, completeness, or reliability of
          results. You use the app at your own discretion and risk.
        </p>

        <h2 className="text-2xl font-semibold mb-3">User responsibility</h2>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>You are responsible for how you use the information provided.</li>
          <li>
            You agree not to use LinkGuard for unlawful, abusive, or malicious
            purposes.
          </li>
          <li>
            You must not attempt to interfere with or misuse the service or its
            infrastructure.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">Pro features</h2>
        <p className="mb-6">
          Certain advanced features may be available as paid “Pro”
          functionality. Pro unlock status is device-based and may be restored
          on the same device and Google account using Android Auto Backup.
          Availability is not guaranteed after device resets or account changes.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Limitation of liability</h2>
        <p className="mb-6">
          To the maximum extent permitted by law, LinkGuard and its operators
          shall not be liable for any direct, indirect, incidental, or
          consequential damages resulting from use of the app or reliance on its
          output.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Changes to the service</h2>
        <p className="mb-6">
          We may modify, suspend, or discontinue any part of LinkGuard at any
          time without prior notice.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Governing law</h2>
        <p className="mb-6">
          These terms are governed by the laws of India, without regard to
          conflict of law principles.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Contact</h2>
        <p className="mb-4">
          For questions regarding these terms, please contact us via{" "}
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
