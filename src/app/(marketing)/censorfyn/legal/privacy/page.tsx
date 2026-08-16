import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CensorFyn Privacy Policy | MiniFyn",
  description: "Learn how CensorFyn protects your privacy with 100% offline, on-device media redaction.",
  alternates: { canonical: "https://www.minifyn.com/censorfyn/legal/privacy" },
};

export default function CensorFynPrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
      <article className="prose prose-invert mx-auto">
        <h1>CensorFyn Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: August 16, 2026</p>
        <p>
          CensorFyn is a privacy-first media redaction tool developed under the <strong>MiniFyn</strong> brand, operated by{" "}
          <strong>Sylvester Kumar Das</strong> (UDYAM-KL-12-0136086).
        </p>

        <h2>100% On-Device &amp; Offline Processing</h2>
        <p>
          Privacy is the foundational design principle of CensorFyn. All detection and redaction processes run entirely on your Android device:
        </p>
        <ul>
          <li>
            <strong>Zero Server Uploads:</strong> Your photos, documents, and media never leave your device. CensorFyn operates 100% offline with zero runtime server dependencies.
          </li>
          <li>
            <strong>On-Device AI Detection:</strong> Face detection, optical character recognition (OCR), sensitive PII parsing (passports, credit cards, driver&apos;s licenses, phone numbers), and barcode/QR scanning run locally using on-device ML models and heuristic parsers.
          </li>
          <li>
            <strong>Local Temporary Storage:</strong> Any intermediate processing buffers reside exclusively in secure, app-controlled local sandbox storage and are cleaned up immediately when done.
          </li>
        </ul>

        <h2>Pixel Destruction &amp; Metadata Sanitization</h2>
        <ul>
          <li>
            <strong>Irreversible Redaction:</strong> When you export redacted media, underlying pixel bytes are permanently overwritten using Gaussian blur, pixelation/mosaic, or solid color masks. No vector overlay layers remain that could be unmasked or reversed.
          </li>
          <li>
            <strong>EXIF &amp; GPS Stripping:</strong> By default, CensorFyn strips EXIF, GPS location coordinates, device identifiers, and camera metadata from exported files to prevent secondary data leakage.
          </li>
          <li>
            <strong>Optional Legal Audit Manifest:</strong> If you enable Audit Mode, CensorFyn computes a non-sensitive SHA-256 cryptographic checksum and timestamp companion file locally to verify chain of custody without exposing image contents.
          </li>
        </ul>

        <h2>Data We Do Not Collect</h2>
        <ul>
          <li>No user accounts or logins are required.</li>
          <li>We do not collect or store your name, email address, phone number, contacts, or biometric face templates.</li>
          <li>We do not track precise GPS location.</li>
          <li>We do not sell, rent, or share personal media or user data with third parties.</li>
        </ul>

        <h2>Device Permissions</h2>
        <ul>
          <li>
            <strong>Photos / Storage Access:</strong> Required to select images you want to redact and save sanitized copies back to your device storage.
          </li>
          <li>
            <strong>Camera (Optional):</strong> Used only if you choose to capture a new photo directly within the app for redaction.
          </li>
        </ul>

        <h2>Purchases &amp; Payments</h2>
        <p>
          Optional premium features or ad-removal purchases are processed directly through Google Play Billing. MiniFyn does not collect, receive, or store your credit card or financial account numbers. Google Play handles transaction processing under its own terms and privacy policy.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          CensorFyn is a general utility and is not directed at children under the age of 13. We do not knowingly collect personal information from children.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any revisions will be published on this page with an updated &ldquo;Last updated&rdquo; date.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this Privacy Policy or CensorFyn&apos;s privacy practices, please contact us via the{" "}
          <Link href="/contact">MiniFyn contact page</Link>.
        </p>
      </article>
    </main>
  );
}
