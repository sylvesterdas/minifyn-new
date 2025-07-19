
'use server';

import { auth, db } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import type { FormState } from './signup/page';
import { sendEmail } from '@/lib/email';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { UserPlan } from '@/lib/data';
import { setSessionCookie } from './cookie';

function encodeEmail(email: string): string {
  return Buffer.from(email).toString('base64');
}

export async function sendVerificationOtp(email: string): Promise<{ success: boolean; error?: string }> {
  if (typeof email !== 'string' || !email.includes('@')) {
    return { success: false, error: 'Invalid email' };
  }

  // Check if user already exists
  try {
    await auth.getUserByEmail(email);
    return { success: false, error: 'An account with this email already exists.' };
  } catch (error: any) {
    if (error.code !== 'auth/user-not-found') {
      console.error('Error checking user:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
    // User not found, which is good. We can proceed.
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  try {
    const encodedEmail = encodeEmail(email);
    await db.ref(`otps/${encodedEmail}`).set({ otp, expires, verified: false });

    const emailResult = await sendEmail({
      to: email,
      subject: 'Your MiniFyn Verification Code',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Use the code below to verify your email address.</p>
          <h2 style="font-size: 36px; letter-spacing: 8px; margin: 20px 0;">${otp}</h2>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      return { success: false, error: emailResult.error };
    }

    return { success: true };
  } catch (error) {
    console.error('OTP sending error:', error);
    return { success: false, error: 'Could not send verification code.' };
  }
}

export async function verifyOtp(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
    if (!email || !otp) {
        return { success: false, error: 'Email and OTP are required.' };
    }
    try {
        const encodedEmail = encodeEmail(email);
        const otpRef = db.ref(`otps/${encodedEmail}`);
        const snapshot = await otpRef.once('value');
        const otpData = snapshot.val();

        if (!otpData || otpData.otp !== otp) {
            return { success: false, error: 'Invalid or incorrect OTP.' };
        }

        if (Date.now() > otpData.expires) {
            return { success: false, error: 'Your OTP has expired. Please request a new one.' };
        }
        
        // Mark OTP as verified in the database
        await otpRef.update({ verified: true });
        return { success: true };
    } catch(error) {
        console.error('OTP verification error:', error);
        return { success: false, error: 'An unexpected error occurred during OTP verification.' };
    }
}


export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const termsAccepted = formData.get('terms-accepted') === 'on';

  if (!email || !password || !termsAccepted) {
    return { error: 'Missing required fields.' };
  }
  
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  try {
    // Check if the email was verified via OTP
    const encodedEmail = encodeEmail(email);
    const otpRef = db.ref(`otps/${encodedEmail}`);
    const snapshot = await otpRef.once('value');
    const otpData = snapshot.val();
    
    if (!otpData || otpData.verified !== true) {
        return { error: 'Email has not been verified.' };
    }
    
    // Email is verified, create user
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true, // OTP verification serves as email verification
    });

    await db.ref(`user_profiles/${userRecord.uid}`).set({
      name: email.split('@')[0],
      email: userRecord.email,
      termsAcceptedAt: Date.now(),
      createdAt: userRecord.metadata.creationTime,
      onboardingCompleted: true,
      plan: 'free',
    });
    
    // Clean up OTP
    await otpRef.remove();

    return { success: true, message: `Account for ${email} created successfully!` };

  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { error: 'Email already in use' };
    }
    console.error('Signup error:', error);
    return { error: 'An unknown error occurred during signup.' };
  }
}

export async function login(
  idToken: string
): Promise<{error?: string, success?: boolean}> {
  console.log('[Auth Action] Initiating login...');
  try {
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(idToken, true);
    console.log(`[Auth Action] ID token verified for UID: ${decodedToken.uid}`);

    if (!decodedToken.email_verified) {
      console.warn(`[Auth Action] Login failed for UID: ${decodedToken.uid}. Reason: Email not verified.`);
      return { error: 'Email not verified. Please check your inbox for a verification link.' };
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    console.log(`[Auth Action] Session cookie created for UID: ${decodedToken.uid}.`);
    
    await setSessionCookie(sessionCookie);
    console.log(`[Auth Action] Session cookie set for UID: ${decodedToken.uid}.`);

    return { success: true };
  } catch (error: any) {
    console.error('[Auth Action] Login error:', error);
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
        
        const emailResult = await sendEmail({
            to: email,
            subject: 'Verify Your Email Address for MiniFyn',
            html: `
                <h1>Welcome to MiniFyn!</h1>
                <p>Please click the link below to verify your email address and activate your account:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link will expire in 1 hour.</p>
            `,
        });

        if (!emailResult.success) {
            return { error: emailResult.error };
        }
        return { success: true, message: 'A new verification link has been sent to your email.' };
    } catch (error: any) {
        console.error('Resend verification link error:', error);
        return { error: 'Failed to send verification email. Please try again.' };
    }
}


export async function sendPasswordResetLink(
  prevState: any,
  formData: FormData
): Promise<any> {
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
            // Do not reveal if a user exists or not for security reasons.
        } else {
            console.error('Password reset error:', error);
            // Also, do not reveal the error to the user.
        }
    }
    
    return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
}


export async function logout(): Promise<{ success?: boolean, error?: string }> {
  const cookieObj = await cookies();
  const sessionCookie = cookieObj.get('session')?.value;
  if (!sessionCookie) {
    console.log('[Auth Action] Logout called, but no session cookie found. Assuming already logged out.');
    return { success: true };
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    console.log(`[Auth Action] Logging out UID: ${decodedClaims.sub}.`);
    await auth.revokeRefreshTokens(decodedClaims.sub);
    cookieObj.delete('session');
    console.log(`[Auth Action] Logout successful for UID: ${decodedClaims.sub}.`);
    return { success: true };
  } catch (error) {
    console.warn("[Auth Action] Could not revoke session cookie during logout, it might be expired.", error);
    cookieObj.delete('session'); // Delete the potentially invalid cookie anyway
    return { success: true };
  }
}
