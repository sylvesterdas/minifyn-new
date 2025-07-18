
'use server';

import { validateRequest } from '@/lib/auth';
import Razorpay from 'razorpay';
import { auth as adminAuth, db } from '@/lib/firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { setSessionCookie } from '../auth/cookie';
import { revalidatePath } from 'next/cache';

// Determine which set of keys and plans to use based on the environment
const isProduction = process.env.NODE_ENV === 'production';

const RAZORPAY_KEY_ID = isProduction 
    ? process.env.RAZORPAY_KEY_ID 
    : process.env.RAZORPAY_TEST_KEY_ID;

const RAZORPAY_KEY_SECRET = isProduction 
    ? process.env.RAZORPAY_KEY_SECRET 
    : process.env.RAZORPAY_TEST_KEY_SECRET;

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID!,
    key_secret: RAZORPAY_KEY_SECRET!,
});

// These IDs would be created on the Razorpay Dashboard for both test and live modes
const PLAN_IDS = {
    monthly: isProduction 
        ? process.env.RAZORPAY_MONTHLY_PLAN_ID 
        : process.env.RAZORPAY_TEST_MONTHLY_PLAN_ID,
    yearly: isProduction 
        ? process.env.RAZORPAY_YEARLY_PLAN_ID 
        : process.env.RAZORPAY_TEST_YEARLY_PLAN_ID,
};

interface CreateSubscriptionResponse {
    subscriptionId: string;
    amount: number;
    currency: string;
}

export async function createRazorpaySubscription(
    planType: 'monthly' | 'yearly',
    idToken?: string
): Promise<{ error: string } | CreateSubscriptionResponse> {
    let userData: { uid: string, email?: string, name?: string } | null = null;
    console.log('[Payment Action] Starting subscription creation...');

    if (idToken) {
        try {
            // Verify the ID token passed from the client
            const decodedToken: DecodedIdToken = await adminAuth.verifyIdToken(idToken);
            userData = { uid: decodedToken.uid, email: decodedToken.email, name: decodedToken.name };
            console.log(`[Payment Action] Verified user via ID token: ${userData.uid}`);
        } catch(e) {
            console.error("[Payment Action] Failed to verify ID token during subscription:", e);
            return { error: 'Invalid authentication token provided.' };
        }
    } else {
        // Fallback to session cookie if no token is provided (for existing users upgrading)
        const { user } = await validateRequest();
        if (!user) {
            console.warn('[Payment Action] User must be logged in to subscribe.');
            return { error: 'You must be logged in to subscribe.' };
        }
        userData = { uid: user.uid, email: user.email, name: user.name };
        console.log(`[Payment Action] Verified user via session cookie: ${userData.uid}`);
    }

    if (!userData) {
        console.error('[Payment Action] Authentication failed, could not get user data.');
        return { error: 'Authentication failed.' };
    }
    
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        console.error("[Payment Action] Razorpay keys are not configured for the current environment.");
        return { error: 'Payment service is currently unavailable.' };
    }
    
    if (planType !== 'monthly' && planType !== 'yearly') {
        return { error: 'Invalid plan type selected.' };
    }

    const planId = PLAN_IDS[planType];
    if (!planId) {
        console.error(`[Payment Action] Razorpay plan ID for '${planType}' is not configured for the current environment.`);
        return { error: 'The selected plan is currently unavailable.' };
    }
    
    try {
        const options = {
            plan_id: planId,
            customer_notify: 1,
            total_count: planType === 'monthly' ? 12 : 1, // 12 monthly payments or 1 yearly
            notes: {
                userId: userData.uid,
                email: userData.email || '',
                name: userData.name || '',
            },
        };
        
        console.log(`[Payment Action] Creating Razorpay subscription for user ${userData.uid} with plan ${planId}.`);
        const subscription = await razorpay.subscriptions.create(options);
        const planDetails = await razorpay.plans.fetch(planId);
        
        console.log(`[Payment Action] Successfully created Razorpay subscription ${subscription.id} for user ${userData.uid}.`);
        return {
            subscriptionId: subscription.id,
            amount: planDetails.item.amount,
            currency: planDetails.item.currency,
        };
    } catch (error) {
        console.error('[Payment Action] Error creating Razorpay subscription:', error);
        return { error: 'Could not create a subscription. Please try again.' };
    }
}

type SyncResult = 
  | { success: true; sessionCookie?: string; }
  | { success: false; error: string };

