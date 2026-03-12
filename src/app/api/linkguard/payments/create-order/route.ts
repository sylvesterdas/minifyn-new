import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PAYMENT_MODE = (process.env.LINKGUARD_PAYMENT_MODE || "live").toLowerCase();
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_TEST_KEY_ID = process.env.RAZORPAY_TEST_KEY_ID || "";
const RAZORPAY_TEST_KEY_SECRET = process.env.RAZORPAY_TEST_KEY_SECRET || "";
const PRO_AMOUNT_PAISE = Number(process.env.LINKGUARD_PRO_AMOUNT_PAISE || 14900);
const PRODUCT_CODE = "linkguard_pro_one_time";

export async function POST(req: NextRequest) {
  const input = await parseBody(req);
  if (!input.ok) {
    return NextResponse.json({ allowed: false, reason: input.reason }, { status: 400 });
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

  const payload = {
    amount: Number.isFinite(PRO_AMOUNT_PAISE) ? PRO_AMOUNT_PAISE : 14900,
    currency: "INR",
    receipt: `lg_${Date.now()}`,
    notes: {
      install_id: input.installId,
      product_code: PRODUCT_CODE,
    },
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

async function parseBody(
  req: NextRequest
): Promise<{ ok: true; installId: string } | { ok: false; reason: string }> {
  try {
    const body = (await req.json()) as {
      install_id?: string;
      product_code?: string;
    };
    const installId = String(body.install_id || "").trim();
    const productCode = String(body.product_code || "").trim();

    if (!installId || installId.length < 12) {
      return { ok: false, reason: "Missing or invalid install_id." };
    }
    if (productCode !== PRODUCT_CODE) {
      return { ok: false, reason: "Unsupported product_code." };
    }

    return { ok: true, installId };
  } catch {
    return { ok: false, reason: "Invalid request body." };
  }
}

function resolveRazorpayCredentials(): { keyId: string; keySecret: string } {
  const useTest = PAYMENT_MODE === "test";
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
