import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | MiniFyn',
  description: 'Read the Terms of Service for using MiniFyn.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>By using the MiniFyn URL shortening service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.</p>

            <h2 className="mt-8 text-2xl font-semibold">2. Description of Service</h2>
            <p>MiniFyn provides users with the ability to shorten URLs, track link analytics, and manage links. The Service is available through our website and API.</p>

            <h2 className="mt-8 text-2xl font-semibold">3. User Conduct</h2>
            <p>You agree not to use the Service to shorten URLs that point to content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable. We reserve the right to remove any links that violate these terms without notice.</p>

            <h2 className="mt-8 text-2xl font-semibold">4. Disclaimer of Warranties</h2>
            <p>The Service is provided "as is". We make no warranty that the Service will meet your requirements or be available on an uninterrupted, secure, or error-free basis. We will not be liable for any loss or damage arising from your use of the Service.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Changes to Terms</h2>
            <p>We may revise these Terms from time to time. The most current version will always be on this page. By continuing to use the Service after revisions become effective, you agree to be bound by the revised Terms.</p>
        </div>
    </div>
  );
}
