import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has('session');
  const dashboardUrl = new URL('/dashboard', request.url);
  const signinUrl = new URL('/auth/signin', request.url);

  // If user is authenticated...
  if (isAuthenticated) {
    // ...and they try to access sign-in or sign-up, redirect to dashboard
    if (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) {
      return NextResponse.redirect(dashboardUrl);
    }
  } 
  // If user is not authenticated...
  else {
    // ...and they try to access the dashboard, redirect to sign-in
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(signinUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
