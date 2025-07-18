import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

// This is the secret token that your webhook caller (e.g., Hashnode) will need to send.
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN;

/**
 * API route to handle on-demand revalidation.
 * When called by a service like Hashnode's webhooks after a post is published,
 * this will invalidate the cache for the specified path.
 *
 * To trigger this: POST /api/revalidate?secret=YOUR_TOKEN
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // 1. Check for the secret token
  if (!REVALIDATION_TOKEN) {
    console.error('REVALIDATION_TOKEN is not set in environment variables.');
    return NextResponse.json({ message: 'Revalidation service is not configured.' }, { status: 500 });
  }

  if (secret !== REVALIDATION_TOKEN) {
    console.warn('Invalid revalidation token received.');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
  
  // 2. Revalidate the blog listing page
  try {
    const path = '/blog';
    revalidatePath(path);
    console.log(`Revalidation triggered successfully for path: ${path}`);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error('Error during revalidation:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
