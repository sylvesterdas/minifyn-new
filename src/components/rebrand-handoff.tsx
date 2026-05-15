'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

type RebrandHandoffProps = {
  destination: string;
  label: string;
};

export function RebrandHandoff({ destination, label }: RebrandHandoffProps) {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    const redirect = window.setTimeout(() => {
      window.location.assign(destination);
    }, 5000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [destination]);

  return (
    <main className="container mx-auto flex min-h-[70vh] items-center px-4 py-16 md:px-6">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border bg-card/70 p-8 text-center shadow-sm backdrop-blur md:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Product rebrand
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          LinkGuard is now ScamGuard: Link Checker
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          This page has moved to <span className="font-medium text-foreground">{label}</span>.
          You will be redirected in {seconds} second{seconds === 1 ? '' : 's'}.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link href={destination}>
              Go to ScamGuard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
