import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import * as fs from 'fs/promises';
import * as path from 'path';

export const runtime = 'edge';

// Helper to read files from the project root
const getAsset = async (...paths: string[]) => {
  const assetPath = path.join(process.cwd(), ...paths);
  try {
    const asset = await fs.readFile(assetPath);
    return asset;
  } catch (e) {
    // In a deployed environment, path might be different.
    // Try resolving from /var/task/ which is common in Vercel Edge Functions
    const deployedAssetPath = path.join('/var/task', ...paths);
    return await fs.readFile(deployedAssetPath);
  }
}

// Example: /blog/og?title=Hello%20World
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return new Response('Missing title parameter', { status: 400 });
  }

  // Fetch assets in parallel for performance
  const [interRegular, interBold, logoData] = await Promise.all([
    getAsset('public', 'fonts', 'Inter-Regular.ttf'),
    getAsset('public', 'fonts', 'Inter-Bold.ttf'),
    getAsset('public', 'logo.png')
  ]);

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
