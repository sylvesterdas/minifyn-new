'use server';

import { auth } from '@/lib/firebase-admin';
import { lucia } from '@/lib/lucia';
import { cookies } from 'next/headers';
import type { FormState } from './signin/page';
import { redirect } from 'next/navigation';
import { sendEmail } from '@/lib/email';
import { DecodedIdToken } from 'firebase-admin/auth';

export async function login(
  idToken: string
): Promise<{error?: string, success?: boolean}> {
  try {
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(idToken);

    if (!decodedToken.email_verified) {
      return { error: 'Email not verified.' };
    }

    const session = await lucia.createSession(decodedToken.uid, {
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
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
        
        console.log(`VERIFICATION LINK (for testing): In a real app, this link would be sent in an email. For development, you can use this link to verify the email: ${verificationLink}`);
        
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

    console.log(`VERIFICATION LINK (for testing): In a real app, this link would be sent in an email. For development, you can use this link to verify the email: ${verificationLink}`);

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

        console.log(`PASSWORD RESET LINK (for testing): In a real app, this link would be sent in an email. For development, you can use this link to reset the password: ${link}`);

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
  
  redirect('/auth/signin');
}
