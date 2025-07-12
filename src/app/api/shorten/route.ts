import { NextRequest, NextResponse } from 'next/server';
import { urlSchema } from '@/lib/schema';
import { createShortLink, validateApiKey, checkRateLimit, incrementUsage } from '@/lib/data';

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1. Validate API Key and get user
        const user = await validateApiKey(token);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Check rate limits for the user
        // Assuming API users are always verified and have higher limits, but we can check anyway
        const isAllowed = await checkRateLimit(user.uid);
        if (!isAllowed) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        // 3. Parse and validate request body
        const body = await request.json();
        const validatedFields = urlSchema.safeParse({ longUrl: body.url });

        if (!validatedFields.success) {
            const errors = validatedFields.error.flatten().fieldErrors;
            const errorMessage = errors.longUrl?.[0] || 'Please enter a valid URL.';
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        const { longUrl } = validatedFields.data;

        // 4. Create the short link
        const newLink = await createShortLink({ 
            longUrl, 
            userId: user.uid, 
            isVerifiedUser: true // API users must be verified
        });

        // 5. Increment usage
        await incrementUsage(user.uid);

        // 6. Return success response
        const host = 'mnfy.in';
        const shortUrl = `https://${host}/${newLink.id}`;
        
        return NextResponse.json({
            message: 'URL shortened successfully',
            shortUrl: shortUrl,
        });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Only log unexpected errors
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
