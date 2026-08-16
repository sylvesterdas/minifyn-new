import { AppHeader } from '@/components/app-shell/app-header';
import { AppFooter } from '@/components/app-shell/app-footer';

export default function ScamGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <AppHeader
        appName="ScamGuard"
        appSlug="scamguard"
        logoSrc="/images/scamguard-logo.png"
        tagline="Link Checker &amp; Threat Detection"
        navLinks={[
          { label: "Overview", href: "/scamguard" },
        ]}
        playStoreUrl="/go/scamguard-play"
      />
      <main className="flex-1 flex flex-col">{children}</main>
      <AppFooter
        appName="ScamGuard"
        appSlug="scamguard"
        logoSrc="/images/scamguard-logo.png"
        tagline="Advanced on-device and AI cloud threat analysis for suspicious links, QR codes, and phishing attacks."
        supportEmail="sylvesterdas.dev@gmail.com"
        playStoreUrl="/go/scamguard-play"
      />
    </div>
  );
}
