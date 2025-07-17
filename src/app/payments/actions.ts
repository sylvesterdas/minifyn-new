
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

    if (idToken) {
        try {
            // Verify the ID token passed from the client
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            userData = { uid: decodedToken.uid, email: decodedToken.email };
        } catch(e) {
            console.error("Failed to verify ID token during subscription:", e);
            return { error: 'Invalid authentication token provided.' };
        }
    } else {
        // Fallback to session cookie if no token is provided (for existing users upgrading)
        const { user } = await validateRequest();
        if (!user) {
            return { error: 'You must be logged in to subscribe.' };
        }
        userData = { uid: user.uid, email: user.email };
    }

    if (!userData) {
        return { error: 'Authentication failed.' };
    }
    
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        console.error("Razorpay keys are not configured for the current environment.");
        return { error: 'Payment service is currently unavailable.' };
    }
    
    if (planType !== 'monthly' && planType !== 'yearly') {
        return { error: 'Invalid plan type selected.' };
    }

    const planId = PLAN_IDS[planType];
    if (!planId) {
        console.error(`Razorpay plan ID for '${planType}' is not configured for the current environment.`);
        return { error: 'The selected plan is currently unavailable.' };
    }
    
    try {
        // --- IMMEDIATE PLAN UPGRADE ---
        // Upgrade the user's plan to 'pro' before creating the subscription.
        // This ensures they have access immediately after payment.
        console.log(`Upgrading user ${userData.uid} to 'pro' plan.`);
        await db.ref(`user_profiles/${userData.uid}`).update({ plan: 'pro' });
        await adminAuth.setCustomUserClaims(userData.uid, { plan: 'pro' });

        const options = {
            plan_id: planId,
            customer_notify: 1,
            total_count: planType === 'monthly' ? 12 : 1, // 12 monthly payments or 1 yearly
            notes: {
                userId: userData.uid,
                email: userData.email || '',
            },
        };

        const subscription = await razorpay.subscriptions.create(options);
        const planDetails = await razorpay.plans.fetch(planId);

        return {
            subscriptionId: subscription.id,
            amount: planDetails.item.amount,
            currency: planDetails.item.currency,
        };
    } catch (error) {
        console.error('Error creating Razorpay subscription or upgrading user:', error);
        return { error: 'Could not create a subscription. Please try again.' };
    }
}
