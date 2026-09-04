import { AppHeader } from '@/components/app-shell/app-header';
import { AppFooter } from '@/components/app-shell/app-footer';

export default function ClipFynLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="clipfyn-theme flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <AppHeader
        appName="ClipFyn"
        appSlug="clipfyn"
        logoSrc="/images/clipfyn/logo.png"
        tagline="Android Video Preparation"
        navLinks={[
          { label: "Overview", href: "/clipfyn" },
        ]}
        playStoreUrl="https://play.google.com/store/apps/details?id=com.minifyn.clipfyn"
        playStoreBadge
      />
      <main className="flex-1 flex flex-col">{children}</main>
      <AppFooter
        appName="ClipFyn"
        appSlug="clipfyn"
        logoSrc="/images/clipfyn/logo.png"
        tagline="On-device video preparation utility for Android. Inspects, crops, and formats videos with no server uploads."
        supportEmail="sylvesterdas.dev@gmail.com"
      />
    </div>
  );
}
