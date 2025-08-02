
import type { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Privacy Policy | MiniFyn',
  description: 'Read the Privacy Policy for using MiniFyn.',
  alternates: {
    canonical: 'https://www.minifyn.com/privacy',
  },
};

export default function PrivacyPage() {
  const lastUpdated = "July 15, 2024";
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <p>MiniFyn is a product of LJS Works, a registered Indian sole proprietorship (UDYAM-KL-12-0112903). This Privacy Policy explains how MiniFyn ("we," "our," or "us") collects, uses, discloses, and safeguards your information when you use our website and services (collectively, the "Service").</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Information We Collect</h2>
            <p>We collect information to provide and improve our services. This includes:</p>
            <ul>
                <li><strong>Information you provide:</strong> When you create an account, you provide us with personal information that includes your name and email address. When you use our URL shortener or QR code generator, you provide the content (URLs or text) to be processed. When you contact us, we may keep a record of your communication.</li>
                <li><strong>Payment Information:</strong> When you upgrade to a Pro plan, we do not directly store your payment card details. Your payment information is securely handled by our third-party payment processor, Razorpay. We may receive information such as your payment status and a part of your card number for verification purposes.</li>
                <li><strong>Information from your use of our services:</strong> We collect information about how you use our Service. This includes your IP address for rate-limiting and security purposes, the original and shortened URLs, and user agent information.</li>
                <li><strong>Analytics Data:</strong> For each click on a shortened link, we collect the user's IP address, user agent, referrer, and approximate geographic location to provide analytics to our users. Data retention periods for this analytics data vary based on your subscription plan.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">Google Analytics 4 (GA4)</h2>
            <p>We use Google Analytics 4 (GA4) to understand how our Service is used and to improve your experience. GA4 collects data about your interactions with our website, such as pages visited, time spent on pages, and your general geographic location. This data is anonymized and aggregated, and it helps us analyze trends, administer the site, track users' movements around the site, and gather demographic information.</p>
            <p>GA4 uses cookies and other tracking technologies to collect this information. You can learn more about how Google uses data when you use our partners' sites or apps by visiting <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google's Privacy & Terms page</a>. You can opt-out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on, available <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">here</a>.</p>

            <h2 className="mt-8 text-2xl font-semibold">2. How We Use Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Operate, maintain, and provide the features and functionality of the Service.</li>
                <li>Process transactions and manage your subscription.</li>
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
                <li><strong>For external processing:</strong> We provide personal information to our affiliates or other trusted businesses or persons to process it for us, based on our instructions and in compliance with our Privacy Policy and any other appropriate confidentiality and security measures. This includes our payment processor, Razorpay.</li>
                <li><strong>For security screening:</strong> To protect our users and prevent the spread of malicious content, we use Google's Web Risk service. When you shorten a URL via our website or API, that URL is sent to Google for security analysis. This process is governed by Google's Privacy Policy.</li>
                <li><strong>For legal reasons:</strong> We will share personal information if we have a good-faith belief that access, use, preservation or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process or enforceable governmental request.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">4. Data from Client-Side Tools</h2>
            <p>Some of our tools, such as the Code Minifier, JSON Formatter, and JWT Debugger, operate entirely within your web browser ("client-side"). For these tools, we do not collect, process, or store any of the data or files you input. All processing happens on your own device, and your data is never sent to our servers.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Data Security</h2>
            <p>We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use a variety of security measures to maintain the safety of your personal information.</p>

            <h2 className="mt-8 text-2xl font-semibold">6. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have certain rights under data protection laws. These may include the right to access, correct, update, or request deletion of your personal information. If you wish to exercise any of these rights, please contact us.</p>
            
            <h2 className="mt-8 text-2xl font-semibold">7. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h2 className="mt-8 text-2xl font-semibold">8. Google AdSense and Cookies</h2>
            <p>Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network Privacy Policy.</p>
            <p>We use Google AdSense to display advertisements on our website. Google AdSense may use cookies and web beacons to collect information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you. If you would like more information about this practice and to know your choices about not having this information used by Google, click here: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google Ad and Content Network Privacy Policy</a>.</p>
        </div>
    </div>
  );
}
