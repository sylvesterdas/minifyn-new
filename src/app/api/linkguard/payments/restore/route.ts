import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PAYMENT_MODE = (process.env.LINKGUARD_PAYMENT_MODE || "live").toLowerCase();
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_TEST_KEY_ID = process.env.RAZORPAY_TEST_KEY_ID || "";
const RAZORPAY_TEST_KEY_SECRET = process.env.RAZORPAY_TEST_KEY_SECRET || "";
const RECOVERY_SIGNING_SECRET = process.env.LINKGUARD_RECOVERY_SIGNING_SECRET || "";
const ENTITLEMENT_SIGNING_SECRET = process.env.LINKGUARD_ENTITLEMENT_SIGNING_SECRET || "";
const PRODUCT_CODE = "linkguard_pro_one_time";

export async function POST(req: NextRequest) {
  const parsed = await parseBody(req);
  if (!parsed.ok) {
    return NextResponse.json({ restored: false, reason: parsed.reason }, { status: 400 });
  }

  const { keyId, keySecret } = resolveRazorpayCredentials();
  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        restored: false,
        reason: `Payment verification not configured for ${PAYMENT_MODE} mode.`,
      },
      { status: 500 }
    );
  }

  if (!RECOVERY_SIGNING_SECRET || !ENTITLEMENT_SIGNING_SECRET) {
    const missing: string[] = [];
    if (!RECOVERY_SIGNING_SECRET) missing.push("LINKGUARD_RECOVERY_SIGNING_SECRET");
    if (!ENTITLEMENT_SIGNING_SECRET) missing.push("LINKGUARD_ENTITLEMENT_SIGNING_SECRET");
    return NextResponse.json(
      {
        restored: false,
        reason: `Missing signing env vars: ${missing.join(", ")}.`,
      },
      { status: 500 }
    );
  }

  const decoded = verifyEnvelope(parsed.recoveryCode, RECOVERY_SIGNING_SECRET);
  if (!decoded.ok) {
    return NextResponse.json({ restored: false, reason: decoded.reason }, { status: 400 });
  }

  const productCode = String(decoded.payload.product_code || "").trim();
  const orderId = String(decoded.payload.order_id || "").trim();
  const paymentId = String(decoded.payload.payment_id || "").trim();

  if (productCode !== PRODUCT_CODE || !orderId || !paymentId) {
    return NextResponse.json(
      { restored: false, reason: "Recovery code payload is invalid." },
      { status: 400 }
    );
  }

  const paymentCheck = await fetchAndValidatePayment({
    keyId,
    keySecret,
    orderId,
    paymentId,
  });
  if (!paymentCheck.ok) {
    return NextResponse.json(
      { restored: false, reason: paymentCheck.reason },
      { status: 400 }
    );
  }

  const now = nowSec();
  const entitlementToken = signEnvelope(
    {
      install_id: parsed.installId,
      product_code: PRODUCT_CODE,
      payment_id: paymentId,
      order_id: orderId,
      restored_at: now,
      exp: now + 7 * 24 * 60 * 60,
    },
    ENTITLEMENT_SIGNING_SECRET
  );

  return NextResponse.json({
    restored: true,
    payment_id: paymentId,
    entitlement_token: entitlementToken,
    restored_at: now,
  });
}

async function parseBody(
  req: NextRequest
): Promise<{ ok: true; installId: string; recoveryCode: string } | { ok: false; reason: string }> {
  try {
    const body = (await req.json()) as { install_id?: string; recovery_code?: string };
    const installId = String(body.install_id || "").trim();
    const recoveryCode = String(body.recovery_code || "").trim();

    if (!installId || installId.length < 12) {
      return { ok: false, reason: "Missing or invalid install_id." };
    }
    if (!recoveryCode) {
      return { ok: false, reason: "Missing recovery_code." };
    }

    return { ok: true, installId, recoveryCode };
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

function verifyEnvelope(
  envelope: string,
  secret: string
): { ok: true; payload: Record<string, unknown> } | { ok: false; reason: string } {
  const parts = envelope.split(".");
  if (parts.length !== 2) return { ok: false, reason: "Invalid recovery code." };

  const payloadB64 = parts[0];
  const signature = parts[1];
  const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

  if (!timingSafeEqual(expected, signature)) {
    return { ok: false, reason: "Recovery code signature mismatch." };
  }

  try {
    const decoded = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!decoded || typeof decoded !== "object") {
      return { ok: false, reason: "Invalid recovery code payload." };
    }
    return { ok: true, payload: decoded as Record<string, unknown> };
  } catch {
    return { ok: false, reason: "Invalid recovery code payload." };
  }
}

function signEnvelope(payload: Record<string, string | number>, secret: string): string {
  const payloadRaw = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadRaw, "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

async function fetchAndValidatePayment(input: {
  keyId: string;
  keySecret: string;
  orderId: string;
  paymentId: string;
}): Promise<{ ok: boolean; reason: string }> {
  try {
    const auth = Buffer.from(`${input.keyId}:${input.keySecret}`).toString("base64");
    const paymentRes = await fetch(
      `https://api.razorpay.com/v1/payments/${input.paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!paymentRes.ok) {
      return { ok: false, reason: "Unable to validate payment status." };
    }

    const payment = (await paymentRes.json()) as {
      order_id?: string;
      status?: string;
      notes?: { product_code?: string };
    };

    if (payment.order_id !== input.orderId) {
      return { ok: false, reason: "Payment does not match order." };
    }

    if (payment.status !== "authorized" && payment.status !== "captured") {
      return {
        ok: false,
        reason: `Payment is not completed (status: ${payment.status ?? "unknown"}).`,
      };
    }

    if (payment.notes?.product_code !== PRODUCT_CODE) {
      return { ok: false, reason: "product_code mismatch." };
    }

    return { ok: true, reason: "ok" };
  } catch {
    return { ok: false, reason: "Unable to validate payment status." };
  }
}
