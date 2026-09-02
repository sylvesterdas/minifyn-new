import { AppHeader } from '@/components/app-shell/app-header';
import { AppFooter } from '@/components/app-shell/app-footer';

export default function ScamGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="scamguard-theme flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <AppHeader
        appName="ScamGuard"
        appSlug="scamguard"
        logoSrc="/images/scamguard-logo.png"
        tagline="Check suspicious links first"
        mobileTagline="Check links first"
        navLinks={[
          { label: "Overview", href: "/scamguard" },
        ]}
        playStoreUrl="/go/scamguard-play"
        playStoreBadge
      />
      <main className="flex-1 flex flex-col">{children}</main>
      <AppFooter
        appName="ScamGuard"
        appSlug="scamguard"
        logoSrc="/images/scamguard-logo.png"
        tagline="Pause, inspect, and understand suspicious links, QR codes, and browser handoffs before you open them."
        supportEmail="sylvesterdas.dev@gmail.com"
        playStoreUrl="/go/scamguard-play"
      />
    </div>
  );
}
