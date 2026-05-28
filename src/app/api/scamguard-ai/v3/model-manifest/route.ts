import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { GoogleAuth } from "google-auth-library";

export const runtime = "nodejs";

const PLAY_PACKAGE_NAME = process.env.LINKGUARD_PLAY_PACKAGE_NAME || "";
const PLAY_SERVICE_ACCOUNT_JSON =
  process.env.LINKGUARD_PLAY_SERVICE_ACCOUNT_JSON || "";
const PLAY_AI_PRODUCT_ID = process.env.LINKGUARD_PLAY_AI_PRODUCT_ID || "ai_mode";
const PLAY_INTEGRITY_ENFORCE =
  process.env.LINKGUARD_PLAY_INTEGRITY_ENFORCE === "true";
const GCS_MODEL_BUCKET = process.env.GCS_MODEL_BUCKET || "";
const ACTIVE_MODEL_OBJECT =
  process.env.SCAMGUARD_AI_ACTIVE_MODEL_OBJECT ||
  "scamguard-ai/active_model.json";
const DOWNLOAD_TTL_SECONDS = Number(
  process.env.SCAMGUARD_AI_DOWNLOAD_TTL_SECONDS || "900"
);
const PLAY_ALLOWED_APP_VERDICTS = (
  process.env.LINKGUARD_PLAY_ALLOWED_APP_VERDICTS || "PLAY_RECOGNIZED"
)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const PLAY_ALLOWED_DEVICE_VERDICTS = (
  process.env.LINKGUARD_PLAY_ALLOWED_DEVICE_VERDICTS ||
  "MEETS_DEVICE_INTEGRITY,MEETS_BASIC_INTEGRITY,MEETS_STRONG_INTEGRITY"
)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

type ManifestRequest = {
  productId: string;
  purchaseToken?: string;
  aiMode: boolean;
  integrityToken: string;
  integrityRequestHash: string;
};

type DecodedIntegrityPayload = {
  tokenPayloadExternal?: {
    requestDetails?: {
      requestPackageName?: string;
      requestHash?: string;
    };
    appIntegrity?: {
      appRecognitionVerdict?: string;
    };
    deviceIntegrity?: {
      deviceRecognitionVerdict?: string[];
    };
  };
};

