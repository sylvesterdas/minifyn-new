import { AppHeader } from '@/components/app-shell/app-header';
import { AppFooter } from '@/components/app-shell/app-footer';

export default function LinkGuardLayout({
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
        tagline="Link Checker"
      />
      <main className="flex-1 flex flex-col">{children}</main>
      <AppFooter
        appName="ScamGuard"
        appSlug="scamguard"
        logoSrc="/images/scamguard-logo.png"
        tagline="LinkGuard has evolved into ScamGuard: Link Checker."
        supportEmail="sylvesterdas.dev@gmail.com"
      />
    </div>
  );
}
