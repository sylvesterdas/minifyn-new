import Link from 'next/link';

const legalLinks = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/acceptable-use', label: 'Acceptable Use' },
  { href: '/dmca', label: 'DMCA Policy' },
  { href: '/refund-policy', label: 'Refund Policy' },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} MiniFyn. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {legalLinks.map(link => (
              <Link key={link.href} className="text-sm hover:underline underline-offset-4 text-muted-foreground" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
