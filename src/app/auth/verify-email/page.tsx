import Link from 'next/link';
import { verifyEmail } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface VerifyEmailPageProps {
  searchParams: {
    token?: string;
  };
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = searchParams;
  const result = await verifyEmail(token || '');

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {result.success ? 'Your email has been successfully verified.' : 'There was an issue verifying your email.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {result.success ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive" />
          )}
          <p className="text-muted-foreground text-center">
            {result.success ? 'You can now sign in to your account.' : result.error}
          </p>
          <Button asChild>
            <Link href="/auth/signin">Go to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
