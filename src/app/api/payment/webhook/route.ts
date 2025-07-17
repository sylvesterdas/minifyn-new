
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db, auth } from '@/lib/firebase-admin';

async function handleSubscriptionEvent(subscription: any, eventType: string) {
    const userId = subscription.notes?.userId;
    const subscriptionId = subscription.id;
    
    if (!userId) {
        console.error(`User ID not found in ${eventType} notes for subscription:`, subscriptionId);
        return;
    }

    try {
        console.log(`Processing '${eventType}' for user ${userId}, subscription ${subscriptionId}.`);
        const userProfileRef = db.ref(`user_profiles/${userId}`);
        
        // The plan is already set to 'pro' during the initial creation.
        // The webhook's job is to record the final subscription status from Razorpay.
        await userProfileRef.update({
            subscription: {
                id: subscriptionId,
                status: subscription.status,
                planId: subscription.plan_id,
                current_start: subscription.current_start,
                current_end: subscription.current_end,
                ended_at: subscription.ended_at || null,
            },
        });
        
        console.log(`Successfully updated subscription details for user ${userId}.`);

    } catch (error) {
        console.error(`Failed to update subscription details for user ${userId} on ${eventType}:`, error);
        // Even on failure, we don't throw, to ensure Razorpay gets a 200 OK.
        // This error should be logged and monitored for manual intervention.
    }
}


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

    try {
        const shasum = crypto.createHmac('sha256', webhookSecret);
        shasum.update(body);
        const digest = shasum.digest('hex');

        if (digest !== signature) {
            console.warn("Invalid Razorpay webhook signature received.");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }
        
        const event = JSON.parse(body);
        const eventType = event.event;
        
        // Handle subscription activation and successful charges
        if (eventType === 'subscription.activated' || eventType === 'subscription.charged') {
            await handleSubscriptionEvent(event.payload.subscription.entity, eventType);
        }
        
        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error("Error processing Razorpay webhook:", error);
        return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
    }
}
