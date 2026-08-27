import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RECOVERY_SIGNING_SECRET = process.env.LINKGUARD_RECOVERY_SIGNING_SECRET || "";
const ENTITLEMENT_SIGNING_SECRET = process.env.LINKGUARD_ENTITLEMENT_SIGNING_SECRET || "";

export async function POST(req: NextRequest) {
  const parsed = await parseBody(req);
  if (!parsed.ok) {
    return NextResponse.json({ restored: false, reason: parsed.reason }, { status: 400 });
  }

  if (!RECOVERY_SIGNING_SECRET || !ENTITLEMENT_SIGNING_SECRET) {
    return NextResponse.json(
      {
        restored: false,
        reason: "Payment restore service is not configured.",
      },
      { status: 500 }
    );
  }

  const recovery = verifyRecoveryCode(parsed.recoveryCode, RECOVERY_SIGNING_SECRET);
  if (!recovery.ok) {
    return NextResponse.json({ restored: false, reason: recovery.reason }, { status: 400 });
  }

  const now = nowSec();
  const entitlementToken = signEnvelope(
    {
      install_id: parsed.installId,
      product_code: recovery.payload.product_code || "scamguard_pro_one_time",
      payment_id: recovery.payload.payment_id || "",
      order_id: recovery.payload.order_id || "",
      verified_at: now,
      exp: now + 7 * 24 * 60 * 60,
    },
    ENTITLEMENT_SIGNING_SECRET
  );

  return NextResponse.json({
    restored: true,
    product_code: recovery.payload.product_code || "scamguard_pro_one_time",
    entitlement_token: entitlementToken,
    restored_at: now,
  });
}

type ParsedBody = {
  ok: true;
  installId: string;
  recoveryCode: string;
};

async function parseBody(req: NextRequest): Promise<ParsedBody | { ok: false; reason: string }> {
  try {
    const body = (await req.json()) as {
      install_id?: string;
      recovery_code?: string;
    };

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

function verifyRecoveryCode(
  code: string,
  secret: string
): { ok: true; payload: Record<string, string> } | { ok: false; reason: string } {
  const parts = code.split(".");
  if (parts.length !== 2) {
    return { ok: false, reason: "Invalid recovery code format." };
  }

  const [payloadB64, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  if (!timingSafeEqualHex(expectedSig, sig)) {
    return { ok: false, reason: "Recovery code signature mismatch." };
  }

  try {
    const json = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as Record<
      string,
      string
    >;
    return { ok: true, payload: json };
  } catch {
    return { ok: false, reason: "Malformed recovery code payload." };
  }
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

function signEnvelope(payload: Record<string, string | number>, secret: string): string {
  const payloadRaw = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadRaw, "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}
