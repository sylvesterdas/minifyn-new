import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PAYMENT_MODE = (process.env.LINKGUARD_PAYMENT_MODE || "live").toLowerCase();
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_TEST_KEY_ID = process.env.RAZORPAY_TEST_KEY_ID || "";
const RAZORPAY_TEST_KEY_SECRET = process.env.RAZORPAY_TEST_KEY_SECRET || "";
const PRO_AMOUNT_PAISE = Number(process.env.LINKGUARD_PRO_AMOUNT_PAISE || 14900);

type PaymentRecord = {
  order_id: string;
  payment_id: string | null;
  status: "created" | "paid" | "failed";
  timestamp: number;
};

type PaymentState = {
  records: Map<string, PaymentRecord>;
};

const globalState = globalThis as typeof globalThis & {
  __linkguardPaymentState__?: PaymentState;
};

const state: PaymentState =
  globalState.__linkguardPaymentState__ ||
  (globalState.__linkguardPaymentState__ = {
    records: new Map<string, PaymentRecord>(),
  });

export async function POST(req: NextRequest) {
  if (!isIndiaRequest(req)) {
    return NextResponse.json(
      { allowed: false, reason: "Pro purchase is available in India only." },
      { status: 403 }
    );
  }

  const { keyId, keySecret } = resolveRazorpayCredentials();
  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        allowed: false,
        reason: `Payment service not configured for ${PAYMENT_MODE} mode.`,
      },
      { status: 500 }
    );
  }

  const amount = Number.isFinite(PRO_AMOUNT_PAISE) ? PRO_AMOUNT_PAISE : 14900;

  const payload = {
    amount,
    currency: "INR",
    receipt: `lg_${Date.now()}`,
    notes: { product: "linkguard_pro_one_time" },
  };

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { allowed: false, reason: "Failed to create payment order." },
        { status: 502 }
      );
    }

    const json = (await res.json()) as {
      id: string;
      amount: number;
      currency: string;
      created_at: number;
    };

    const record: PaymentRecord = {
      order_id: json.id,
      payment_id: null,
      status: "created",
      timestamp: nowSec(),
    };
    state.records.set(json.id, record);

    return NextResponse.json({
      allowed: true,
      key_id: keyId,
      order_id: json.id,
      amount: json.amount,
      currency: json.currency,
      timestamp: json.created_at ?? nowSec(),
    });
  } catch {
    return NextResponse.json(
      { allowed: false, reason: "Unable to reach payment gateway." },
      { status: 502 }
    );
  }
}

function isIndiaRequest(req: NextRequest): boolean {
  const country = req.headers.get("x-vercel-ip-country")?.toUpperCase() || "";
  return country == "IN";
}

function resolveRazorpayCredentials(): { keyId: string; keySecret: string } {
  const useTest = PAYMENT_MODE == "test";
  if (useTest) {
    return {
      keyId: RAZORPAY_TEST_KEY_ID,
      keySecret: RAZORPAY_TEST_KEY_SECRET,
    };
  }

  return {
    keyId: RAZORPAY_KEY_ID,
    keySecret: RAZORPAY_KEY_SECRET,
  };
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}
