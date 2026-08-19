import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const eventType = event.event_type as string;
    const resource = event.resource || {};

    console.log(`[PayPal Webhook] Received event: ${eventType} (ID: ${event.id})`);

    const subscriptionId = resource.id || resource.billing_agreement_id;

    if (!subscriptionId && !resource.custom_id) {
      console.warn("[PayPal Webhook] No subscription ID or custom ID found in payload.");
      return NextResponse.json({ received: true });
    }

    // Locate the user in Firebase RTDB by querying user_profiles subscription/id
    const usersSnap = await db.ref("user_profiles").get();
    let matchedUserId: string | null = null;

    if (usersSnap.exists()) {
      const allUsers = usersSnap.val() as Record<string, any>;
      for (const [uid, uData] of Object.entries(allUsers)) {
        if (
          uData.subscription?.id === subscriptionId ||
          (resource.subscriber?.email_address &&
            uData.email?.toLowerCase() === resource.subscriber.email_address.toLowerCase())
        ) {
          matchedUserId = uid;
          break;
        }
      }
    }

    if (!matchedUserId) {
      console.warn(`[PayPal Webhook] No user found for subscription: ${subscriptionId}`);
      return NextResponse.json({ received: true, note: "User not found" });
    }

    switch (eventType) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
      case "BILLING.SUBSCRIPTION.CREATED": {
        await db.ref(`user_profiles/${matchedUserId}`).update({
          plan: "pro",
          "subscription/status": "active",
          "subscription/updatedAt": Date.now(),
          "subscription/provider": "paypal",
          "subscription/id": subscriptionId,
        });
        console.log(`[PayPal Webhook] User ${matchedUserId} activated Pro via webhook.`);
        break;
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        await db.ref(`user_profiles/${matchedUserId}`).update({
          plan: "free",
          "subscription/status": "cancelled",
          "subscription/cancelledAt": Date.now(),
        });
        console.log(`[PayPal Webhook] User ${matchedUserId} downgraded to Free via webhook (${eventType}).`);
        break;
      }

      case "PAYMENT.SALE.COMPLETED": {
        await db.ref(`user_profiles/${matchedUserId}/subscription/lastPayment`).set({
          amount: resource.amount?.total,
          currency: resource.amount?.currency,
          time: Date.now(),
          saleId: resource.id,
        });
        console.log(`[PayPal Webhook] Payment sale recorded for user ${matchedUserId}.`);
        break;
      }

      default:
        console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[PayPal Webhook] Error processing webhook:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
