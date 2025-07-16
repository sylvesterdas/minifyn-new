
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';
import { generateOgImage } from '@/ai/flows/generate-og-image-flow';

export const revalidate = 3600; // Cache for 1 hour

const OG_IMAGE_SECRET = process.env.OG_IMAGE_SECRET;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'MiniFyn';
  const description = searchParams.get('description') || 'The Ultimate Link Shortener';
  const tags = searchParams.get('tags'); // comma-separated

  try {
    // 1. Generate the AI background image
    const imageResult = await generateOgImage({ title: 'abstract background', tags: tags || 'modern, clean, digital, connection' });
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
                  fontSize: '96px',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                  textShadow: '3px 3px 10px rgba(0,0,0,0.7)',
             }}>
               {title}
             </h1>
             <p style={{
                    fontSize: '32px',
                    marginTop: '24px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
             }}>
                {description}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(`Failed to generate homepage OG image: ${e.message}`);
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
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
            <h1 style={{ fontSize: '96px', fontWeight: 900, lineHeight: 1 }}>{title}</h1>
            <p style={{ fontSize: '32px', marginTop: '24px', color: 'rgba(255, 255, 255, 0.85)' }}>{description}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
