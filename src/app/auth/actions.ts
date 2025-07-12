'use server';

import { auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import type { FormState } from './signin/page';
import { redirect } from 'next/navigation';
import { sendEmail } from '@/lib/email';
import { DecodedIdToken } from 'firebase-admin/auth';

export async function login(
  idToken: string
): Promise<{error?: string, success?: boolean}> {
  try {
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(idToken, true);

    if (!decodedToken.email_verified) {
      return { error: 'Email not verified.' };
    }

    // Session cookie will be valid for 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    const cookieObj = await cookies()

    cookieObj.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.code === 'auth/id-token-expired') {
        return { error: 'Session expired, please sign in again.' };
    }
    return { error: 'An unknown error occurred during login.' };
  }
}

export async function resendVerificationLink(prevState: any, formData: FormData): Promise<{ success?: boolean; message?: string; error?: string }> {
    const email = formData.get('email');
    if (typeof email !== 'string' || !email.includes('@')) {
        return { error: 'Invalid email provided.' };
    }

    try {
        const userRecord = await auth.getUserByEmail(email);
        const verificationLink = await auth.generateEmailVerificationLink(userRecord.email!);
        
        await sendEmail({
            to: email,
            subject: 'Verify Your Email Address for MiniFyn',
            html: `
                <h1>Welcome to MiniFyn!</h1>
                <p>Please click the link below to verify your email address and activate your account:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link will expire in 1 hour.</p>
            `,
        });
        return { success: true, message: 'A new verification link has been sent to your email.' };
    } catch (error: any) {
        console.error('Resend verification link error:', error);
        return { error: 'Failed to send verification email. Please try again.' };
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
    
    const verificationLink = await auth.generateEmailVerificationLink(userRecord.email!);

    await sendEmail({
        to: email,
        subject: 'Welcome to MiniFyn! Please Verify Your Email',
        html: `
            <h1>Welcome to MiniFyn!</h1>
            <p>Thanks for signing up. Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">Verify Your Email</a>
            <p>This link will expire in 1 hour.</p>
        `,
    });


    return { success: true, message: `A verification link has been sent to ${email}.` };

  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { error: 'Email already in use' };
    }
    console.error('Signup error:', error);
    return { error: 'An unknown error occurred' };
  }
}

export async function sendPasswordResetLink(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
    const email = formData.get('email');
    if (typeof email !== 'string' || !email.includes('@')) {
        return { error: 'Please enter a valid email address.' };
    }

    try {
        await auth.getUserByEmail(email); 
        const link = await auth.generatePasswordResetLink(email);

        await sendEmail({
            to: email,
            subject: 'Reset Your MiniFyn Password',
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested a password reset for your MiniFyn account. Click the link below to set a new password:</p>
                <a href="${link}">Reset Password</a>
                <p>If you didn't request this, you can safely ignore this email.</p>
            `,
        });

    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
        } else {
            console.error('Password reset error:', error);
        }
    }
    
    return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
}


export async function logout(): Promise<{ error?: string }> {
  const cookieObj = await cookies()
  const sessionCookie = cookieObj.get('session')?.value;
  if (!sessionCookie) {
    redirect('/auth/signin');
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    await auth.revokeRefreshTokens(decodedClaims.sub);
    cookieObj.delete('session');
  } catch (error) {
    // Cookie is invalid. Just delete it.
    cookieObj.delete('session');
  }
  
  redirect('/auth/signin');
}
