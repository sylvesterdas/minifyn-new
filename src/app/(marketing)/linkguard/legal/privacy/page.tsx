import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkGuard Privacy Policy | MiniFyn",
  description: "Read the LinkGuard Privacy Policy.",
};

export default function LinkGuardPrivacyPage() {
  const lastUpdated = "March 12, 2026";

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="prose prose-invert mx-auto">
        <h1>LinkGuard Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

        <p>
          LinkGuard is designed with privacy and transparency as core principles.
          This policy explains how the app handles data.
        </p>

        <h2>Operator identity</h2>
        <p>
          LinkGuard is a MiniFyn product operated by <strong>LJS Works</strong>{" "}
          (registered MSME/Udhyam entity in India).
        </p>

        <h2>What we do NOT collect</h2>
        <ul>
          <li>No user accounts are required or created.</li>
          <li>No advertising identifiers are used.</li>
          <li>No third-party analytics or tracking SDKs are integrated in the app.</li>
          <li>We do not build user profiles.</li>
        </ul>

        <h2>How LinkGuard works</h2>
        <ul>
          <li>
            URLs entered in the app are processed to perform security analysis and
            return informational risk results.
          </li>
          <li>
            Requests are sent to <code>minifyn.com/api/linkguard/*</code> for
            analysis.
          </li>
          <li>
            Temporary technical data (such as IP and request metadata) may be
            processed transiently for abuse prevention, reliability, and security.
          </li>
        </ul>

        <h2>Payments (LinkGuard Pro)</h2>
        <ul>
          <li>Pro is a one-time paid unlock, currently offered in India.</li>
          <li>
            Payments are processed by Razorpay. We do not store full card/bank/UPI
            credentials on our servers.
          </li>
          <li>
            LinkGuard payment verification is stateless. Our backend does not
            maintain a long-term user payment database for Pro entitlement.
          </li>
          <li>We do not require creation of a personal account for Pro unlock.</li>
          <li>
            Razorpay and infrastructure providers may process and retain their own
            operational logs/transaction records under their respective policies.
          </li>
        </ul>

        <h2>On-device data</h2>
        <ul>
          <li>Link analysis cache is stored locally on your device.</li>
          <li>Pro unlock status is stored locally on your device.</li>
          <li>
            Recovery code and entitlement metadata are stored locally to support
            restore flows.
          </li>
          <li>
            Device backup/restore behavior may depend on Android system backup
            settings.
          </li>
        </ul>

        <h2>Recovery code responsibility</h2>
        <p>
          You are responsible for safely storing your Pro recovery code. If your
          app data is cleared, your device is reset, or the app is reinstalled and
          the recovery code is unavailable, Pro restore may not be possible.
        </p>

        <h2>Children's privacy</h2>
        <p>
          LinkGuard is not directed at children under 13 and does not knowingly
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
