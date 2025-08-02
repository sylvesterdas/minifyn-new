
import type { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Shipping and Delivery Policy | MiniFyn',
  description: 'Learn about our policy on shipping and delivery for digital services.',
  alternates: {
    canonical: 'https://www.minifyn.com/shipping-and-delivery-policy',
  },
};

export default function ShippingAndDeliveryPolicyPage() {
  const lastUpdated = "July 15, 2024";
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Shipping and Delivery Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
            
            <p>MiniFyn is a product of LJS Works, a registered Indian sole proprietorship (UDYAM-KL-12-0112903).</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Scope of Policy</h2>
            <p>This policy outlines the terms of service delivery for MiniFyn. As a provider of purely digital services, we do not ship or deliver any physical goods. This policy clarifies how our digital services are accessed and delivered to you.</p>

            <h2 className="mt-8 text-2xl font-semibold">2. Service Delivery</h2>
            <p>All our services, including but not limited to URL shortening, QR code generation, and premium features under the "Pro" plan, are delivered electronically.</p>
            <ul>
                <li><strong>Free Services:</strong> Access to our free services is granted immediately upon visiting our website.</li>
                <li><strong>Pro Plan Services:</strong> Upon successful completion of a subscription payment, your account is instantly upgraded, and all associated Pro features are activated and made available to you within your user dashboard. You will receive an email confirmation of your subscription activation, but this email is for informational purposes and is not required to access the services.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">3. No Physical Shipping</h2>
            <p>MiniFyn does not produce, sell, or distribute any physical products. There are no shipping costs, no delivery times to consider, and no physical items will be sent to your postal address.</p>

            <h2 className="mt-8 text-2xl font-semibold">4. Confirmation of Delivery</h2>
            <p>The delivery of our service is considered complete when the digital service or feature is made accessible to you. For the Pro plan, this is the moment your account is upgraded after payment confirmation.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Contact Us</h2>
            <p>If you have any questions about our Shipping and Delivery Policy or experience any issues accessing our services after a purchase, please contact our support team.</p>
        </div>
    </div>
  );
}
