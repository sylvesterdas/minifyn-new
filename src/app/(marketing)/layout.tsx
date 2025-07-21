
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Suspense } from 'react';

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={null}>
        <Breadcrumbs />
      </Suspense>
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
