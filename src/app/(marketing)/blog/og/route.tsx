
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';
import { generateOgImage } from '@/ai/flows/generate-og-image-flow';
import fs from 'fs/promises';
import path from 'path';

export const revalidate = 3600; // Cache for 1 hour

// Helper to read files from the public directory
const getAsset = async (assetPath: string) => {
  const filePath = path.join(process.cwd(), assetPath);
  try {
    const asset = await fs.readFile(filePath);
    return asset;
  } catch (error) {
    console.error(`Error reading asset ${assetPath}:`, error);
    return null;
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const tags = searchParams.get('tags'); // comma-separated

  if (!title) {
    return new Response('Missing title parameter', { status: 400 });
  }

  try {
    // 1. Generate the AI background image in parallel with fetching local assets
    const [imageResult, logoBuffer] = await Promise.all([
        generateOgImage({ title, tags: tags || '' }),
        getAsset('public/logo.png')
    ]);

    const { imageUrl: aiBackgroundUrl } = imageResult;

    if (!logoBuffer) {
        throw new Error('Could not load logo asset.');
    }

    // Convert logo buffer to data URI
    const logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;

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
          
           {/* Logo at the bottom */}
          <div tw="absolute bottom-10 left-10 flex items-center" style={{ position: 'absolute', left: 40, bottom: 40, display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} alt="Logo" tw="h-10 w-10 mr-4" />
            <span style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>MiniFyn.com</span>
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
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
