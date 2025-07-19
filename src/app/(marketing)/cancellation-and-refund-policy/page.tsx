
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Cancellation and Refund Policy | MiniFyn',
  description: 'Read our policy on cancellations and refunds for the MiniFyn Pro plan.',
  alternates: {
    canonical: 'https://www.minifyn.com/cancellation-and-refund-policy',
  },
};

export default function CancellationAndRefundPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Cancellation and Refund Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <p>This policy outlines the terms for cancellations and refunds for the MiniFyn Pro subscription service.</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Subscription and Billing</h2>
            <p>Our Pro plan is provided on a subscription basis. We offer a free tier of service with certain limitations so you can evaluate MiniFyn before purchasing. For the Pro plan, payments are billed in advance on a recurring basis (e.g., monthly or yearly) and are non-refundable.</p>

            <h2 className="mt-8 text-2xl font-semibold">2. Cancellation Policy</h2>
            <p>You can cancel your Pro subscription at any time from your account's "Billing" page in the dashboard. The cancellation will take effect at the end of your current billing cycle. You will continue to have access to Pro features until the end of that billing period. After the billing period ends, your account will be automatically downgraded to the Free plan, and you will not be charged again unless you choose to re-subscribe.</p>

            <h2 className="mt-8 text-2xl font-semibold">3. Refund Policy</h2>
            <p>We do not provide refunds or credits for any partial subscription periods, unused services, or downgrades. Once a payment for a subscription period is made, it is final. We strongly encourage users to make full use of our free tier to ensure MiniFyn meets their needs before upgrading to the Pro plan.</p>
            
            <h2 className="mt-8 text-2xl font-semibold">4. Exceptions</h2>
            <p>We may consider refunds on a case-by-case basis only in the event of a significant billing error on our part. To request consideration for such a case, please <Link href="/contact">contact our support team</Link> with detailed information about the issue.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Policy Changes</h2>
            <p>We reserve the right to modify this Cancellation and Refund Policy at any time. Any changes will be effective immediately upon posting the updated policy on our website. Your continued use of the paid service after a change constitutes your acceptance of the new policy.</p>
        </div>
    </div>
  );
}
