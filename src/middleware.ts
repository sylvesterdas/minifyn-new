
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    return NextResponse.next();
}

// By removing the config object, this middleware will no longer run on any path,
// resolving the 404 error caused by an incorrect matcher.
export const config = {
    matcher: [],
};
