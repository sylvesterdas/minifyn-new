
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("Razorpay webhook secret is not set.");
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
    
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    
    if (!signature) {
        return NextResponse.json({ error: 'Signature missing' }, { status: 400 });
    }

    // 1. Verify the webhook signature
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(body);
    const digest = shasum.digest('hex');

    if (digest !== signature) {
        console.warn("Invalid Razorpay webhook signature received.");
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
    
    // 2. Process the event
    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;
        const userId = payment.notes?.userId;
        
        if (!userId) {
            console.error("User ID not found in payment notes for payment:", payment.id);
            // Return 200 to acknowledge receipt, but log the error
            return NextResponse.json({ status: 'ok' });
        }

        try {
            console.log(`Upgrading user ${userId} to pro plan.`);
            // Update user's plan in Firebase Realtime Database
            const userProfileRef = db.ref(`user_profiles/${userId}`);
            await userProfileRef.update({ plan: 'pro' });

        } catch (error) {
            console.error(`Failed to update plan for user ${userId}:`, error);
            // Even if DB update fails, return 200 to Razorpay to prevent retries
            // Log this for manual intervention.
            return NextResponse.json({ status: 'error', message: 'Failed to update user plan' }, { status: 500 });
        }
    }
    
    return NextResponse.json({ status: 'ok' });
}
