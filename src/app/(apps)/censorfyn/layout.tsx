import { AppHeader } from '@/components/app-shell/app-header';
import { AppFooter } from '@/components/app-shell/app-footer';

export default function CensorFynLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <AppHeader
        appName="CensorFyn"
        appSlug="censorfyn"
        logoSrc="/images/censorfyn/logo_transparent.png"
        tagline="100% Offline Media Redaction"
        navLinks={[
          { label: "Features", href: "/censorfyn#features" },
          { label: "Screenshots", href: "/censorfyn#screenshots" },
          { label: "Privacy & Security", href: "/censorfyn#security" },
        ]}
        playStoreUrl="https://play.google.com/apps/testing/com.minifyn.censorfyn"
      />
      <main className="flex-1 flex flex-col">{children}</main>
      <AppFooter
        appName="CensorFyn"
        appSlug="censorfyn"
        logoSrc="/images/censorfyn/logo_transparent.png"
        tagline="100% Offline, on-device AI media redaction and sanitization app. Overwrites pixels with zero server uploads."
        supportEmail="sylvesterdas.dev@gmail.com"
        playStoreUrl="https://play.google.com/store/apps/details?id=com.minifyn.censorfyn"
        closedTestUrl="https://play.google.com/apps/testing/com.minifyn.censorfyn"
      />
    </div>
  );
}
