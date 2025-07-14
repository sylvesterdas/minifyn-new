import { NextResponse, type NextRequest } from 'next/server';
import { hasCompletedOnboarding } from './lib/data';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isAuthenticated = !!sessionCookie;

  // Define URLs to avoid constructing them multiple times
  const signinUrl = new URL('/auth/signin', request.url);
  const dashboardUrl = new URL('/dashboard', request.url);
  const onboardingUrl = new URL('/dashboard/onboarding', request.url);

  // Allow all non-auth related static files and API routes to pass through
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // If user is authenticated
  if (isAuthenticated) {
    // If they are on an auth page (signin/signup), redirect to dashboard
    if (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) {
      return NextResponse.redirect(dashboardUrl);
    }
    
    // This is a placeholder for a real check
    const uid = request.cookies.get('uid_placeholder')?.value;

    // Check for onboarding completion for users trying to access the dashboard
    if (uid && pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/onboarding')) {
      const isOnboarded = await hasCompletedOnboarding(uid);
      if (!isOnboarded) {
        return NextResponse.redirect(onboardingUrl);
      }
    }
    // If user is already on the onboarding page, let them stay.
    if (pathname.startsWith('/dashboard/onboarding')) {
       return NextResponse.next();
    }
  } 
  // If user is NOT authenticated
  else {
    // And tries to access any dashboard page, redirect to sign-in
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(signinUrl);
    }
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
