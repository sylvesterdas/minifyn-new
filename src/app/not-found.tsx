
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Link2Off } from 'lucide-react';
import { Suspense } from 'react'; // Import Suspense

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Wrap with Suspense */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-br from-background to-slate-900/50">
        <Link2Off className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-5xl font-bold text-primary">404 - Link Not Found</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          This link may have been deleted, expired, or maybe the slug is just a typo. Please check the link and try again.
        </p>
        <Button asChild className="mt-8 font-semibold">
          <Link href="/">Create a new link</Link>
        </Button>
      </div>
    </Suspense> // Close Suspense boundary
  );
}
