import Link from 'next/link';
import { SocialLinks } from './social-links';
import Logo from './logo';

const footerLinks = {
    product: [
        { href: '/features', label: 'Features' },
        { href: '/tools/code-minifier', label: 'Code Minifier' },
        { href: '/tools/json-formatter', label: 'JSON Formatter' },
        { href: '/blog', label: 'Blog' },
    ],
    resources: [
        { href: '/docs', label: 'Docs' },
        { href: '/docs/guides', label: 'How-to Guides' },
        { href: '/docs/api', label: 'API Reference' },
        { href: '/help/faq', label: 'FAQ' },
    ],
    company: [
        { href: '/contact', label: 'Contact Us' },
        { href: '/help', label: 'Help Center' },
    ],
    legal: [
        { href: '/terms', label: 'Terms of Service' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/cancellation-and-refund-policy', label: 'Cancellation & Refund' },
        { href: '/acceptable-use', label: 'Acceptable Use' },
        { href: '/dmca', label: 'DMCA' },
        { href: '/sitemap.xml', label: 'Sitemap' },
    ],
};

const FooterLink = ({ href, label }: { href: string; label: string }) => (
    <li>
        <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
            {label}
        </Link>
    </li>
);

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Logo and Social */}
                <div className="col-span-2 md:col-span-1 flex flex-col items-start gap-4">
                     <Link href="/" className="flex items-center gap-2">
                        <Logo />
                        <span className="font-bold text-lg">MiniFyn</span>
                    </Link>
                    <p className="text-sm text-muted-foreground">The simplest way to shorten, share, and track your links.</p>
                    <div className="flex gap-2 mt-2">
                        <SocialLinks />
                    </div>
                </div>

                {/* Link Columns */}
                <div>
                    <h4 className="font-semibold mb-4 text-foreground">Product</h4>
                    <ul className="space-y-3 text-sm">
                        {footerLinks.product.map(link => <FooterLink key={link.href} {...link} />)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
                    <ul className="space-y-3 text-sm">
                        {footerLinks.resources.map(link => <FooterLink key={link.href} {...link} />)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-foreground">Legal & Help</h4>
                    <ul className="space-y-3 text-sm">
                        {footerLinks.company.map(link => <FooterLink key={link.href} {...link} />)}
                        {footerLinks.legal.map(link => <FooterLink key={link.href} {...link} />)}
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} MiniFyn. All rights reserved.
            </div>
        </div>
    </footer>
  );
}
