
'use server';

import { validateRequest } from '@/lib/auth';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID!,
    key_secret: RAZORPAY_KEY_SECRET!,
});

// These IDs would be created on the Razorpay Dashboard
const PLAN_IDS = {
    monthly: process.env.RAZORPAY_MONTHLY_PLAN_ID || 'plan_monthly_placeholder',
    yearly: process.env.RAZORPAY_YEARLY_PLAN_ID || 'plan_yearly_placeholder',
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
        console.error("Razorpay keys are not configured.");
        return { error: 'Payment service is currently unavailable.' };
    }
    
    if (planType !== 'monthly' && planType !== 'yearly') {
        return { error: 'Invalid plan type selected.' };
    }

    const planId = PLAN_IDS[planType];
    
    const options = {
        plan_id: planId,
        customer_notify: 1, // Send notifications to customer
        total_count: 12, // For yearly plan, 12 renewals. For monthly, also 12 renewals (1 year)
        notes: {
            userId: user.uid,
            email: user.email || '',
        },
    };

    try {
        const subscription = await razorpay.subscriptions.create(options);
        
        // Fetch plan details to get the amount, since subscription doesn't return it
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
