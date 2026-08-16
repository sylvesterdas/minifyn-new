import Link from 'next/link';
import Image from 'next/image';

interface AppFooterProps {
  appName: string;
  appSlug: string;
  logoSrc: string;
  tagline: string;
  supportEmail?: string;
  playStoreUrl?: string;
}

export function AppFooter({
  appName,
  appSlug,
  logoSrc,
  tagline,
  supportEmail = 'sylvesterdas.dev@gmail.com',
  playStoreUrl,
}: AppFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/60 backdrop-blur-sm py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href={`/${appSlug}`} className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-card border">
                <Image src={logoSrc} alt={`${appName} logo`} fill className="object-cover p-0.5" />
              </div>
              <span className="font-bold text-lg">{appName}</span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              {tagline}
            </p>
            <div className="text-xs text-muted-foreground space-y-1 pt-1">
              <p>Operated by <strong>Sylvester Kumar Das</strong> (UDYAM-KL-12-0136086).</p>
              <p>Part of the MiniFyn software privacy suite.</p>
            </div>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">Legal &amp; Privacy</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href={`/${appSlug}/legal/privacy`} className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={`/${appSlug}/legal/terms`} className="transition-colors hover:text-foreground">
                  Terms of Use
                </Link>
              </li>
              <li>
                <a href={`mailto:${supportEmail}`} className="transition-colors hover:text-foreground">
                  Contact ({supportEmail})
                </a>
              </li>
            </ul>
          </div>

          {/* Apps & Downloads */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">MiniFyn Apps</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/censorfyn" className={`transition-colors hover:text-foreground ${appSlug === 'censorfyn' ? 'font-medium text-foreground' : ''}`}>
                  CensorFyn (Media Redaction)
                </Link>
              </li>
              <li>
                <Link href="/clipfyn" className={`transition-colors hover:text-foreground ${appSlug === 'clipfyn' ? 'font-medium text-foreground' : ''}`}>
                  ClipFyn (Video Preparation)
                </Link>
              </li>
              <li>
                <Link href="/scamguard" className={`transition-colors hover:text-foreground ${appSlug === 'scamguard' ? 'font-medium text-foreground' : ''}`}>
                  ScamGuard (Link Checker)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} {appName}. All rights reserved.</p>
          <p>
            An independent privacy utility by <Link href="/" className="underline hover:text-foreground">MiniFyn</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
