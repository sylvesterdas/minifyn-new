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
        const user = await validateApiKey(token);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const isVerifiedUser = true;

        const isAllowed = await checkRateLimit(user.uid, isVerifiedUser, true);
        if (!isAllowed) {
            return NextResponse.json({ error: 'Daily limit of 20 URLs reached. Please try again tomorrow.' }, { status: 429 });
        }

        const body = await request.json();
        const validatedFields = await urlSchema.safeParseAsync({ longUrl: body.url });

        if (!validatedFields.success) {
            const errors = validatedFields.error.flatten().fieldErrors;
            const errorMessage = errors.longUrl?.[0] || 'Please enter a valid URL.';
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        const { longUrl } = validatedFields.data;

        const newLink = await createShortLink({ 
            longUrl, 
            userId: user.uid, 
            isVerifiedUser: isVerifiedUser 
        });

        await incrementUsage(user.uid, true);

        const host = process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'mnfy.in';
        const shortUrl = `https://${host}/${newLink.id}`;
        
        return NextResponse.json({
            message: 'URL shortened successfully',
            shortUrl: shortUrl,
        });

    } catch (error) {
        if (error instanceof Error && (error.message.includes('invalid-credential') || error.message.includes('Unauthorized'))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
