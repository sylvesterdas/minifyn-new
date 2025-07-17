
'use server';

import { auth, db } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import type { FormState } from './signin/page';
import { sendEmail } from '@/lib/email';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { randomInt } from 'crypto';

function encodeEmail(email: string): string {
  return Buffer.from(email).toString('base64');
}

export async function login(
  idToken: string
): Promise<{error?: string, success?: boolean}> {
  try {
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(idToken, true);

    if (!decodedToken.email_verified) {
      return { error: 'Email not verified. Please check your inbox for a verification link.' };
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    const cookieStore = cookies();
    cookieStore.set('session', sessionCookie, {
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

export async function sendVerificationOtp(prevState: any, formData: FormData): Promise<{ success: boolean; error?: string, message?: string }> {
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
        await auth.getUserByEmail(email);
        return { success: false, error: 'This email address is already in use.' };
    } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
            return { success: false, error: 'An unexpected error occurred. Please try again.' };
        }
    }

    // Generate a 6-digit OTP
    const otp = randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    try {
        // Store OTP in the database
        await db.ref(`otp_verifications/${encodeEmail(email)}`).set({ otp, expiresAt });
        
        // Send OTP via email
        await sendEmail({
            to: email,
            subject: `Your MiniFyn Verification Code: ${otp}`,
            html: `
                <h1>Your MiniFyn Verification Code</h1>
                <p>Enter the following code to verify your email address and continue:</p>
                <h2 style="font-size: 24px; letter-spacing: 4px; text-align: center;">${otp}</h2>
                <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            `,
        });

        return { success: true, message: 'An OTP has been sent to your email.' };

    } catch (err) {
        console.error("Error in sendVerificationOtp:", err);
        return { success: false, error: 'Failed to send OTP. Please try again.' };
    }
}


export async function verifyOtpAndCreateUser(prevState: any, formData: FormData): Promise<{ success: boolean; idToken?: string; error?: string }> {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;

    if (!email || !otp || !name || !password) {
        return { success: false, error: 'Missing required fields.' };
    }

    try {
        const otpRef = db.ref(`otp_verifications/${encodeEmail(email)}`);
        const snapshot = await otpRef.once('value');
        const otpData = snapshot.val();

        if (!otpData || otpData.otp !== otp || Date.now() > otpData.expiresAt) {
            return { success: false, error: 'Invalid or expired OTP. Please try again.' };
        }

        // OTP is valid, create the user
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
            emailVerified: true, // Mark as verified since OTP was successful
        });

        await db.ref(`user_profiles/${userRecord.uid}`).set({
            name: userRecord.displayName,
            email: userRecord.email,
            termsAcceptedAt: Date.now(),
            createdAt: userRecord.metadata.creationTime,
            onboardingCompleted: true, // Skip multi-step onboarding
            plan: 'free', // Start as free, webhook will upgrade to pro
        });
        
        // Clean up the used OTP
        await otpRef.remove();
        
        // Create a custom token to sign in the user on the client
        const customToken = await auth.createCustomToken(userRecord.uid);

        return { success: true, idToken: customToken };
    } catch (error) {
        console.error("Error in verifyOtpAndCreateUser:", error);
        return { success: false, error: 'Failed to create account. Please try again.' };
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
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const termsAccepted = formData.get('terms-accepted');

  if (typeof name !== 'string' || name.length < 2) {
    return { error: 'Name must be at least 2 characters long.' };
  }
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
  if (termsAccepted !== 'on') {
    return { error: 'You must accept the Terms of Service to create an account.' };
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });
    
    await db.ref(`user_profiles/${userRecord.uid}`).set({
      name: userRecord.displayName,
      email: userRecord.email,
      termsAcceptedAt: Date.now(),
      createdAt: userRecord.metadata.creationTime,
      onboardingCompleted: true, // Skip multi-step onboarding now
      plan: 'free',
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


export async function logout(): Promise<{ success?: boolean, error?: string }> {
  const cookieObj = cookies();
  const sessionCookie = cookieObj.get('session')?.value;
  if (!sessionCookie) {
    return { success: true };
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    await auth.revokeRefreshTokens(decodedClaims.sub);
    cookieObj.delete('session');
    return { success: true };
  } catch (error) {
    console.warn("Could not revoke session cookie, it might be expired.", error);
    cookieObj.delete('session');
    return { success: true };
  }
}
