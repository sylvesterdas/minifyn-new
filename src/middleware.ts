import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // This is a simplified check. For a real app, use `validateRequest` from `@/lib/auth`.
  const isAuthenticated = request.cookies.has('lucia_session');

  if (protectedRoutes.includes(pathname) && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
