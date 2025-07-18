
import { NextResponse, type NextRequest } from 'next/server';
import { validateRequest } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { user } = await validateRequest();
    const { pathname } = request.nextUrl;

    const isDashboardRoute = pathname.startsWith('/dashboard');
    const isAuthRoute = pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup') || pathname.startsWith('/auth/forgot-password');

    // If the user is anonymous and trying to access a protected dashboard route, redirect to sign-in.
    if (user?.isAnonymous && isDashboardRoute) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // If a non-anonymous (fully authenticated) user tries to access a sign-in/sign-up page, redirect to the dashboard.
    if (user && !user.isAnonymous && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If there is no user session at all and they try to access the dashboard, redirect to sign-in.
    if (!user && isDashboardRoute) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    // Allow all other requests to proceed.
    return NextResponse.next();
}

// This config ensures the middleware runs on all pages except for static assets and API routes.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
