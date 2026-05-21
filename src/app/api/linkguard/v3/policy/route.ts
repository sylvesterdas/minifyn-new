import { NextResponse } from "next/server";
import { LINKGUARD_POLICY } from "../../../../../lib/generated/linkguard-policy";
import { signPolicyEnvelope } from "../../../../../lib/linkguard-policy-signing";

export const runtime = "nodejs";

export function GET() {
  try {
    return NextResponse.json(signPolicyEnvelope(LINKGUARD_POLICY), {
      status: 200,
      headers: {
        "cache-control": "public, max-age=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "LinkGuard policy is unavailable.";
    return NextResponse.json({ error: reason }, { status: 503 });
  }
}
