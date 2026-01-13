import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkGuard Privacy Policy | MiniFyn",
  description: "Read the LinkGuard Privacy Policy.",
};

export default function LinkGuardPrivacyPage() {
  const lastUpdated = "January 13, 2026";
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="prose prose-invert mx-auto">
        <h1>LinkGuard Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

        <p>
          LinkGuard is designed with privacy and transparency as core
          principles. This policy explains how the app handles data.
        </p>

        <h2>What we do NOT collect</h2>
        <ul>
          <li>No user accounts are required or created.</li>
          <li>No personal information is collected or stored.</li>
          <li>No advertising identifiers are used.</li>
          <li>No third-party analytics or tracking tools are integrated.</li>
        </ul>

        <h2>How LinkGuard works</h2>
        <ul>
          <li>
            URLs entered into the app are processed solely to analyze potential
            security risks and provide informational results.
          </li>
          <li>
            Requests are sent to <code>minifyn.com/api/linkguard/*</code> to
            perform link analysis.
          </li>
          <li>
            LinkGuard does not associate checked URLs with any user identity.
          </li>
          <li>
            Temporary technical data such as IP address or request metadata may
            be processed transiently by servers for security and reliability
            purposes, and is not used for tracking.
          </li>
        </ul>

        <h2>On-device data</h2>
        <ul>
          <li>Cache data is stored locally on your device.</li>
          <li>
            Pro unlock status is stored locally and may be restored using
            Android Auto Backup on the same device and Google account.
          </li>
        </ul>

        <h2>Children’s privacy</h2>
        <p>
          LinkGuard is not directed at children under the age of 13 and does not
          knowingly collect personal information from children.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          This policy may be updated from time to time. Any changes will be
          reflected on this page.
        </p>

        <p>
          For questions or concerns, please contact us via{" "}
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
