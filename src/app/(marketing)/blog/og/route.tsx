
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { generateOgImage } from '@/ai/flows/generate-og-image-flow';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const tags = searchParams.get('tags'); // comma-separated

  if (!title) {
    return new Response('Missing title parameter', { status: 400 });
  }

  try {
    // 1. Generate the AI background image
    const imageResult = await generateOgImage({ title, tags: tags || '' });
    const { imageUrl: aiBackgroundUrl } = imageResult;

    // 2. Use the generated image in the ImageResponse
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
            color: 'white',
            position: 'relative',
          }}
        >
          {/* AI-generated background image */}
          <img
            src={aiBackgroundUrl}
            alt=""
            tw="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div tw="absolute inset-0 w-full h-full bg-black/60" />

          {/* Centered content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 80px',
              position: 'relative', // Ensure content is above overlay
            }}
          >
             <h1 style={{
                  fontSize: '64px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
             }}>
               {title}
             </h1>
          </div>

          {/* Branding */}
            <div
                style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '24px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.8)',
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                }}
            >
                <span>MiniFyn</span>
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
    // Fallback to a simple image if AI fails
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
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', textAlign: 'center', padding: '0 80px' }}>
             <h1 style={{ fontSize: '64px', fontWeight: 700 }}>{title}</h1>
          </div>
           <div
                style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '24px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.8)',
                }}
            >
                <span>MiniFyn</span>
            </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
