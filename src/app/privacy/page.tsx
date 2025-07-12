import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MiniFyn',
  description: 'Read the Privacy Policy for using MiniFyn.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Information We Collect</h2>
            <p>We collect information to provide and improve our services. This includes:</p>
            <ul>
                <li><strong>Information you provide:</strong> When you create an account, you provide us with personal information that includes your name and email address.</li>
                <li><strong>Information we get from your use of our services:</strong> We collect information about the services that you use and how you use them. This includes your IP address for rate-limiting purposes and the original and shortened URLs.</li>
                <li><strong>Analytics Data:</strong> For each click on a shortened link, we may collect the user's IP address, user agent, and referrer to provide analytics.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">2. How We Use Information</h2>
            <p>We use the information we collect to operate, maintain, and provide the features and functionality of the Service, as well as to communicate directly with you, such as to send you email messages.</p>

            <h2 className="mt-8 text-2xl font-semibold">3. Information Sharing</h2>
            <p>We do not share your personal information with companies, organizations, or individuals outside of MiniFyn except in the following cases: with your consent, for legal reasons, or to our third-party service providers for data processing.</p>

            <h2 className="mt-8 text-2xl font-semibold">4. Data Security</h2>
            <p>We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
        </div>
    </div>
  );
}
