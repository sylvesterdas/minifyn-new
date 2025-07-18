
'use server';

import { validateRequest } from '@/lib/auth';
import Razorpay from 'razorpay';
import { auth as adminAuth, db } from '@/lib/firebase-admin';

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
    let userData: { uid: string, email?: string } | null = null;
    console.log('[Payment Action] Starting subscription creation...');

    if (idToken) {
        try {
            // Verify the ID token passed from the client
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            userData = { uid: decodedToken.uid, email: decodedToken.email };
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
        userData = { uid: user.uid, email: user.email };
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


export async function syncRazorpaySubscription(idToken?: string): Promise<{ success: boolean; message: string } | { success: false; error: string }> {
    let userData: { uid: string, email?: string } | null = null;
    
    if (idToken) {
        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            userData = { uid: decodedToken.uid, email: decodedToken.email };
        } catch (e) {
            return { success: false, error: 'Invalid authentication token.' };
        }
    } else {
        const { user } = await validateRequest();
        if (!user) {
            return { success: false, error: 'You must be logged in.' };
        }
        userData = { uid: user.uid, email: user.email };
    }

    if (!userData || !userData.email) {
        return { success: false, error: 'User email not found.' };
    }
    
    console.log(`[syncRazorpay] Starting subscription sync for user: ${userData.uid} (email: ${userData.email})`);

    try {
        let userSubscription = null;
        let skip = 0;
        const count = 100; // Fetch 100 items per page
        let hasMore = true;
        
        while (hasMore) {
            console.log(`[syncRazorpay] Fetching subscriptions... Skip: ${skip}, Count: ${count}`);
            const subscriptions = await razorpay.subscriptions.all({ count, skip });
            
            // Find subscription by email in the notes
            const found = subscriptions.items.find(sub => sub.notes?.email === userData?.email && sub.status === 'active');

            if (found) {
                userSubscription = found;
                console.log(`[syncRazorpay] Found active subscription ${userSubscription.id} for user with email ${userData?.email}.`);
                break; // Exit loop once found
            }

            if (subscriptions.items.length < count) {
                hasMore = false;
            } else {
                skip += count;
            }
        }

        if (userSubscription) {
            const userProfileRef = db.ref(`user_profiles/${userData.uid}`);
            
            await userProfileRef.update({ plan: 'pro', onboardingCompleted: true });
            await adminAuth.setCustomUserClaims(userData.uid, { plan: 'pro', onboardingCompleted: true });
            await adminAuth.revokeRefreshTokens(userData.uid);

            console.log(`[syncRazorpay] User ${userData.uid} plan restored to Pro via manual sync.`);
            return { success: true, message: 'Your Pro plan has been successfully restored!' };
        } else {
             console.log(`[syncRazorpay] No active subscription found for user ${userData.uid} (email: ${userData.email}) after checking all records.`);
            return { success: false, error: 'We could not find an active Pro subscription associated with your account.' };
        }

    } catch (error) {
        console.error(`Error during manual subscription sync for user ${userData.uid}:`, error);
        return { success: false, error: 'An unexpected error occurred while checking your subscription status.' };
    }
}
