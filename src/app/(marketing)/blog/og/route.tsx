import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';

// Helper to fetch assets from the public folder in an Edge-compatible way
const getAsset = async (req: NextRequest, path: string) => {
  const url = new URL(path, req.nextUrl.origin);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${url}`);
  }
  return response.arrayBuffer();
};

// Example: /blog/og?title=Hello%20World
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return new Response('Missing title parameter', { status: 400 });
  }

  try {
    // Fetch assets in parallel for performance
    const [interRegular, interBold, logoData] = await Promise.all([
      getAsset(request, '/fonts/Inter-Regular.ttf'),
      getAsset(request, '/fonts/Inter-Bold.ttf'),
      getAsset(request, '/logo.png')
    ]);

    // Convert logo data to a data URI for embedding in the image
    const logoBase64 = Buffer.from(logoData).toString('base64');
    const logoSrc = `data:image/png;base64,${logoBase64}`;

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
            fontFamily: '"Inter"',
          }}
        >
          <div style={{
              position: 'absolute',
              top: '40px',
              left: '60px',
              display: 'flex',
              alignItems: 'center',
          }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="MiniFyn Logo" src={logoSrc} width="48" height="48" />
              <span style={{ marginLeft: '12px', fontSize: '32px', fontWeight: 600 }}>MiniFyn</span>
          </div>
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
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
             }}>
               {title}
             </h1>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interRegular,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter',
            data: interBold,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (e: any) {
    console.error(`Failed to generate OG image: ${e.message}`);
    return new Response('Failed to generate image', { status: 500 });
  }
}
