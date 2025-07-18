
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Middleware logic is currently disabled as per user request.
    return NextResponse.next();
}

// This config ensures the middleware runs on all pages except for static assets and API routes.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
