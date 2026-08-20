import { db } from "@/lib/firebase-admin";
import { getPlanPricing, type PricingTier } from "@/lib/plans";

export function getPayPalBaseUrl(): string {
  const env = (process.env.PAYPAL_ENVIRONMENT || "sandbox").toLowerCase();
  return env === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";

  if (!clientId || !clientSecret) {
    throw new Error("PayPal API credentials (PAYPAL_CLIENT_ID/SECRET) are not configured.");
  }

  const now = Date.now();
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60000) {
    return cachedAccessToken.token;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to obtain PayPal OAuth token (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const token = data.access_token as string;
  const expiresIn = (data.expires_in as number) || 3600;

  cachedAccessToken = {
    token,
    expiresAt: now + expiresIn * 1000,
  };

  return token;
}

export interface PayPalPlanConfig {
  productId: string;
  monthlyPlanId: string;
  yearlyPlanId: string;
}

/**
 * Ensures a PayPal catalog product and regional billing plans (Tier 1/2/3) exist.
 * Caches plan IDs in Firebase RTDB metadata so we don't recreate them repeatedly.
 */
export async function getOrCreatePayPalPlans(tier: PricingTier = 'tier1'): Promise<PayPalPlanConfig> {
  const safeTier: PricingTier = tier === 'in' ? 'tier3' : tier;
  const pricing = getPlanPricing(safeTier);

  const token = await getPayPalAccessToken();
  const baseUrl = getPayPalBaseUrl();
  const env = (process.env.PAYPAL_ENVIRONMENT || "sandbox").toLowerCase();

  const configRef = db.ref(`system_config/paypal_plans_${env}_${safeTier}`);
  const snapshot = await configRef.get();
  if (snapshot.exists()) {
    const val = snapshot.val() as PayPalPlanConfig;
    if (val.monthlyPlanId && val.yearlyPlanId) {
      return val;
    }
  }

  // 1. Create or ensure Product
  let productId = "PROD-MINIFYN-PRO";
  try {
    const productRes = await fetch(`${baseUrl}/v1/catalogs/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: productId,
        name: "MiniFyn Pro Subscription",
        description: "Unlimited Short Links, Advanced Geo Analytics & Custom Domains",
        type: "SERVICE",
        category: "SOFTWARE",
      }),
    });

    if (productRes.status === 400) {
      // Product might already exist
      const err = await productRes.json();
      if (err.name === "DUPLICATE_RESOURCE_IDENTIFIER") {
        console.log("[PayPal] Product already exists:", productId);
      }
    }
  } catch (e) {
    console.warn("[PayPal] Product creation notice:", e);
  }

  // 2. Create Monthly Plan
  const monthlyRes = await fetch(`${baseUrl}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      name: `MiniFyn Pro Monthly (${pricing.monthlyFormatted}/mo)`,
      description: `MiniFyn Pro Monthly Subscription (${pricing.monthlyFormatted}/mo)`,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // Infinite recurring
          pricing_scheme: {
            fixed_price: {
              value: pricing.monthlyPrice.toFixed(2),
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });

  if (!monthlyRes.ok) {
    const err = await monthlyRes.text();
    throw new Error(`Failed to create PayPal monthly plan: ${err}`);
  }
  const monthlyData = await monthlyRes.json();
  const monthlyPlanId = monthlyData.id as string;

  // 3. Create Yearly Plan
  const yearlyRes = await fetch(`${baseUrl}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      name: `MiniFyn Pro Yearly (${pricing.yearlyFormatted}/yr)`,
      description: `MiniFyn Pro Yearly Subscription (${pricing.yearlyFormatted}/yr)`,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "YEAR",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: pricing.yearlyPrice.toFixed(2),
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });

  if (!yearlyRes.ok) {
    const err = await yearlyRes.text();
    throw new Error(`Failed to create PayPal yearly plan: ${err}`);
  }
  const yearlyData = await yearlyRes.json();
  const yearlyPlanId = yearlyData.id as string;

  const planConfig: PayPalPlanConfig = {
    productId,
    monthlyPlanId,
    yearlyPlanId,
  };

  await configRef.set(planConfig);
  return planConfig;
}

export interface PayPalSubscriptionDetails {
  id: string;
  status: "APPROVAL_PENDING" | "APPROVED" | "ACTIVE" | "SUSPENDED" | "CANCELLED" | "EXPIRED";
  plan_id: string;
  start_time?: string;
  subscriber?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  billing_info?: {
    next_billing_time?: string;
    last_payment?: {
      amount?: {
        currency_code?: string;
        value?: string;
      };
      time?: string;
    };
  };
}

export async function getPayPalSubscriptionDetails(
  subscriptionId: string
): Promise<PayPalSubscriptionDetails> {
  const token = await getPayPalAccessToken();
  const res = await fetch(
    `${getPayPalBaseUrl()}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch PayPal subscription ${subscriptionId} (${res.status}): ${err}`);
  }

  return res.json();
}

export async function cancelPayPalSubscription(
  subscriptionId: string,
  reason: string = "User requested cancellation"
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await getPayPalAccessToken();
    const res = await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      }
    );

    if (!res.ok && res.status !== 204) {
      const err = await res.text();
      return { success: false, error: err };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to cancel subscription" };
  }
}