export async function syncRazorpaySubscription(
    idToken?: string
): Promise<SyncResult> {
    let uid: string;
    let email: string | undefined;

    if (idToken) {
        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            uid = decodedToken.uid;
            email = decodedToken.email;
        } catch (e) {
            return { success: false, error: 'Invalid authentication token.' };
        }
    } else {
        const { user } = await validateRequest();
        if (!user) {
            return { success: false, error: 'You must be logged in.' };
        }
        uid = user.uid;
        email = user.email;
    }
    
    if (!email) {
        return { success: false, error: 'User email not found.' };
    }
    
    console.log(`[syncRazorpay] Starting subscription sync for user: ${uid} (email: ${email})`);

    try {
        let userSubscription = null;
        let skip = 0;
        const count = 100; // Fetch 100 items per page
        let hasMore = true;
        
        const proPlanIds = [PLAN_IDS.monthly, PLAN_IDS.yearly].filter(Boolean);
        const validStatuses = ['active', 'completed'];

        while (hasMore && !userSubscription) {
            const subscriptions = await razorpay.subscriptions.all({ count, skip });
            
            if (subscriptions.items) {
                userSubscription = subscriptions.items.find(sub => 
                    sub.notes?.email === email && 
                    validStatuses.includes(sub.status) &&
                    proPlanIds.includes(sub.plan_id)
                ) || null;
            }

            if (!subscriptions.items || subscriptions.items.length < count) {
                hasMore = false;
            } else {
                skip += count;
            }
        }

        if (userSubscription) {
            console.log(`[syncRazorpay] Found valid subscription ${userSubscription.id} (Plan: ${userSubscription.plan_id}, Status: ${userSubscription.status}) for user with email ${email}.`);
            const userProfileRef = db.ref(`user_profiles/${uid}`);
            
            await userProfileRef.update({ 
                plan: 'pro', 
                onboardingCompleted: true,
                subscription: {
                    id: userSubscription.id,
                    status: userSubscription.status,
                    planId: userSubscription.plan_id,
                    current_start: userSubscription.current_start,
                    current_end: userSubscription.current_end,
                    ended_at: userSubscription.ended_at || null,
                }
            });
            await adminAuth.setCustomUserClaims(uid, { plan: 'pro' });
            
            // Generate a new session cookie with the updated claims
            const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
            
            // Create a session cookie from the provided ID token if it exists.
            // This is crucial for the signup flow.
            if (idToken) {
                const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
                console.log(`[syncRazorpay] User ${uid} plan restored/updated to Pro. New session cookie created from ID token.`);
                return { success: true, sessionCookie: sessionCookie };
            }
            
            // For other flows (like restore purchase), just confirm success.
            // The client can then reload to get the new state.
            console.log(`[syncRazorpay] User ${uid} plan restored/updated to Pro. No new session cookie requested.`);
            return { success: true };

        } else {
             console.log(`[syncRazorpay] No active or completed Pro subscription found for user ${uid} (email: ${email}).`);
            return { success: false, error: 'We could not find an active Pro subscription associated with your account.' };
        }

    } catch (error) {
        console.error(`Error during manual subscription sync for user ${uid}:`, error);
        return { success: false, error: 'An unexpected error occurred while checking your subscription status.' };
    }
}

export async function getSubscriptionDetails(): Promise<{ subscription: any | null; error?: string }> {
    const { user } = await validateRequest();
    if (!user) {
        return { subscription: null, error: 'Unauthorized' };
    }

    try {
        const userProfileRef = db.ref(`user_profiles/${user.uid}/subscription`);
        const snapshot = await userProfileRef.once('value');
        const subData = snapshot.val();

        if (!subData || !subData.id) {
            return { subscription: null };
        }

        const subscription = await razorpay.subscriptions.fetch(subData.id);
        return { subscription };
    } catch (error) {
        console.error('Failed to fetch subscription details:', error);
        return { subscription: null, error: 'Could not retrieve subscription details.' };
    }
}

export async function cancelRazorpaySubscription(): Promise<{ success: boolean; subscription?: any; error?: string }> {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const userProfileRef = db.ref(`user_profiles/${user.uid}/subscription`);
        const snapshot = await userProfileRef.once('value');
        const subData = snapshot.val();

        if (!subData || !subData.id) {
            return { success: false, error: 'No active subscription found to cancel.' };
        }

        // Cancel at the end of the billing cycle
        const cancelledSubscription = await razorpay.subscriptions.cancel(subData.id);

        // Update our DB to reflect the cancellation
        await userProfileRef.update({
            status: cancelledSubscription.status,
            ended_at: cancelledSubscription.end_at,
        });

        revalidatePath('/dashboard/settings/billing');

        return { success: true, subscription: cancelledSubscription };
    } catch (error) {
        console.error('Failed to cancel subscription:', error);
        return { success: false, error: 'Could not cancel the subscription. Please contact support.' };
    }
}
