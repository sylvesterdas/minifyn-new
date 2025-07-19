
import { NextResponse, type NextRequest } from 'next/server';
import { validateRequest } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { user } = await validateRequest();
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup');
    
    // If the user is logged in (and not anonymous), redirect them from auth pages to the dashboard.
    if (isAuthPage && user && !user.isAnonymous) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
}

// This config ensures the middleware runs on all pages except for static assets and API routes.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