export async function POST(req: NextRequest) {
  const parsed = await parseRequest(req);
  if (!parsed.ok) {
    console.warn("[scamguard-ai][model-manifest]", {
      ok: false,
      stage: "parse_request",
      reason: parsed.reason,
      platform: req.headers.get("x-linkguard-platform") || null,
      appVersion: req.headers.get("x-linkguard-app-version") || null,
      hasIntegrityToken: Boolean(
        req.headers.get("x-linkguard-play-integrity-token")?.trim()
      ),
      hasIntegrityRequestHash: Boolean(
        req.headers.get("x-linkguard-play-integrity-request-hash")?.trim()
      ),
    });
    return NextResponse.json({ reason: parsed.reason }, { status: 400 });
  }

  const config = validateConfig();
  if (!config.ok) {
    console.error("[scamguard-ai][model-manifest]", {
      ok: false,
      stage: "config",
      reason: config.reason,
      productId: parsed.value.productId,
      purchaseTokenHashPrefix: tokenHashPrefix(parsed.value.purchaseToken),
      aiMode: parsed.value.aiMode,
    });
    return NextResponse.json({ reason: config.reason }, { status: 500 });
  }

  if (!parsed.value.aiMode) {
    console.warn("[scamguard-ai][model-manifest]", {
      ok: false,
      stage: "ai_mode",
      reason: "AI Mode claim is missing.",
      productId: parsed.value.productId,
      expectedProductId: PLAY_AI_PRODUCT_ID,
      purchaseTokenHashPrefix: tokenHashPrefix(parsed.value.purchaseToken),
      aiMode: parsed.value.aiMode,
    });
    return NextResponse.json(
      { reason: "AI Mode claim is missing." },
      { status: 400 }
    );
  }

  const expectedRequestHashes = [buildAiModeRequestHash()];
  if (parsed.value.productId && parsed.value.purchaseToken) {
    expectedRequestHashes.push(
      buildLegacyManifestRequestHash({
        productId: parsed.value.productId,
        purchaseToken: parsed.value.purchaseToken,
      })
    );
  }
  const integrity = await verifyPlayIntegrity({
    token: parsed.value.integrityToken,
    requestHash: parsed.value.integrityRequestHash,
    expectedRequestHashes,
  });
  if (!integrity.ok && PLAY_INTEGRITY_ENFORCE) {
    console.warn("[scamguard-ai][model-manifest]", {
      ok: false,
      stage: "integrity",
      reason: integrity.reason,
      enforce: PLAY_INTEGRITY_ENFORCE,
      hasToken: Boolean(parsed.value.integrityToken),
      hasRequestHash: Boolean(parsed.value.integrityRequestHash),
      productId: parsed.value.productId,
      purchaseTokenHashPrefix: tokenHashPrefix(parsed.value.purchaseToken),
      aiMode: parsed.value.aiMode,
    });
    return NextResponse.json({ reason: integrity.reason }, { status: 403 });
  }
  if (!integrity.ok) {
    console.warn("[scamguard-ai][model-manifest]", {
      ok: false,
      stage: "integrity",
      reason: integrity.reason,
      enforce: PLAY_INTEGRITY_ENFORCE,
      hasToken: Boolean(parsed.value.integrityToken),
      hasRequestHash: Boolean(parsed.value.integrityRequestHash),
      productId: parsed.value.productId,
      purchaseTokenHashPrefix: tokenHashPrefix(parsed.value.purchaseToken),
      aiMode: parsed.value.aiMode,
    });
  }

  try {
    const manifest = await readActiveManifest();
    const modelObject = modelObjectFromManifest(manifest);
    const expiresIn = Number.isFinite(DOWNLOAD_TTL_SECONDS)
      ? Math.max(60, Math.min(DOWNLOAD_TTL_SECONDS, 15 * 60))
      : 900;
    const downloadUrl = signGcsReadUrl({
      bucket: GCS_MODEL_BUCKET,
      objectName: modelObject,
      expiresInSeconds: expiresIn,
    });

    return NextResponse.json({
      manifest,
      download_url: downloadUrl,
      expires_at: nowSec() + expiresIn,
    });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "AI model manifest is unavailable.";
    console.error("[scamguard-ai][model-manifest]", {
      ok: false,
      stage: "manifest",
      reason,
      productId: parsed.value.productId,
      purchaseTokenHashPrefix: tokenHashPrefix(parsed.value.purchaseToken),
      aiMode: parsed.value.aiMode,
      bucketConfigured: Boolean(GCS_MODEL_BUCKET),
      activeModelObject: ACTIVE_MODEL_OBJECT,
    });
    return NextResponse.json(
      {
        reason,
      },
      { status: 503 }
    );
  }
}

async function parseRequest(
  req: NextRequest
): Promise<{ ok: true; value: ManifestRequest } | { ok: false; reason: string }> {
  let body: {
    product_id?: string;
    purchase_token?: string;
    ai_mode?: boolean | string;
    api_mode?: boolean | string;
  } = {};
  try {
    const raw = await req.text();
    if (raw.trim()) {
      body = JSON.parse(raw) as typeof body;
    }
  } catch {
    return { ok: false, reason: "Invalid request body." };
  }

  const query = req.nextUrl?.searchParams ?? new URL(req.url).searchParams;
  const productId = String(body.product_id || "").trim();
  const purchaseToken = String(body.purchase_token || "").trim() || undefined;
  const aiMode =
    parseBooleanClaim(query.get("ai_mode")) ||
    parseBooleanClaim(query.get("api_mode")) ||
    parseBooleanClaim(body.ai_mode) ||
    parseBooleanClaim(body.api_mode) ||
    productId === PLAY_AI_PRODUCT_ID;
  const integrityToken =
    req.headers.get("x-linkguard-play-integrity-token")?.trim() || "";
  const integrityRequestHash =
    req.headers.get("x-linkguard-play-integrity-request-hash")?.trim() || "";

  if (!aiMode) {
    return { ok: false, reason: "Missing AI Mode claim." };
  }

  return {
    ok: true,
    value: {
      productId,
      purchaseToken,
      aiMode,
      integrityToken,
      integrityRequestHash,
    },
  };
}

