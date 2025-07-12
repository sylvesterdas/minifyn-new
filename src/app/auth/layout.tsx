import { Footer } from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <Image src="/logo.png" alt="MiniFyn Logo" width={32} height={32} />
          <span className="font-bold text-lg">MiniFyn</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
