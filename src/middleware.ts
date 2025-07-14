import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isAuthenticated = !!sessionCookie;

  // Define URLs to avoid constructing them multiple times
  const signinUrl = new URL('/auth/signin', request.url);
  const dashboardUrl = new URL('/dashboard', request.url);

  // Allow all non-auth related static files and API routes to pass through
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // If user is authenticated and tries to access an auth page, redirect to dashboard
  if (isAuthenticated && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(dashboardUrl);
  }

  // If user is NOT authenticated and tries to access any dashboard page (except onboarding), redirect to sign-in
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(signinUrl);
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
