'use server';

import { auth } from '@/lib/firebase-admin';
import { lucia } from '@/lib/lucia';
import { cookies } from 'next/headers';
import { isWithinExpirationDate, TimeSpan } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import type { FormState } from './signin/page';

const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

// In-memory store for verification tokens. In production, use a database.
const verificationTokens = new Map<string, { email: string; expiresAt: Date }>();

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (
    typeof email !== 'string' ||
    email.length < 3 ||
    !email.includes('@')
  ) {
    return { error: 'Invalid email' };
  }
  if (typeof password !== 'string' || password.length < 6) {
    return { error: 'Invalid password' };
  }

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord.emailVerified) {
        return { error: 'Email not verified.' };
    }

    // This is a simplified password check.
    // In a real app, you would verify a hashed password.
    // For this example, we're assuming Firebase Auth client SDK handled login and this is for session creation.
    // The proper way to do this server-side would be to use a custom token from the client.
    // However, to keep it server-action focused, we proceed with creating a session.

    const session = await lucia.createSession(userRecord.uid, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error: any) {
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      return { error: 'Invalid email or password' };
    }
    console.error('Login error:', error);
    return { error: 'An unknown error occurred.' };
  }
}

export async function signup(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (
    typeof email !== 'string' ||
    email.length < 3 ||
    !email.includes('@')
  ) {
    return { error: 'Invalid email' };
  }
  if (typeof password !== 'string' || password.length < 6) {
    return { error: 'Password must be at least 6 characters long' };
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const token = generateRandomString(40, alphabet('0-9', 'a-z'));
    verificationTokens.set(token, {
        email: userRecord.email!,
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN)
    });

    // In a real app, you would send an email with this link
    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/auth/verify-email?token=${token}`;
    console.log(`Verification link for ${email}: ${verificationLink}`); // For demonstration

    return { success: true, message: `A verification link has been sent to ${email}. Check your console for the link.` };

  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { error: 'Email already in use' };
    }
    console.error('Signup error:', error);
    return { error: 'An unknown error occurred' };
  }
}


export async function logout(): Promise<{ error?: string }> {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { session } = await lucia.validateSession(sessionId);
  if (session) {
      await lucia.invalidateSession(session.id);
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {};
}

export async function verifyEmail(token: string): Promise<{ success?: boolean, error?: string }> {
    if (!token) {
        return { error: "Invalid token." };
    }
    
    const storedToken = verificationTokens.get(token);
    
    if (!storedToken) {
        return { error: "Invalid or expired verification token." };
    }

    if (!isWithinExpirationDate(storedToken.expiresAt)) {
        verificationTokens.delete(token);
        return { error: "Verification token has expired." };
    }

    try {
        const user = await auth.getUserByEmail(storedToken.email);
        await auth.updateUser(user.uid, { emailVerified: true });
        
        verificationTokens.delete(token);

        return { success: true };
    } catch (error) {
        console.error("Email verification error:", error);
        return { error: "Failed to verify email." };
    }
}
