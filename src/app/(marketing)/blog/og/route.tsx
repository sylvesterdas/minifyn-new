import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

// This route no longer needs the Edge runtime.
// The default Node.js runtime is more flexible for this task.

// Example: /blog/og?title=Hello%20World
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return new Response('Missing title parameter', { status: 400 });
  }

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a', // dark-grey
            color: '#e2e8f0', // light-grey
          }}
        >
          <div style={{
              display: 'flex',
              textAlign: 'center',
              padding: '0 80px',
          }}>
             <h1 style={{
                  fontSize: '64px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  background: 'linear-gradient(to right, #3b82f6, #1e40af)',
                  // Since we are not in Tailwind, we need vendor prefixes for broader browser support
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
             }}>
               {title}
             </h1>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(`Failed to generate OG image: ${e.message}`);
    return new Response('Failed to generate image', { status: 500 });
  }
}
