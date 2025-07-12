import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | MiniFyn',
  description: 'Read our Acceptable Use Policy.',
};

export default function AcceptableUsePage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Acceptable Use Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <p>This Acceptable Use Policy ("AUP") governs your use of the MiniFyn services ("Service") and is incorporated by reference into our Terms of Service. By using the Service, you agree to this AUP.</p>

            <h2 className="mt-8 text-2xl font-semibold">1. Prohibited Content</h2>
            <p>You may not use the Service to create, share, or link to any content that:</p>
            <ul>
                <li>Is illegal or promotes illegal activities.</li>
                <li>Is fraudulent, deceptive, or misleading. This includes phishing, pharming, or impersonating others.</li>
                <li>Distributes malware, viruses, or any other harmful computer code.</li>
                <li>Is hateful, defamatory, harassing, abusive, or discriminatory.</li>
                <li>Infringes on the intellectual property rights of others, including copyright, patent, trademark, or trade secret.</li>
                <li>Violates the privacy of others.</li>
                <li>Is sexually explicit or pornographic.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">2. Prohibited Actions</h2>
            <p>You may not use the Service to:</p>
            <ul>
                <li>Engage in any activity that interferes with or disrupts the Service or its servers and networks.</li>
                <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems.</li>
                <li>Use the Service for spamming, sending unsolicited emails, or bulk messaging.</li>
                <li>Scrape, spider, or otherwise automatically access the Service to collect data without our express written permission.</li>
                <li>Circumvent any rate limits or other use restrictions we place on the Service.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">3. Enforcement</h2>
            <p>We reserve the right, but do not assume the obligation, to investigate any violation of this AUP or misuse of the Service. We may:</p>
            <ul>
                <li>Remove or disable access to any content that violates this AUP.</li>
                <li>Suspend or terminate your account.</li>
                <li>Report any activity that we suspect violates any law or regulation to appropriate law enforcement officials.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">4. Reporting Violations</h2>
            <p>If you become aware of any violation of this AUP, please contact us immediately.</p>
        </div>
    </div>
  );
}