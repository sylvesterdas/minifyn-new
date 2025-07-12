import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund and Cancellation Policy | MiniFyn',
  description: 'Read our policy on refunds and cancellations.',
};

export default function RefundPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Refund and Cancellation Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <p>This policy outlines the terms for refunds and cancellations for any paid services offered by MiniFyn.</p>

            <h2 className="mt-8 text-2xl font-semibold">1. General Policy</h2>
            <p>Our services are provided on a subscription basis. We offer a free tier of service with certain limitations. For paid tiers, payments are billed in advance on a monthly or annual basis and are non-refundable.</p>

            <h2 className="mt-8 text-2xl font-semibold">2. No Refunds</h2>
            <p>We do not provide refunds or credits for any partial subscription periods or unused services. Once a payment is made, it is final. We encourage users to make use of our free tier to evaluate the service before upgrading to a paid plan.</p>

            <h2 className="mt-8 text-2xl font-semibold">3. Cancellation</h2>
            <p>You can cancel your subscription at any time from your account dashboard. The cancellation will take effect at the end of your current billing cycle. You will continue to have access to the paid features until the end of the billing period. After the billing period ends, your account will be downgraded to the free tier.</p>
            
            <h2 className="mt-8 text-2xl font-semibold">4. Exceptions</h2>
            <p>In rare cases, we may consider refunds on a case-by-case basis at our sole discretion, such as in the event of a billing error on our part. To request a refund, please <Link href="/contact">contact our support team</Link>.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Policy Changes</h2>
            <p>We reserve the right to modify this Refund and Cancellation Policy at any time. Any changes will be effective immediately upon posting the updated policy on our website.</p>
        </div>
    </div>
  );
}
