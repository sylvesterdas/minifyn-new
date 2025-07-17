
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('session');

    const isAuthenticated = !!sessionCookie;

    // Protected dashboard routes
    const isDashboardRoute = pathname.startsWith('/dashboard');
    // Public auth routes
    const isAuthRoute = pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup') || pathname.startsWith('/auth/forgot-password');

    // If user is not authenticated and tries to access a protected dashboard route, redirect to signin
    if (!isAuthenticated && isDashboardRoute) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // If user is authenticated and tries to access a public auth page, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow all other requests to proceed
    return NextResponse.next();
}

// This config ensures the middleware runs on all pages except for static assets and API routes.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
