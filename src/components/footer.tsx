
import Link from 'next/link';
import { SocialLinks } from './social-links';
import Logo from './logo';

const footerLinks = {
    product: [
        { href: '/features', label: 'Features' },
        { href: '/blog', label: 'Blog' },
        { href: '/tools', label: 'Developer Tools' },
        { href: '/pricing', label: 'Pricing' },
    ],
    resources: [
        { href: '/docs', label: 'Docs Home' },
        { href: '/docs/guides', label: 'How-to Guides' },
        { href: '/docs/api', label: 'API Reference' },
        { href: '/help/faq', label: 'FAQ' },
    ],
    company: [
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact Us' },
        { href: '/help', label: 'Help Center' },
        { href: '/sitemap.xml', label: 'Sitemap' },
    ],
    legal: [
        { href: '/terms', label: 'Terms of Service' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/cancellation-and-refund-policy', label: 'Cancellation & Refund' },
        { href: '/shipping-and-delivery-policy', label: 'Shipping & Delivery' },
        { href: '/acceptable-use', label: 'Acceptable Use' },
        { href: '/dmca', label: 'DMCA' },
    ],
};

const FooterLink = ({ href, label }: { href: string; label: string }) => (
    <li>
        <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
            {label}
        </Link>
    </li>
);

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
    return (
        <div>
            <h4 className="font-semibold mb-4 text-foreground">{title}</h4>
            <ul className="space-y-3 text-sm">
                {links.map(link => <FooterLink key={link.href} {...link} />)}
            </ul>
        </div>
    );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
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
                <FooterColumn title="Product" links={footerLinks.product} />
                <FooterColumn title="Resources" links={footerLinks.resources} />
                <FooterColumn title="Company" links={footerLinks.company} />
                <FooterColumn title="Legal" links={footerLinks.legal} />
            </div>
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} MiniFyn. All rights reserved.
            </div>
        </div>
    </footer>
  );
}
