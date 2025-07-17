
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './lib/firebase-admin';
import { hasCompletedOnboarding } from './lib/data';

async function verifySession(cookie: string): Promise<string | null> {
    try {
        const decodedClaims = await auth.verifySessionCookie(cookie, true);
        return decodedClaims.uid;
    } catch (error) {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('session')?.value;

    // Define URLs to avoid constructing them multiple times
    const signinUrl = new URL('/auth/signin', request.url);
    const dashboardUrl = new URL('/dashboard', request.url);
    const onboardingUrl = new URL('/dashboard/onboarding', request.url);

    // Allow all non-page related files and API routes to pass through
    if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
        return NextResponse.next();
    }
    
    const uid = sessionCookie ? await verifySession(sessionCookie) : null;
    const isAuthenticated = !!uid;

    // If user is authenticated and tries to access an auth page, redirect to dashboard
    if (isAuthenticated && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
        return NextResponse.redirect(dashboardUrl);
    }

    // If user is NOT authenticated and tries to access any dashboard page, redirect to sign-in
    if (!isAuthenticated && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(signinUrl);
    }
    
    // If user IS authenticated and trying to access the dashboard
    if (isAuthenticated && pathname.startsWith('/dashboard')) {
        const onboardingComplete = await hasCompletedOnboarding(uid);

        // If onboarding is not complete, redirect to onboarding page
        if (!onboardingComplete && pathname !== '/dashboard/onboarding') {
            return NextResponse.redirect(onboardingUrl);
        }

        // If onboarding IS complete and they try to access it, redirect to main dashboard
        if (onboardingComplete && pathname === '/dashboard/onboarding') {
            return NextResponse.redirect(dashboardUrl);
        }
    }

    // For all other cases, allow the request to proceed
    return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
