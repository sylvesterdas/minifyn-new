"use server";

import { validateRequest } from "@/lib/auth";
import { auth as adminAuth, db } from "@/lib/firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { resolveCountryFromRequest } from "@/lib/geo";
import {
  getOrCreatePayPalPlans,
  getPayPalSubscriptionDetails,
  cancelPayPalSubscription,
} from "@/lib/paypal";
import { resolvePricingTier } from "@/lib/plans";

const PAYPAL_ENVIRONMENT = (process.env.PAYPAL_ENVIRONMENT || "sandbox").toLowerCase();
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";

export interface PayPalConfigResponse {
  clientId: string;
  environment: string;
  monthlyPlanId: string;
  yearlyPlanId: string;
  tier: string;
}

export async function getPayPalConfig(countryHint?: string | null): Promise<{ error?: string; config?: PayPalConfigResponse }> {
  try {
    if (!PAYPAL_CLIENT_ID) {
      return { error: "PayPal Client ID is not configured." };
    }
    // Server-side tamper-proof geo resolution (fallback to countryHint only if headers unresolvable)
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for") ?? hdrs.get("remote-addr");
    const detectedCountry = (await resolveCountryFromRequest({ headers: hdrs, ip })) || countryHint;
    const tier = resolvePricingTier(detectedCountry);
    const plans = await getOrCreatePayPalPlans(tier);
    return {
      config: {
        clientId: PAYPAL_CLIENT_ID,
        environment: PAYPAL_ENVIRONMENT,
        monthlyPlanId: plans.monthlyPlanId,
        yearlyPlanId: plans.yearlyPlanId,
        tier,
      },
    };
  } catch (err) {
    console.error("[PayPal Action] getPayPalConfig error:", err);
    return { error: err instanceof Error ? err.message : "Failed to load PayPal configuration." };
  }
}

export async function initiatePayPalSubscription(
  planType: "monthly" | "yearly",
  countryHint?: string | null,
  idToken?: string
): Promise<{ error?: string; planId?: string }> {
  let userData: { uid: string; email?: string; name?: string } | null = null;

  if (idToken) {
    try {
      const decoded: DecodedIdToken = await adminAuth.verifyIdToken(idToken);
      userData = { uid: decoded.uid, email: decoded.email, name: decoded.name };
    } catch (e) {
      console.error("[PayPal Action] ID token verification failed:", e);
    }
  } else {
    const session = await validateRequest();
    if (session.user) {
      userData = { uid: session.user.id, email: session.user.email, name: session.user.name };
    }
  }

  if (!userData) {
    return { error: "Authentication required to initiate subscription." };
  }

  try {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for") ?? hdrs.get("remote-addr");
    const detectedCountry = (await resolveCountryFromRequest({ headers: hdrs, ip })) || countryHint;
    const tier = resolvePricingTier(detectedCountry);
    const plans = await getOrCreatePayPalPlans(tier);
    const planId = planType === "monthly" ? plans.monthlyPlanId : plans.yearlyPlanId;
    return { planId };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to initialize PayPal plan." };
  }
}

export async function syncPayPalSubscription(
  subscriptionId: string,
  idToken?: string
): Promise<{ success: boolean; error?: string }> {
  let userId: string | null = null;

  if (idToken) {
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      userId = decoded.uid;
    } catch (e) {
      console.error("[PayPal Action] sync ID token error:", e);
    }
  } else {
    const session = await validateRequest();
    if (session.user) {
      userId = session.user.id;
    }
  }

  if (!userId) {
    return { success: false, error: "Authentication failed during PayPal sync." };
  }

  try {
    const details = await getPayPalSubscriptionDetails(subscriptionId);
    console.log(`[PayPal Action] Subscription ${subscriptionId} status: ${details.status}`);

    const isLiveActive = details.status === "ACTIVE" || details.status === "APPROVED";
    if (!isLiveActive) {
      return { success: false, error: `Subscription is in '${details.status}' status.` };
    }

    const updates: Record<string, any> = {
      [`user_profiles/${userId}/plan`]: "pro",
      [`user_profiles/${userId}/subscription`]: {
        id: details.id,
        planId: details.plan_id,
        provider: "paypal",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        nextBillingTime: details.billing_info?.next_billing_time || null,
        subscriberEmail: details.subscriber?.email_address || null,
      },
    };

    await db.ref().update(updates);
    console.log(`[PayPal Action] User ${userId} successfully upgraded to Pro via PayPal.`);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings/billing");
    return { success: true };
  } catch (err) {
    console.error("[PayPal Action] Error verifying PayPal subscription:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to verify PayPal subscription." };
  }
}

export async function cancelUserPayPalSubscription(
  idToken?: string
): Promise<{ success: boolean; error?: string }> {
  let userId: string | null = null;

  if (idToken) {
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      userId = decoded.uid;
    } catch (e) {
      console.error("[PayPal Action] cancel ID token error:", e);
    }
  } else {
    const session = await validateRequest();
    if (session.user) {
      userId = session.user.id;
    }
  }

  if (!userId) {
    return { success: false, error: "Authentication required to cancel subscription." };
  }

  const subSnap = await db.ref(`user_profiles/${userId}/subscription`).get();
  if (!subSnap.exists()) {
    return { success: false, error: "No active subscription found." };
  }

  const subData = subSnap.val();
  if (subData.provider === "paypal" && subData.id) {
    const cancelRes = await cancelPayPalSubscription(subData.id);
    if (!cancelRes.success) {
      console.warn("[PayPal Action] PayPal cancel API returned warning:", cancelRes.error);
    }
  }

  await db.ref(`user_profiles/${userId}/subscription/status`).set("cancelled");
  await db.ref(`user_profiles/${userId}/subscription/cancelledAt`).set(Date.now());

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings/billing");
  return { success: true };
}