function validateConfig(): { ok: true } | { ok: false; reason: string } {
  const missing: string[] = [];
  if (!PLAY_PACKAGE_NAME) missing.push("LINKGUARD_PLAY_PACKAGE_NAME");
  if (!PLAY_SERVICE_ACCOUNT_JSON) {
    missing.push("LINKGUARD_PLAY_SERVICE_ACCOUNT_JSON");
  }
  if (!GCS_MODEL_BUCKET) missing.push("GCS_MODEL_BUCKET");
  if (missing.length > 0) {
    return { ok: false, reason: `Missing env vars: ${missing.join(", ")}.` };
  }
  return { ok: true };
}

async function verifyPlayIntegrity(input: {
  token: string;
  requestHash: string;
  expectedRequestHashes: string[];
}): Promise<{ ok: boolean; reason: string }> {
  if (!input.token || !input.requestHash) {
    return { ok: false, reason: "Missing Play Integrity token." };
  }
  if (!input.expectedRequestHashes.includes(input.requestHash)) {
    return { ok: false, reason: "Play Integrity request hash mismatch." };
  }

  try {
    const decoded = await decodeIntegrityToken(input.token);
    const external = decoded.tokenPayloadExternal;
    const requestDetails = external?.requestDetails;
    if (requestDetails?.requestPackageName !== PLAY_PACKAGE_NAME) {
      return { ok: false, reason: "Package name mismatch in Play Integrity token." };
    }
    if (!input.expectedRequestHashes.includes(requestDetails?.requestHash || "")) {
      return {
        ok: false,
        reason: "Play Integrity token request hash mismatch.",
      };
    }

    const appVerdict = external?.appIntegrity?.appRecognitionVerdict || "";
    if (!PLAY_ALLOWED_APP_VERDICTS.includes(appVerdict)) {
      return {
        ok: false,
        reason: `Disallowed app verdict: ${appVerdict || "unknown"}.`,
      };
    }

    const deviceVerdicts =
      external?.deviceIntegrity?.deviceRecognitionVerdict || [];
    const hasAllowedDeviceVerdict = deviceVerdicts.some((verdict) =>
      PLAY_ALLOWED_DEVICE_VERDICTS.includes(verdict)
    );
    if (!hasAllowedDeviceVerdict) {
      return { ok: false, reason: "Device integrity verdict is not acceptable." };
    }
  } catch (error) {
    return {
      ok: false,
      reason: `Play Integrity verification failed: ${
        error instanceof Error ? error.message : "unknown"
      }`,
    };
  }

  return { ok: true, reason: "ok" };
}

