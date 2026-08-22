import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Marketing Studio Privacy Policy | MiniFyn', description: 'How MiniFyn Marketing Studio handles account, app, analytics, and provider authorization data.', alternates: { canonical: 'https://www.minifyn.com/marketing-studio/privacy' } };

export default function MarketingStudioPrivacyPage() {
  return <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20"><article className="prose prose-invert mx-auto">
    <h1>Marketing Studio Privacy Policy</h1><p className="text-muted-foreground">Last updated: August 22, 2026</p>
    <p>Marketing Studio is an invite-only MiniFyn service operated by Sylvester Kumar Das (UDYAM-KL-12-0136086). This policy supplements the <Link href="/privacy">MiniFyn Privacy Policy</Link> and describes data handled specifically by Marketing Studio.</p>
    <h2>Information we process</h2><ul><li>Account email, workspace membership, app roles, invitations, and audit records.</li><li>App configuration, marketing drafts, media, schedules, review decisions, and usage-metering records.</li><li>Analytics and store information requested from services you connect, such as aggregate Google Analytics metrics, Google Play app and financial reports, and connected Buffer channels.</li><li>OAuth access and refresh tokens, or provider credentials where OAuth is unavailable.</li></ul>
    <h2>Google user data</h2><p>Marketing Studio uses Google authorization only after you choose to connect an account. Requested access may include read-only Google Analytics reports, Google Play Developer data, and read-only access to a Play report storage bucket. Access is limited by the permissions already granted to your Google account and by the apps and properties you select.</p>
    <p>Google user data is used only to provide app analytics, store reporting, cached summaries, and features you explicitly request. We do not sell Google user data, use it for advertising, or allow humans to read it except when necessary for security, support requested by you, legal compliance, or service operation with appropriate safeguards. Our use and transfer of information received from Google APIs complies with the Google API Services User Data Policy, including the Limited Use requirements.</p>
    <h2>Credential protection</h2><p>OAuth refresh tokens and credentials are encrypted at rest. Secret values are not returned through the normal interface, included in exports, or written to application logs. Access is restricted to authorized workspace operations. Connections can be revoked or disconnected.</p>
    <h2>Storage and retention</h2><p>Provider responses are cached only as needed to reduce requests and serve workspace reports. Workspace content and audit attribution are retained while the workspace is active or as needed for security and legal obligations. Connection secrets are removed when a connection is deleted, subject to limited encrypted backup retention.</p>
    <h2>Sharing</h2><p>We disclose data only to service providers needed to operate Marketing Studio, when directed by an authorized workspace user, to protect the service, or when legally required. We do not sell personal information.</p>
    <h2>Your controls</h2><p>You can disconnect providers in Marketing Studio and revoke Google access from your Google Account security settings. You may request access, correction, export, or deletion through the <Link href="/contact">MiniFyn contact page</Link>.</p>
    <h2>Security and limitations</h2><p>We use encryption, access controls, rate limits, audit records, and human approval gates. No service can guarantee absolute security. During beta, do not connect accounts or upload content you are not authorized to manage.</p>
    <h2>Changes</h2><p>Material changes will be posted on this page with a revised date.</p>
  </article></div>;
}
