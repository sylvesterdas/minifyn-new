import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | MiniFyn',
  description: 'Read our Cookie Policy to understand how we use cookies.',
};

export default function CookiePolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <p>This Cookie Policy explains how MiniFyn ("we," "our," or "us") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>

            <h2 className="mt-8 text-2xl font-semibold">1. What are cookies?</h2>
            <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
            
            <h2 className="mt-8 text-2xl font-semibold">2. Why do we use cookies?</h2>
            <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our properties. For example, we use cookies to remember your session if you are logged in.</p>

            <h2 className="mt-8 text-2xl font-semibold">3. Types of Cookies We Use</h2>
            <ul>
                <li><strong>Strictly Necessary Cookies:</strong> These cookies are essential to provide you with services available through our website and to enable you to use some of its features, such as access to secure areas.</li>
                <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</li>
                <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold">4. How can you control cookies?</h2>
            <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser. Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version.</p>

            <h2 className="mt-8 text-2xl font-semibold">5. Changes to This Cookie Policy</h2>
            <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
        </div>
    </div>
  );
}