import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ScamGuard: Link Checker Privacy Policy | MiniFyn",
  description: "Read the ScamGuard: Link Checker Privacy Policy.",
};

export default function ScamGuardPrivacyPage() {
  const lastUpdated = "July 17, 2026";

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

        <h2>Data we do not ask you to provide</h2>
        <ul>
          <li>No user accounts are required or created.</li>
          <li>
            We do not ask for your name, email address, phone number, contacts,
            precise location, or government identifiers.
          </li>
          <li>
            We do not collect the Android Advertising ID, show third-party ads,
            or use analytics data for advertising or ad personalization.
          </li>
          <li>We do not create advertising profiles or sell personal information.</li>
        </ul>

        <h2>Firebase Analytics</h2>
        <p>
          We use Google Analytics for Firebase to understand app reliability,
          feature usage, and purchase-flow performance. Analytics collection is
          enabled automatically and is not currently optional in the app.
        </p>
        <ul>
          <li>
            Firebase may automatically process an app-instance identifier, app
            version, device model and operating-system information, app lifecycle
            events, sessions, screen interactions, notification interactions,
            purchase and subscription events, and coarse region derived by Google
            from a masked IP address.
          </li>
          <li>
            ScamGuard also records limited events such as whether a link check
            completed, whether an upgrade prompt or checkout was shown, purchase
            status, subscription tier, a broad scan-count range, and whether a
            reminder is enabled.
          </li>
          <li>
            We do not send submitted URLs, message text, QR-code contents, link
            history, names, email addresses, phone numbers, or a developer-defined
            user ID to Firebase Analytics.
          </li>
          <li>
            Advertising-ID collection and ad-personalization signals are disabled
            in the Android app. We do not link Firebase Analytics to advertising
            products for personalized advertising.
          </li>
          <li>
            Google processes Analytics data as our service provider. User- and
            event-level data is retained for no longer than 14 months under the
            GA4 property retention setting. Aggregated reporting data may be kept
            longer by Google.
          </li>
        </ul>

        <h2>How ScamGuard: Link Checker works</h2>
        <ul>
          <li>
            URLs entered in the app are normalized and checked for security signals,
            reputation signals, redirect behavior, and AI-assisted risk signals.
          </li>
          <li>
            Requests are sent to <code>minifyn.com/api/scamguard/v1/*</code> for
            cloud link analysis when that feature is used. The request may include
            the submitted URL, a URL hash, app version, platform, and Play Integrity
            proof.
          </li>
          <li>
            The cloud reputation service checks submitted URLs against Google Web
            Risk. OpenPhish threat-feed data is downloaded to our server; submitted
            URLs are not sent to OpenPhish.
          </li>
          <li>
            Our service keeps reputation verdicts under a one-way URL hash in
            memory for up to 48 hours. IP addresses used for in-memory rate limiting
            expire after approximately one hour. Hosting and security providers may
            retain ordinary request logs under their own retention schedules.
          </li>
          <li>
            The app may request AI model manifest metadata and signed model
            download URLs from <code>minifyn.com/api/scamguard/v1/model-manifest</code> to
            support AI-assisted risk analysis. These requests may include app
            version, platform, API mode or AI Mode claims, and Play Integrity
            proof. AI Mode controls access to full AI review details and
            subscriber features.
          </li>
        </ul>

        <h2>Native Android quick checks</h2>
        <ul>
          <li>
            If you configure ScamGuard: Link Checker for Android quick checks,
            the app may inspect a link locally before handing it to your chosen
            browser.
          </li>
          <li>
            Preferred browser settings and trusted quick-check domains are
            stored locally when you choose to configure them.
          </li>
          <li>
            Redirect inspection may connect directly from your device to the
            submitted website and each redirect destination. Those websites receive
            ordinary network information such as your IP address and request headers.
          </li>
          <li>
            Cloud reputation checks submit a URL to MiniFyn only when that check is
            performed. Local heuristic and AI model checks remain on the device.
          </li>
        </ul>

        <h2>Play Integrity and security</h2>
        <ul>
          <li>
            ScamGuard uses the Google Play Integrity API to protect cloud checks,
            model downloads, and paid features from abuse.
          </li>
          <li>
            Google may process an app-provided request hash, app package and version,
            signing-certificate information, Play license status, and device-attestation
            information. MiniFyn receives the resulting integrity token and verdict.
          </li>
          <li>
            This information is used only for fraud prevention, security, licensing,
            and service integrity.
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
          <li>
            The app receives product, purchase-status, price, currency, and purchase-token
            information needed to provide and restore entitlements. Purchase tokens and
            entitlement status are stored locally; purchase events are reported to Firebase
            Analytics without payment-card or bank-account details.
          </li>
        </ul>

        <h2>Notifications</h2>
        <ul>
          <li>
            If you grant notification permission, Firebase Cloud Messaging may be
            used for daily safety tips and app announcements.
          </li>
          <li>
            Firebase Cloud Messaging uses a per-installation identifier and registration
            token, app version, device/app metadata, topic subscriptions, and notification
            interaction events to deliver and measure messages.
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
          <li>Preferred browser and trusted quick-check domain settings are stored locally when configured.</li>
          <li>
            Device backup/restore behavior may depend on Android system backup
            settings.
          </li>
        </ul>

        <h2>Your controls</h2>
        <ul>
          <li>You can deny or revoke camera and notification permissions in Android settings.</li>
          <li>You can disable daily reminders, app announcements, and optional link history in the app.</li>
          <li>You can clear locally stored history, settings, caches, and entitlement state by clearing the app's data or uninstalling it.</li>
          <li>
            ScamGuard does not currently provide an in-app switch for Firebase Analytics,
            so analytics data is treated as required rather than optional in our Google Play
            Data Safety disclosure.
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
