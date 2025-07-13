
import { ImageResponse } from 'next/og'

export async function GET(req: Request) {
  try {
    const { searchParams, host } = new URL(req.url)
    const title = searchParams.get('title')
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : [];
    
    const hue = Math.abs((title || '').split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)) % 360;

    const fontData = await fetch(
      new URL('https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2')
    ).then((res) => res.arrayBuffer());

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
            backgroundColor: `hsl(${hue}, 40%, 15%)`,
            color: 'white',
            fontFamily: '"Inter"',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2%, transparent 0%)',
              backgroundSize: '100px 100px',
              opacity: 0.5,
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '600',
          }}>
            {host}/blog
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '30px',
              padding: '80px',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                lineHeight: 1.1,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                letterSpacing: '-0.025em',
              }}
            >
              {title}
            </div>

            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {tags.slice(0, 3).map((tag) => (
                  <div
                    key={tag}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: '12px 24px',
                      borderRadius: '999px',
                      fontSize: 24,
                      fontWeight: 500,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            style: 'normal',
          },
        ]
      }
    )
  } catch (e: any) {
    console.error(`Failed to generate OG image: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
