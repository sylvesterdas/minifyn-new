import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Marketing Studio Terms | MiniFyn', description: 'Terms for the MiniFyn Marketing Studio invite-only beta.', alternates: { canonical: 'https://www.minifyn.com/marketing-studio/terms' } };

export default function MarketingStudioTermsPage() {
  return <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20"><article className="prose prose-invert mx-auto">
    <h1>Marketing Studio Terms of Service</h1><p className="text-muted-foreground">Last updated: August 22, 2026</p>
    <p>These terms govern use of the MiniFyn Marketing Studio invite-only beta, operated by Sylvester Kumar Das (UDYAM-KL-12-0136086). They supplement the general <Link href="/terms">MiniFyn Terms of Service</Link>.</p>
    <h2>Eligibility and accounts</h2><p>You may use Marketing Studio only through a valid invitation. You are responsible for accurate account information, protecting your login, and actions performed by members you authorize.</p>
    <h2>Authority to connect products</h2><p>You must have permission to manage every app, analytics property, store account, channel, media item, and provider account you connect. You may not use Marketing Studio to access another person&apos;s data or publish on their behalf without authorization.</p>
    <h2>Provider authorization</h2><p>OAuth and other provider connections are governed by the provider&apos;s own terms. Marketing Studio cannot grant permissions your provider account does not have. You are responsible for reviewing requested scopes and revoking access when it is no longer needed.</p>
    <h2>Content and approvals</h2><p>You retain responsibility for submitted and generated content, claims, rights, privacy, and platform-policy compliance. Automated suggestions may be inaccurate. Human review and approval are required before consequential scheduling or publication.</p>
    <h2>Beta service</h2><p>The beta may change, experience downtime, impose quotas, or disable costly operations to protect shared infrastructure. Beta access may be suspended for security, abuse, excessive usage, or violation of these terms.</p>
    <h2>Fees</h2><p>No public paid subscription is offered during the invite-only beta. Future paid plans will be presented separately and will not begin without your agreement.</p>
    <h2>Prohibited use</h2><p>You may not bypass access controls, scrape unauthorized data, upload unlawful or infringing material, expose credentials, interfere with service limits, or use connected providers contrary to their policies.</p>
    <h2>Disclaimer and liability</h2><p>Marketing Studio is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis during beta. To the extent permitted by law, MiniFyn is not liable for indirect or consequential loss, provider outages, rejected campaigns, lost data, or actions approved by workspace users.</p>
    <h2>Termination and deletion</h2><p>You may stop using the service and disconnect providers at any time. We may suspend access to protect users or infrastructure. Data-deletion requests can be made through the <Link href="/contact">MiniFyn contact page</Link>, subject to legal, security, audit, and backup-retention requirements.</p>
    <h2>Changes</h2><p>Updated terms will be posted here with a revised effective date. Continued use after material changes constitutes acceptance where permitted by law.</p>
  </article></div>;
}
