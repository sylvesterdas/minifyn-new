import crypto from "node:crypto";

type SignedPolicyEnvelope = {
  policy: unknown;
  signature_algorithm: "ed25519";
  signing_key_id: string;
  signature: string;
};

export function signPolicyEnvelope(policy: unknown): SignedPolicyEnvelope {
  const signingKey =
    process.env.LINKGUARD_POLICY_SIGNING_KEY ||
    process.env.SCAMGUARD_MODEL_SIGNING_KEY ||
    "";
  const signingKeyId =
    process.env.LINKGUARD_POLICY_SIGNING_KEY_ID ||
    process.env.SCAMGUARD_MODEL_SIGNING_KEY_ID ||
    "";

  if (!signingKey.trim() || !signingKeyId.trim()) {
    throw new Error("LinkGuard policy signing key is not configured.");
  }

  const unsigned = {
    policy,
    signature_algorithm: "ed25519" as const,
    signing_key_id: signingKeyId.trim(),
  };
  const signature = crypto.sign(null, Buffer.from(canonicalJson(unsigned)), loadEd25519PrivateKey(signingKey));
  return {
    ...unsigned,
    signature: base64Url(signature),
  };
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    return `{${entries
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function loadEd25519PrivateKey(value: string): crypto.KeyObject | string {
  const trimmed = value.trim();
  if (trimmed.startsWith("-----BEGIN")) return trimmed;

  const seed = base64UrlDecode(trimmed);
  if (seed.length !== 32) {
    throw new Error("Raw Ed25519 policy signing key must be 32 bytes.");
  }
  const pkcs8Prefix = Buffer.from("302e020100300506032b657004220420", "hex");
  return crypto.createPrivateKey({
    key: Buffer.concat([pkcs8Prefix, seed]),
    format: "der",
    type: "pkcs8",
  });
}

function base64Url(value: Buffer): string {
  return value.toString("base64url");
}

function base64UrlDecode(value: string): Buffer {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
