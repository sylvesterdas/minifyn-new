import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ScamGuard: Link Checker Privacy Policy | MiniFyn",
  description: "Read the ScamGuard: Link Checker Privacy Policy.",
};

export default function ScamGuardPrivacyPage() {
  const lastUpdated = "May 17, 2026";

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="prose prose-invert mx-auto">
        <h1>ScamGuard: Link Checker Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

        <p>
          ScamGuard: Link Checker is designed with privacy and transparency as core principles.
          This policy explains how the app handles data.
        </p>

        <h2>Operator identity</h2>
        <p>
          ScamGuard: Link Checker is a <strong>MiniFyn</strong> product operated by{' '}
          <strong>Sylvester Kumar Das</strong> (UDYAM-KL-12-0136086).
        </p>

        <h2>What we do NOT collect</h2>
        <ul>
          <li>No user accounts are required or created.</li>
          <li>No advertising identifiers are used.</li>
          <li>No third-party advertising or analytics SDKs are integrated in the app.</li>
          <li>We do not build user profiles.</li>
        </ul>

        <h2>How ScamGuard: Link Checker works</h2>
        <ul>
          <li>
            URLs entered in the app are normalized and checked for security signals,
            reputation signals, redirect behavior, and AI-assisted risk signals.
          </li>
          <li>
            Requests are sent to <code>minifyn.com/api/linkguard/*</code> for
            link analysis. The request may include the submitted URL or URL hash,
            app version, platform, and Play Integrity proof.
          </li>
          <li>
            Temporary technical data (such as IP and request metadata) may be
            processed transiently for abuse prevention, reliability, and security.
          </li>
          <li>
            AI Mode subscribers may request model manifest metadata and signed
            model download URLs from <code>minifyn.com/api/scamguard-ai/*</code>.
            These requests include Google Play purchase proof and Play Integrity
            proof so the backend can verify subscription access.
          </li>
        </ul>

        <h2>Payments, Pro, and AI Mode</h2>
        <ul>
          <li>Pro is a Google Play managed one-time in-app product.</li>
          <li>AI Mode is a Google Play managed subscription and includes Pro features.</li>
          <li>
            Payments, renewals, cancellations, refunds, and payment methods are
            handled by Google Play under your Google Play account.
          </li>
          <li>
            We do not store full card, bank, UPI, or payment method credentials
            on our servers.
          </li>
          <li>We do not require creation of a personal account for Pro unlock.</li>
          <li>
            Google Play and infrastructure providers may process and retain their
            own operational logs and transaction records under their respective
            policies.
          </li>
        </ul>

        <h2>Notifications</h2>
        <ul>
          <li>
            If you grant notification permission, Firebase Cloud Messaging may be
            used for daily safety tips and app announcements.
          </li>
          <li>
            Topic subscriptions may include coarse delivery groups such as timezone
            offset topics and the app announcements topic. We do not use these
            topics to identify you personally.
          </li>
          <li>You can turn reminders and announcements off in app settings.</li>
        </ul>

        <h2>Camera and QR scanning</h2>
        <ul>
          <li>
            Camera permission is used only when you choose to scan a QR code.
          </li>
          <li>
            QR scanning runs on device. Links found in a QR code may be submitted
            for analysis only when you choose to check them.
          </li>
        </ul>

        <h2>On-device data</h2>
        <ul>
          <li>Link analysis cache is stored locally on your device.</li>
          <li>Optional link history is stored locally on your device when enabled.</li>
          <li>Pro and AI Mode unlock status are stored locally on your device.</li>
          <li>AI model metadata and downloaded model files may be cached locally.</li>
          <li>
            Device backup/restore behavior may depend on Android system backup
            settings.
          </li>
        </ul>

        <h2>Purchase restore responsibility</h2>
        <p>
          Purchases are managed by Google Play. If app data is cleared, the device
          is reset, or the app is reinstalled, you may need to restore purchases
          from the same Google Play account.
        </p>

        <h2>Children's privacy</h2>
        <p>
          ScamGuard: Link Checker is not directed at children under 13 and does not knowingly
          collect personal information from children.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Changes will be posted on
          this page with an updated date.
        </p>

        <h2>Contact</h2>
        <p>
          For questions or concerns, contact us via{" "}
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
