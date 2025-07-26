
import type { Metadata } from 'next';
import Link from 'next/link';



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
            <p>MiniFyn provides a variety of tools, including a URL shortener and QR code generator. We offer different tiers of service ("Plans"), including a free plan and paid subscription plans (e.g., "Pro Plan"). Each plan has different features and limitations, which are outlined on our <Link href="/pricing">Pricing page</Link>.</p>

            <h2 className="mt-8 text-2xl font-semibold">3. User Accounts</h2>
            <p>While some features are available anonymously, full access to features like link management and higher usage limits requires you to create an account. When you create an account, you must provide information that is accurate and complete. You are responsible for safeguarding your password and for any activities or actions under your account. Failure to comply constitutes a breach of the Terms, which may result in immediate termination of your account.</p>

            <h2 className="mt-8 text-2xl font-semibold">4. Subscriptions and Payments</h2>
            <p>For paid plans, you agree to pay the subscription fees specified on our Pricing page. Payments are handled by our third-party payment processor, Razorpay. By providing payment information, you authorize us to charge the fees on a recurring basis. All payments are non-refundable. Please see our <Link href="/cancellation-and-refund-policy">Cancellation and Refund Policy</Link> for details on cancelling your subscription.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Acceptable Use</h2>
            <p>You agree not to use the Service for any unlawful purpose. To protect the integrity of our service, we scan submitted URLs for malicious content. You must not use the Service to shorten URLs that point to content that is unlawful, harmful, or otherwise objectionable. Please see our <Link href="/acceptable-use">Acceptable Use Policy</Link> for full details.</p>

            <h2 className="mt-8 text-2xl font-semibold">6. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of MiniFyn and its licensors.</p>

            <h2 className="mt-8 text-2xl font-semibold">7. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms. If you wish to terminate your account, you may do so by discontinuing use of the Service. For paid plans, you must cancel your subscription according to our Cancellation and Refund Policy to avoid future charges.</p>

            <h2 className="mt-8 text-2xl font-semibold">8. Disclaimer of Warranties</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Your use of the Service is at your sole risk. The Service is provided without warranties of any kind, whether express or implied.</p>

            <h2 className="mt-8 text-2xl font-semibold">9. Limitation of Liability</h2>
            <p>In no event shall MiniFyn be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of the Service.</p>

            <h2 className="mt-8 text-2xl font-semibold">10. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes. By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms.</p>
        </div>
    </div>
  );
}
