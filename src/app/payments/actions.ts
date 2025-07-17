
'use server';

import { validateRequest } from '@/lib/auth';
import Razorpay from 'razorpay';

interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
}

export async function createRazorpayOrder(): Promise<{ error: string } | RazorpayOrder> {
    const { user } = await validateRequest();
    if (!user) {
        return { error: 'You must be logged in to make a purchase.' };
    }

    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        console.error("Razorpay keys are not configured.");
        return { error: 'Payment service is currently unavailable.' };
    }

    const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = 89 * 100; // ₹89 in paise

    const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_user_${user.uid}_${Date.now()}`,
        notes: {
            userId: user.uid,
            email: user.email || '',
        },
    };

    try {
        const order = await razorpay.orders.create(options);
        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        };
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return { error: 'Could not create a payment order. Please try again.' };
    }
}
