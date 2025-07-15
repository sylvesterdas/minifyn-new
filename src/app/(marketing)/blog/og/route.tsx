import { NextRequest, NextResponse } from 'next/server';
import { generateBlogCover } from '@/ai/flows/generate-blog-cover-flow';

// Example: /blog/og?title=Hello%20World
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  if (!title) {
    return new NextResponse('Missing title parameter', { status: 400 });
  }

  try {
    const { imageUrl } = await generateBlogCover({ title });
    
    // The imageUrl is a data URI like 'data:image/png;base64,iVBORw0KGgo...'
    // We need to extract the base64 part and convert it to a Buffer.
    const base64Data = imageUrl.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid data URI format from AI service.');
    }

    const imageBuffer = Buffer.from(base64Data, 'base64');

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error(`Failed to generate OG image for title "${title}":`, error);
    return new NextResponse('Failed to generate image', { status: 500 });
  }
}
