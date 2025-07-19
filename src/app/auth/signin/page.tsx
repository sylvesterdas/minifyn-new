
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignInPageComponent } from './page-client';

export default async function SignInPage() {
    const { user } = await validateRequest();

    // If the user is already logged in and is not an anonymous user,
    // redirect them to the dashboard.
    if (user && !user.isAnonymous) {
        redirect('/dashboard');
    }

    // Otherwise, render the client component for signing in.
    return <SignInPageComponent />;
}
