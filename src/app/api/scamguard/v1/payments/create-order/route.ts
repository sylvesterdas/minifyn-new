import { NextRequest, NextResponse } from "next/server";
import { isAllowedCountry, resolveCountryFromRequest } from "@/lib/geo";

export const runtime = "nodejs";

const PAYMENT_MODE = (process.env.LINKGUARD_PAYMENT_MODE || "live").toLowerCase();
const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_TEST_KEY_ID || "";
const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_TEST_KEY_SECRET || "";

const PRODUCT_PRICING_PAISE: Record<string, number> = {
  scamguard_pro_one_time: Number(process.env.SCAMGUARD_PRO_AMOUNT_PAISE || 39900),
  scamguard_ai_yearly: Number(process.env.SCAMGUARD_AI_YEARLY_AMOUNT_PAISE || 99900),
  scamguard_ai_monthly: Number(process.env.SCAMGUARD_AI_MONTHLY_AMOUNT_PAISE || 9900),
  scamguard_ai_one_time: Number(process.env.SCAMGUARD_AI_AMOUNT_PAISE || 99900),
  linkguard_pro_one_time: Number(process.env.LINKGUARD_PRO_AMOUNT_PAISE || 14900),
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("remote-addr");
  const country = await resolveCountryFromRequest({ headers: req.headers, ip });
  if (!isAllowedCountry(country)) {
    return NextResponse.json(
      {
        allowed: false,
        reason: "Payments are currently available in India only.",
      },
      { status: 403 }
    );
  }

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

  const amountPaise = PRODUCT_PRICING_PAISE[input.productCode] ?? 19900;

  const payload = {
    amount: amountPaise,
    currency: "INR",
    receipt: `sg_${Date.now()}`,
    notes: {
      install_id: input.installId,
      product_code: input.productCode,
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
      product_code: input.productCode,
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
): Promise<
  { ok: true; installId: string; productCode: string } | { ok: false; reason: string }
> {
  try {
    const body = (await req.json()) as {
      install_id?: string;
      product_code?: string;
    };
    const installId = String(body.install_id || "").trim();
    const productCode = String(body.product_code || "scamguard_pro_one_time").trim();

    if (!installId || installId.length < 12) {
      return { ok: false, reason: "Missing or invalid install_id." };
    }
    if (!PRODUCT_PRICING_PAISE[productCode]) {
      return { ok: false, reason: `Unsupported product_code: ${productCode}` };
    }

    return { ok: true, installId, productCode };
  } catch {
    return { ok: false, reason: "Invalid request body." };
  }
}

function resolveRazorpayCredentials(): { keyId: string; keySecret: string } {
  return {
    keyId: RAZORPAY_KEY_ID,
    keySecret: RAZORPAY_KEY_SECRET,
  };
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}
