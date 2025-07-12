import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MiniFyn',
  description: 'Read the Privacy Policy for using MiniFyn.',
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <p>MiniFyn ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (collectively, the "Service").</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Information We Collect</h2>
            <p>We collect information to provide and improve our services. This includes:</p>
            <ul>
                <li><strong>Information you provide:</strong> When you create an account, you provide us with personal information that includes your name and email address. When you contact us, we may keep a record of your communication.</li>
                <li><strong>Information from your use of our services:</strong> We collect information about how you use our Service. This includes your IP address for rate-limiting and security purposes, the original and shortened URLs, and user agent information.</li>
                <li><strong>Analytics Data:</strong> For each click on a shortened link, we collect the user's IP address, user agent, referrer, and approximate geographic location to provide analytics to our users.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">2. How We Use Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Operate, maintain, and provide the features and functionality of the Service.</li>
                <li>Improve, personalize, and expand our Service.</li>
                <li>Understand and analyze how you use our Service.</li>
                <li>Develop new products, services, features, and functionality.</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes.</li>
                <li>Detect and prevent fraud and abuse.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">3. Information Sharing</h2>
            <p>We do not share your personal information with companies, organizations, or individuals outside of MiniFyn except in the following cases:</p>
            <ul>
                <li><strong>With your consent:</strong> We will share personal information with companies, organizations or individuals outside of MiniFyn when we have your consent to do so.</li>
                <li><strong>For external processing:</strong> We provide personal information to our affiliates or other trusted businesses or persons to process it for us, based on our instructions and in compliance with our Privacy Policy and any other appropriate confidentiality and security measures.</li>
                <li><strong>For legal reasons:</strong> We will share personal information if we have a good-faith belief that access, use, preservation or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process or enforceable governmental request.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">4. Data Security</h2>
            <p>We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use a variety of security measures to maintain the safety of your personal information.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have certain rights under data protection laws. These may include the right to access, correct, update, or request deletion of your personal information. If you wish to exercise any of these rights, please contact us.</p>
            
            <h2 className="mt-8 text-2xl font-semibold">6. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
        </div>
    </div>
  );
}