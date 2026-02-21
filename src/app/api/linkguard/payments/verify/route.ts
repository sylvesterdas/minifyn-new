import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PAYMENT_MODE = (process.env.LINKGUARD_PAYMENT_MODE || "live").toLowerCase();
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_TEST_KEY_SECRET = process.env.RAZORPAY_TEST_KEY_SECRET || "";

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
      { verified: false, reason: "Pro purchase is available in India only." },
      { status: 403 }
    );
  }

  const keySecret = resolveRazorpaySecret();
  if (!keySecret) {
    return NextResponse.json(
      {
        verified: false,
        reason: `Payment verification not configured for ${PAYMENT_MODE} mode.`,
      },
      { status: 500 }
    );
  }

  let orderId = "";
  let paymentId = "";
  let signature = "";

  try {
    const body = (await req.json()) as {
      order_id?: string;
      payment_id?: string;
      signature?: string;
    };

    orderId = String(body.order_id || "").trim();
    paymentId = String(body.payment_id || "").trim();
    signature = String(body.signature || "").trim();
  } catch {
    return NextResponse.json(
      { verified: false, reason: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { verified: false, reason: "Missing verification fields." },
      { status: 400 }
    );
  }

  const digest = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const valid = timingSafeEqualHex(digest, signature);
  if (!valid) {
    state.records.set(orderId, {
      order_id: orderId,
      payment_id: paymentId,
      status: "failed",
      timestamp: nowSec(),
    });

    return NextResponse.json(
      { verified: false, reason: "Signature mismatch." },
      { status: 400 }
    );
  }

  const updated: PaymentRecord = {
    order_id: orderId,
    payment_id: paymentId,
    status: "paid",
    timestamp: nowSec(),
  };
  state.records.set(orderId, updated);

  return NextResponse.json({
    verified: true,
    order_id: updated.order_id,
    payment_id: updated.payment_id,
    status: updated.status,
    timestamp: updated.timestamp,
  });
}

function isIndiaRequest(req: NextRequest): boolean {
  const country = req.headers.get("x-vercel-ip-country")?.toUpperCase() || "";
  return country == "IN";
}

function resolveRazorpaySecret(): string {
  const useTest = PAYMENT_MODE == "test";
  return useTest ? RAZORPAY_TEST_KEY_SECRET : RAZORPAY_KEY_SECRET;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}
