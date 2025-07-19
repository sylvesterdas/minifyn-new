
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
            const decodedToken: DecodedIdToken = await adminAuth.verifyIdToken(idToken);
            userData = { uid: decodedToken.uid, email: decodedToken.email, name: decodedToken.name };
            console.log(`[Payment Action] Verified user via ID token: ${userData.uid}`);
        } catch(e) {
            console.error("[Payment Action] Failed to verify ID token during subscription:", e);
            return { error: 'Invalid authentication token provided.' };
        }
    } else {
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
            total_count: planType === 'monthly' ? 36 : 3, // 36 monthly payments or 3 yearly
            notes: {
                userId: userData.uid,
                email: userData.email || '',
                name: userData.name || '',
            },
        };
        
        console.log(`[Payment Action] Creating Razorpay subscription for user ${userData.uid} with plan ${planId}.`);
        const subscription = await razorpay.subscriptions.create(options);
        const planDetails = await razorpay.plans.fetch(planId);
        
        // **Store the subscription ID in our database immediately.**
        await db.ref(`user_profiles/${userData.uid}/subscription`).set({
            id: subscription.id,
            planId: subscription.plan_id,
            status: 'created', // Initial status
        });
        
        console.log(`[Payment Action] Successfully created and stored Razorpay subscription ${subscription.id} for user ${userData.uid}.`);
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
        const userProfileRef = db.ref(`user_profiles/${uid}`);
        const subIdSnapshot = await userProfileRef.child('subscription/id').once('value');
        const subscriptionId = subIdSnapshot.val();

        if (!subscriptionId) {
            console.log(`[syncRazorpay] No subscription ID found in DB for user ${uid}.`);
            return { success: false, error: 'Could not find a subscription reference for your account.' };
        }
        
        console.log(`[syncRazorpay] Found subscription ID ${subscriptionId} for user ${uid}. Fetching from Razorpay.`);
        
        const subscriptionDetails = await razorpay.subscriptions.fetch(subscriptionId);
        
        const validStatuses = ['active', 'completed'];

        if (subscriptionDetails && validStatuses.includes(subscriptionDetails.status)) {
            console.log(`[syncRazorpay] Found valid subscription ${subscriptionDetails.id} (Plan: ${subscriptionDetails.plan_id}, Status: ${subscriptionDetails.status}) for user ${uid}.`);
            
            const subscriptionData = {
                id: subscriptionDetails.id,
                status: subscriptionDetails.status,
                planId: subscriptionDetails.plan_id,
                current_start: subscriptionDetails.current_start,
                current_end: subscriptionDetails.current_end,
                ended_at: subscriptionDetails.ended_at || null,
            };

            await userProfileRef.update({ 
                plan: 'pro', 
                onboardingCompleted: true,
                subscription: subscriptionData,
            });
            await adminAuth.setCustomUserClaims(uid, { plan: 'pro' });
            
            if (idToken) {
                const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
                const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
                console.log(`[syncRazorpay] User ${uid} plan restored/updated to Pro. New session cookie created from ID token.`);
                return { success: true, sessionCookie };
            }
            
            console.log(`[syncRazorpay] User ${uid} plan restored/updated to Pro. No new session cookie requested.`);
            return { success: true };

        } else {
             console.log(`[syncRazorpay] Subscription ${subscriptionId} for user ${uid} is not active or completed. Status: ${subscriptionDetails?.status}.`);
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

        // Return the locally stored subscription data instead of fetching from Razorpay each time.
        // The source of truth is updated via webhooks or manual sync.
        return { subscription: subData };
    } catch (error) {
        console.error('Failed to fetch subscription details:', error);
        return { subscription: null, error: 'Could not retrieve subscription details.' };
    }
}


export async function cancelRazorpaySubscription(): Promise<{ success: boolean; subscription?: any; error?: string }> {
    const { user } = await validateRequest();
    if (!user) {
        console.log('[CancelSub] Unauthorized attempt.');
        return { success: false, error: 'Unauthorized' };
    }
    console.log(`[CancelSub] Starting cancellation for user: ${user.uid}`);

    try {
        const userProfileRef = db.ref(`user_profiles/${user.uid}`);
        const snapshot = await userProfileRef.child('subscription').once('value');
        const subData = snapshot.val();

        if (!subData || !subData.id) {
            console.warn(`[CancelSub] No active subscription found in DB for user ${user.uid} to cancel.`);
            return { success: false, error: 'No active subscription found to cancel.' };
        }
        console.log(`[CancelSub] Found subscription ${subData.id} for user ${user.uid}. Current DB Status: ${subData.status}`);

        // Cancel at the end of the billing cycle
        console.log(`[CancelSub] Sending cancellation request to Razorpay for subscription ${subData.id}`);
        const cancelledSubscription = await razorpay.subscriptions.cancel(subData.id, { cancel_at_cycle_end: true });
        
        console.log('[CancelSub] Razorpay response received:', JSON.stringify(cancelledSubscription, null, 2));


        // Update our DB with the full response from Razorpay to reflect the cancellation.
        // This saves the new `status` and `ended_at` timestamp.
        console.log(`[CancelSub] Updating database for user ${user.uid} with new subscription details.`);
        await userProfileRef.child('subscription').set(cancelledSubscription);
        console.log(`[CancelSub] Database update successful for user ${user.uid}.`);

        revalidatePath('/dashboard/settings/billing');

        return { success: true, subscription: cancelledSubscription };
    } catch (error) {
        console.error(`[CancelSub] Failed to cancel subscription for user ${user.uid}:`, error);
        const message = error instanceof Error ? error.message : 'Could not cancel the subscription. Please contact support.';
        return { success: false, error: message };
    }
}
