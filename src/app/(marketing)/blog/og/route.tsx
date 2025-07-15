import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Example: /blog/og?title=Hello%20World
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return new Response('Missing title parameter', { status: 400 });
  }

  // Fonts
  const interRegular = await fetch(new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZ9hjg.woff2')).then(res => res.arrayBuffer());
  const interBold = await fetch(new URL('https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2')).then(res => res.arrayBuffer());
  
  // In a real app, this would be a public URL or a data URI.
  // For this context, we will fetch it from the public folder.
  const logoUrl = new URL('/logo.png', request.url).toString();
  const logoData = await fetch(logoUrl).then(res => res.arrayBuffer());

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
            {/* Using img tag here because Next/Image is not supported in this context */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="MiniFyn Logo" src={logoData as any} width="48" height="48" />
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
}
