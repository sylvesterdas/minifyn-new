import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Terms of Service | MiniFyn',
  description: 'Read the Terms of Service for using MiniFyn.',
  alternates: {
    canonical: 'https://www.minifyn.com/terms',
  },
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the MiniFyn website (the "Service") operated by MiniFyn ("us", "we", or "our").</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. This agreement applies to all visitors, users, and others who access or use the Service.</p>

            <h2 className="mt-8 text-2xl font-semibold">2. Description of Service</h2>
            <p>MiniFyn provides users with a variety of tools and services, including but not limited to the ability to shorten URLs, generate QR codes, and a suite of free developer tools (the "Service"). The Service is available through our website and may include an API for programmatic access.</p>

            <h2 className="mt-8 text-2xl font-semibold">3. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

            <h2 className="mt-8 text-2xl font-semibold">4. Acceptable Use</h2>
            <p>You agree not to use the Service for any unlawful purpose or to violate any laws in your jurisdiction. To protect the integrity of our service and our users, we actively scan submitted URLs for malicious content using automated systems, which may include third-party services such as the Google Web Risk API. You must not use the Service to shorten URLs that point to content that is unlawful, harmful, or otherwise objectionable. Please see our Acceptable Use Policy for more details.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of MiniFyn and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

            <h2 className="mt-8 text-2xl font-semibold">6. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h2 className="mt-8 text-2xl font-semibold">7. Disclaimer of Warranties</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Your use of the Service is at your sole risk. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>
            <p>Specifically for our free developer tools (like the Code Minifier, JSON Formatter, and JWT Debugger), while we strive for accuracy, we are not liable for any errors, data loss, or damages resulting from their use. You assume full responsibility for testing and verifying the output of these tools before use in a production environment.</p>

            <h2 className="mt-8 text-2xl font-semibold">8. Limitation of Liability</h2>
            <p>In no event shall MiniFyn, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h2 className="mt-8 text-2xl font-semibold">9. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </div>
    </div>
  );
}
