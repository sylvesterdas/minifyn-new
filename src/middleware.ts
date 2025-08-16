
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    return NextResponse.next();
}

// This config ensures the middleware runs on all pages except for static assets and API routes.
export const config = {
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.svg (favicon file)
     * - ads.txt (ads file)
     */
     // By matching an unused path, we effectively disable the middleware from interfering with any page routes.
    matcher: ['/api/auth/none'],
};
