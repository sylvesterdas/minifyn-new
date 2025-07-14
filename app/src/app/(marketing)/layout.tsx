// This layout is now handled by the root layout at src/app/layout.tsx
// This file can be removed, but we'll keep it to avoid breaking changes in the project structure.
export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
