
'use server';

import { validateRequest } from '@/lib/auth';
import Razorpay from 'razorpay';

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
    planType: 'monthly' | 'yearly'
): Promise<{ error: string } | CreateSubscriptionResponse> {
    const { user } = await validateRequest();
    if (!user) {
        return { error: 'You must be logged in to subscribe.' };
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
    
    const options = {
        plan_id: planId,
        customer_notify: 1,
        total_count: 12,
        notes: {
            userId: user.uid,
            email: user.email || '',
        },
    };

    try {
        const subscription = await razorpay.subscriptions.create(options);
        
        const planDetails = await razorpay.plans.fetch(planId);

        return {
            subscriptionId: subscription.id,
            amount: planDetails.item.amount,
            currency: planDetails.item.currency,
        };
    } catch (error) {
        console.error('Error creating Razorpay subscription:', error);
        return { error: 'Could not create a subscription. Please try again.' };
    }
}
