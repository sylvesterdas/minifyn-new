
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignUpPageComponent } from './page-client';
import { Suspense } from 'react';

export default async function SignUpPage() {
    const { user } = await validateRequest();

    // If the user is already logged in and is not an anonymous user,
    // redirect them to the dashboard.
    if (user && !user.isAnonymous) {
        redirect('/dashboard');
    }

    // Wrap the client component in Suspense to handle search params
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpPageComponent />
        </Suspense>
    );
}
