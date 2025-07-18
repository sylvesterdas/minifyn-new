
'use server';

import { cookies } from 'next/headers';

export async function setSessionCookie(sessionCookie: string) {
    const cookieStore = await cookies();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    
    cookieStore.set('session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn,
        path: '/',
    });
}
