import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PAYMENT_MODE = (process.env.LINKGUARD_PAYMENT_MODE || "live").toLowerCase();
const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_TEST_KEY_ID || "";
const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_TEST_KEY_SECRET || "";
const RECOVERY_SIGNING_SECRET = process.env.LINKGUARD_RECOVERY_SIGNING_SECRET || "";
const ENTITLEMENT_SIGNING_SECRET = process.env.LINKGUARD_ENTITLEMENT_SIGNING_SECRET || "";

const VALID_PRODUCT_CODES = new Set([
  "scamguard_pro_one_time",
  "scamguard_ai_one_time",
  "scamguard_bundle_one_time",
  "linkguard_pro_one_time",
]);

export async function POST(req: NextRequest) {
  const parsed = await parseBody(req);
  if (!parsed.ok) {
    return NextResponse.json({ verified: false, reason: parsed.reason }, { status: 400 });
  }

  const { keyId, keySecret } = resolveRazorpayCredentials();
  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        verified: false,
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
        verified: false,
        reason: `Missing signing env vars: ${missing.join(", ")}.`,
      },
      { status: 500 }
    );
  }

  const digest = crypto
    .createHmac("sha256", keySecret)
    .update(`${parsed.orderId}|${parsed.paymentId}`)
    .digest("hex");
  if (!timingSafeEqualHex(digest, parsed.signature)) {
    return NextResponse.json(
      { verified: false, reason: "Signature mismatch." },
      { status: 400 }
    );
  }

  const paymentCheck = await fetchAndValidatePayment({
    keyId,
    keySecret,
    orderId: parsed.orderId,
    paymentId: parsed.paymentId,
    installId: parsed.installId,
    productCode: parsed.productCode,
  });

  if (!paymentCheck.ok) {
    return NextResponse.json(
      { verified: false, reason: paymentCheck.reason },
      { status: 400 }
    );
  }

  const now = nowSec();
  const entitlementToken = signEnvelope(
    {
      install_id: parsed.installId,
      product_code: parsed.productCode,
      payment_id: parsed.paymentId,
      order_id: parsed.orderId,
      verified_at: now,
      exp: now + 7 * 24 * 60 * 60,
    },
    ENTITLEMENT_SIGNING_SECRET
  );

  const recoveryCode = signEnvelope(
    {
      product_code: parsed.productCode,
      payment_id: parsed.paymentId,
      order_id: parsed.orderId,
      issued_at: now,
    },
    RECOVERY_SIGNING_SECRET
  );

  return NextResponse.json({
    verified: true,
    payment_id: parsed.paymentId,
    product_code: parsed.productCode,
    entitlement_token: entitlementToken,
    recovery_code: recoveryCode,
    verified_at: now,
  });
}

type ParsedBody = {
  ok: true;
  installId: string;
  orderId: string;
  paymentId: string;
  signature: string;
  productCode: string;
};

async function parseBody(req: NextRequest): Promise<ParsedBody | { ok: false; reason: string }> {
  try {
    const body = (await req.json()) as {
      install_id?: string;
      order_id?: string;
      payment_id?: string;
      signature?: string;
      product_code?: string;
    };

    const installId = String(body.install_id || "").trim();
    const orderId = String(body.order_id || "").trim();
    const paymentId = String(body.payment_id || "").trim();
    const signature = String(body.signature || "").trim();
    const productCode = String(body.product_code || "scamguard_pro_one_time").trim();

    if (!installId || installId.length < 12) {
      return { ok: false, reason: "Missing or invalid install_id." };
    }
    if (!orderId || !paymentId || !signature) {
      return { ok: false, reason: "Missing verification fields." };
    }
    if (!VALID_PRODUCT_CODES.has(productCode)) {
      return { ok: false, reason: `Unsupported product_code: ${productCode}` };
    }

    return { ok: true, installId, orderId, paymentId, signature, productCode };
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

function timingSafeEqualHex(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

function signEnvelope(payload: Record<string, string | number>, secret: string): string {
  const payloadRaw = JSON.stringify(payload);
  const payloadB64 = base64Url(payloadRaw);
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

function base64Url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

async function fetchAndValidatePayment(input: {
  keyId: string;
  keySecret: string;
  orderId: string;
  paymentId: string;
  installId: string;
  productCode: string;
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
      notes?: { install_id?: string; product_code?: string };
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

    if (payment.notes?.install_id && payment.notes.install_id !== input.installId) {
      return { ok: false, reason: "install_id mismatch." };
    }

    return { ok: true, reason: "ok" };
  } catch {
    return { ok: false, reason: "Unable to validate payment status." };
  }
}