async function decodeIntegrityToken(
  token: string
): Promise<DecodedIntegrityPayload> {
  const accessToken = await googleAccessToken([
    "https://www.googleapis.com/auth/playintegrity",
  ]);
  const endpoint = `https://playintegrity.googleapis.com/v1/${PLAY_PACKAGE_NAME}:decodeIntegrityToken`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ integrityToken: token }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Google decode failed (${response.status}).`);
  }
  return (await response.json()) as DecodedIntegrityPayload;
}

async function readActiveManifest(): Promise<Record<string, unknown>> {
  const active = await readGcsJson(ACTIVE_MODEL_OBJECT);
  if (active.manifest && typeof active.manifest === "object") {
    return active.manifest as Record<string, unknown>;
  }
  if (isManifest(active)) {
    return active;
  }

  const manifestPath = String(active.manifest_path || "").trim();
  if (!isSafeGcsObjectPath(manifestPath)) {
    throw new Error("AI model manifest pointer is invalid.");
  }
  const manifest = await readGcsJson(manifestPath);
  if (manifest.manifest && typeof manifest.manifest === "object") {
    return manifest.manifest as Record<string, unknown>;
  }
  if (!isManifest(manifest)) {
    throw new Error("AI model manifest is invalid.");
  }
  return manifest;
}

async function readGcsJson(objectName: string): Promise<Record<string, unknown>> {
  const accessToken = await googleAccessToken([
    "https://www.googleapis.com/auth/devstorage.read_only",
  ]);
  const endpoint =
    `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(GCS_MODEL_BUCKET)}` +
    `/o/${encodeURIComponent(objectName)}?alt=media`;
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("AI model manifest is unavailable.");
  }
  return (await response.json()) as Record<string, unknown>;
}

function isManifest(value: Record<string, unknown>): boolean {
  return (
    typeof value.model_version === "string" &&
    typeof value.model_file === "string" &&
    typeof value.sha256 === "string" &&
    typeof value.size_bytes === "number" &&
    typeof value.signature_algorithm === "string" &&
    typeof value.signature === "string"
  );
}

function isSafeGcsObjectPath(value: string): boolean {
  return (
    value.length > 0 &&
    !value.startsWith("/") &&
    !value.includes("..") &&
    !value.includes("\\") &&
    !/[\u0000-\u001f]/.test(value)
  );
}

function modelObjectFromManifest(manifest: Record<string, unknown>): string {
  const version = String(manifest.model_version || "").replace(/^v/i, "");
  const file = String(manifest.model_file || "").trim();
  if (!version || !file || file.includes("/") || file.includes("..")) {
    throw new Error("AI model manifest has invalid model file metadata.");
  }
  return `scamguard-ai/v${version}/${file}`;
}

function signGcsReadUrl(input: {
  bucket: string;
  objectName: string;
  expiresInSeconds: number;
}): string {
  const credentials = serviceAccountCredentials();
  const now = new Date();
  const date = formatGcsDate(now);
  const dateScope = date.slice(0, 8);
  const scope = `${dateScope}/auto/storage/goog4_request`;
  const credential = `${credentials.client_email}/${scope}`;
  const canonicalUri = `/${input.bucket}/${encodeGcsObjectName(input.objectName)}`;
  const query = new URLSearchParams({
    "X-Goog-Algorithm": "GOOG4-RSA-SHA256",
    "X-Goog-Credential": credential,
    "X-Goog-Date": date,
    "X-Goog-Expires": String(input.expiresInSeconds),
    "X-Goog-SignedHeaders": "host",
  });
  query.sort();
  const canonicalQuery = query.toString();
  const canonicalRequest = [
    "GET",
    canonicalUri,
    canonicalQuery,
    "host:storage.googleapis.com\n",
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");
  const requestHash = crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex");
  const stringToSign = [
    "GOOG4-RSA-SHA256",
    date,
    scope,
    requestHash,
  ].join("\n");
  const signature = crypto
    .sign("RSA-SHA256", Buffer.from(stringToSign), credentials.private_key)
    .toString("hex");
  return `https://storage.googleapis.com${canonicalUri}?${canonicalQuery}&X-Goog-Signature=${signature}`;
}

async function googleAccessToken(scopes: string[]): Promise<string> {
  const auth = new GoogleAuth({
    credentials: serviceAccountCredentials(),
    scopes,
  });
  const client = await auth.getClient();
  const response = await client.getAccessToken();
  if (!response.token) throw new Error("Could not obtain Google access token.");
  return response.token;
}

function serviceAccountCredentials(): {
  client_email: string;
  private_key: string;
  [key: string]: unknown;
} {
  const raw = decodeServiceAccountJson(PLAY_SERVICE_ACCOUNT_JSON);
  const credentials = JSON.parse(raw) as {
    client_email?: string;
    private_key?: string;
    [key: string]: unknown;
  };
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Service account JSON is missing signing credentials.");
  }
  return {
    ...credentials,
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  };
}

function decodeServiceAccountJson(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("{")) return trimmed;
  return Buffer.from(trimmed, "base64").toString("utf8");
}

function buildLegacyManifestRequestHash(input: {
  productId: string;
  purchaseToken: string;
}): string {
  const raw = `product_id=${input.productId}&purchase_token=${input.purchaseToken}`;
  return crypto.createHash("sha256").update(raw).digest("base64url");
}

function buildAiModeRequestHash(): string {
  return crypto.createHash("sha256").update("ai_mode=true").digest("base64url");
}

function tokenHashPrefix(value: string | undefined): string | null {
  if (!value) return null;
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 10);
}

function parseBooleanClaim(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value !== "string") return false;
  return value.trim().toLowerCase() === "true";
}

function encodeGcsObjectName(objectName: string): string {
  return objectName.split("/").map(encodeURIComponent).join("/");
}

function formatGcsDate(date: Date): string {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}
