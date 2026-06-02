import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("google-auth-library", () => ({
  GoogleAuth: vi.fn().mockImplementation(function GoogleAuth() {
    return {
      getClient: async () => ({
        getAccessToken: async () => ({ token: "access-token" }),
      }),
    };
  }),
}));

describe("scamguard AI model manifest route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    stubBackendConfig();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("rejects requests without Play Integrity proof", async () => {
    vi.stubEnv("LINKGUARD_PLAY_INTEGRITY_ENFORCE", "true");
    const { POST } = await import("./route");

    const response = await POST(
      manifestRequest({
        body: { product_id: "ai_mode", purchase_token: "purchase-token" },
      })
    );
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.reason).toContain("Missing Play Integrity token");
  });

  test("rejects requests with mismatched Play Integrity request hashes", async () => {
    vi.stubEnv("LINKGUARD_PLAY_INTEGRITY_ENFORCE", "true");
    const { POST } = await import("./route");

    const response = await POST(
      manifestRequest({
        body: { product_id: "ai_mode", purchase_token: "purchase-token" },
        requestHash: "wrong-request-hash",
      })
    );
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.reason).toContain("request hash mismatch");
  });

  test("allows active AI subscriptions when Play Integrity enforcement is disabled", async () => {
    const purchaseToken = "purchase-token";
    const manifest = {
      model_version: "7",
      feature_schema_version: "1.0.0",
      runtime: "tensorflow-lite",
      model_file: "model_v7.tflite",
      download_url: "https://example.com/model_v7.tflite",
      sha256: "a".repeat(64),
      size_bytes: 123,
      signature_algorithm: "ed25519",
      signing_key_id: "prod-2026-05",
      signature: "signed",
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("https://androidpublisher.googleapis.com/")) {
        return Response.json({
          subscriptionState: "SUBSCRIPTION_STATE_ACTIVE",
          lineItems: [{ productId: "ai_mode" }],
        });
      }
      if (url.startsWith("https://storage.googleapis.com/storage/v1/")) {
        return Response.json(manifest);
      }
      return new Response("unexpected", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const response = await POST(
      manifestRequest({
        body: { product_id: "ai_mode", purchase_token: purchaseToken },
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.manifest).toMatchObject(manifest);
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.stringContaining("https://playintegrity.googleapis.com/"),
      expect.any(Object)
    );
  });

  test("accepts AI mode claims without server-side subscription verification", async () => {
    const requestHash = apiModeRequestHash();
    const manifest = {
      model_version: "7",
      feature_schema_version: "1.0.0",
      runtime: "tensorflow-lite",
      model_file: "model_v7.tflite",
      download_url: "https://example.com/model_v7.tflite",
      sha256: "a".repeat(64),
      size_bytes: 123,
      signature_algorithm: "ed25519",
      signing_key_id: "prod-2026-05",
      signature: "signed",
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("https://playintegrity.googleapis.com/")) {
        return Response.json(integrityPayload(requestHash));
      }
      if (url.startsWith("https://storage.googleapis.com/storage/v1/")) {
        return Response.json(manifest);
      }
      return new Response("unexpected", { status: 404 });
    });
    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    const { POST } = await import("./route");
    const response = await POST(
      manifestRequest({
        body: { api_mode: true },
        apiModeQuery: true,
        requestHash,
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.manifest).toMatchObject(manifest);
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.stringContaining("https://androidpublisher.googleapis.com/"),
      expect.any(Object)
    );
  });

  test("returns a manifest and short-lived signed GCS URL for active AI subscriptions", async () => {
    const purchaseToken = "purchase-token";
    const requestHash = manifestRequestHash("ai_mode", purchaseToken);
    const manifest = {
      model_version: "7",
      feature_schema_version: "1.0.0",
      runtime: "tensorflow-lite",
      model_file: "model_v7.tflite",
      download_url: "https://example.com/model_v7.tflite",
      sha256: "a".repeat(64),
      size_bytes: 123,
      signature_algorithm: "ed25519",
      signing_key_id: "prod-2026-05",
      signature: "signed",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.startsWith("https://playintegrity.googleapis.com/")) {
          return Response.json(integrityPayload(requestHash));
        }
        if (url.startsWith("https://androidpublisher.googleapis.com/")) {
          return Response.json({
            subscriptionState: "SUBSCRIPTION_STATE_ACTIVE",
            lineItems: [{ productId: "ai_mode" }],
          });
        }
        if (url.startsWith("https://storage.googleapis.com/storage/v1/")) {
          return Response.json(manifest);
        }
        return new Response("unexpected", { status: 404 });
      })
    );

    const { POST } = await import("./route");
    const response = await POST(
      manifestRequest({
        body: { product_id: "ai_mode", purchase_token: purchaseToken },
        requestHash,
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.manifest).toMatchObject(manifest);
    expect(json.download_url).toContain("X-Goog-Expires=900");
    expect(json.download_url).toContain("X-Goog-Signature=");
  });

  test("resolves active model pointers from GCS before signing the model URL", async () => {
    const purchaseToken = "purchase-token";
    const requestHash = manifestRequestHash("ai_mode", purchaseToken);
    const manifest = {
      model_version: "8",
      feature_schema_version: "1.0.0",
      runtime: "tensorflow-lite",
      model_file: "model_v8.tflite",
      download_url: "gs://linkguard-models/scamguard-ai/v8/model_v8.tflite",
      sha256: "b".repeat(64),
      size_bytes: 456,
      signature_algorithm: "ed25519",
      signing_key_id: "prod-2026-05",
      signature: "signed",
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("https://playintegrity.googleapis.com/")) {
        return Response.json(integrityPayload(requestHash));
      }
      if (url.startsWith("https://androidpublisher.googleapis.com/")) {
        return Response.json({
          subscriptionState: "SUBSCRIPTION_STATE_ACTIVE",
          lineItems: [{ productId: "ai_mode" }],
        });
      }
      if (url.includes("scamguard-ai%2Factive_model.json")) {
        return Response.json({
          active_version: "8",
          manifest_path: "scamguard-ai/v8/model_manifest.json",
          updated_at: "2026-05-15T00:00:00Z",
        });
      }
      if (url.includes("scamguard-ai%2Fv8%2Fmodel_manifest.json")) {
        return Response.json(manifest);
      }
      return new Response("unexpected", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const response = await POST(
      manifestRequest({
        body: { product_id: "ai_mode", purchase_token: purchaseToken },
        requestHash,
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.manifest).toMatchObject(manifest);
    expect(json.download_url).toContain("/linkguard-models/scamguard-ai/v8/model_v8.tflite");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("scamguard-ai%2Fv8%2Fmodel_manifest.json"),
      expect.any(Object)
    );
  });

  test("caps v3 active model updates to v13", async () => {
    const requestHash = apiModeRequestHash();
    const manifestV13 = {
      model_version: "13",
      feature_schema_version: "1.1.0",
      runtime: "tensorflow-lite",
      model_file: "model_v13.tflite",
      download_url: "gs://linkguard-models/scamguard-ai/v13/model_v13.tflite",
      sha256: "c".repeat(64),
      size_bytes: 456,
      signature_algorithm: "ed25519",
      signing_key_id: "prod-2026-05",
      signature: "signed",
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("https://playintegrity.googleapis.com/")) {
        return Response.json(integrityPayload(requestHash));
      }
      if (url.includes("scamguard-ai%2Factive_model.json")) {
        return Response.json({
          active_version: "14",
          manifest_path: "scamguard-ai/v14/model_manifest.json",
          updated_at: "2026-05-30T00:00:00Z",
        });
      }
      if (url.includes("scamguard-ai%2Fv13%2Fmodel_manifest.json")) {
        return Response.json(manifestV13);
      }
      return new Response("unexpected", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const response = await POST(
      manifestRequest({
        body: { api_mode: true },
        apiModeQuery: true,
        requestHash,
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.manifest).toMatchObject(manifestV13);
    expect(json.download_url).toContain("/linkguard-models/scamguard-ai/v13/model_v13.tflite");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("scamguard-ai%2Fv13%2Fmodel_manifest.json"),
      expect.any(Object)
    );
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.stringContaining("scamguard-ai%2Fv14%2Fmodel_manifest.json"),
      expect.any(Object)
    );
  });

  test("v4 follows active model versions above v13", async () => {
    const requestHash = apiModeRequestHash();
    const manifestV14 = {
      model_version: "14",
      feature_schema_version: "1.2.0",
      runtime: "tensorflow-lite",
      model_file: "model_v14.tflite",
      download_url: "gs://linkguard-models/scamguard-ai/v14/model_v14.tflite",
      sha256: "d".repeat(64),
      size_bytes: 789,
      signature_algorithm: "ed25519",
      signing_key_id: "prod-2026-05",
      signature: "signed",
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("https://playintegrity.googleapis.com/")) {
        return Response.json(integrityPayload(requestHash));
      }
      if (url.includes("scamguard-ai%2Factive_model.json")) {
        return Response.json({
          active_version: "14",
          manifest_path: "scamguard-ai/v14/model_manifest.json",
          updated_at: "2026-05-30T00:00:00Z",
        });
      }
      if (url.includes("scamguard-ai%2Fv14%2Fmodel_manifest.json")) {
        return Response.json(manifestV14);
      }
      return new Response("unexpected", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("../../v4/model-manifest/route");
    const response = await POST(
      manifestRequest({
        body: { api_mode: true },
        apiModeQuery: true,
        requestHash,
        apiVersion: "v4",
      })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.manifest).toMatchObject(manifestV14);
    expect(json.download_url).toContain("/linkguard-models/scamguard-ai/v14/model_v14.tflite");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("scamguard-ai%2Fv14%2Fmodel_manifest.json"),
      expect.any(Object)
    );
  });

  test("surfaces the failing GCS object when the active pointer cannot be read", async () => {
    const purchaseToken = "purchase-token";
    const requestHash = manifestRequestHash("ai_mode", purchaseToken);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.startsWith("https://playintegrity.googleapis.com/")) {
          return Response.json(integrityPayload(requestHash));
        }
        if (url.includes("scamguard-ai%2Factive_model.json")) {
          return new Response("missing", { status: 404 });
        }
        return new Response("unexpected", { status: 404 });
      })
    );

    const { POST } = await import("./route");
    const response = await POST(
      manifestRequest({
        body: { product_id: "ai_mode", purchase_token: purchaseToken },
        requestHash,
      })
    );
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.reason).toContain("scamguard-ai/active_model.json");
    expect(json.reason).toContain("(404)");
  });
});

function stubBackendConfig(): void {
  const { privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  const privateKeyPem = privateKey.export({
    format: "pem",
    type: "pkcs8",
  });
  vi.stubEnv("LINKGUARD_PLAY_PACKAGE_NAME", "com.minifyn.linkguard");
  vi.stubEnv(
    "LINKGUARD_PLAY_SERVICE_ACCOUNT_JSON",
    JSON.stringify({
      client_email: "test-service-account@example.iam.gserviceaccount.com",
      private_key: String(privateKeyPem),
    })
  );
  vi.stubEnv("LINKGUARD_PLAY_AI_PRODUCT_ID", "ai_mode");
  vi.stubEnv("GCS_MODEL_BUCKET", "linkguard-models");
}

function manifestRequest(input: {
  body: {
    product_id?: string;
    purchase_token?: string;
    ai_mode?: boolean;
    api_mode?: boolean;
  };
  requestHash?: string;
  apiModeQuery?: boolean;
  apiVersion?: "v3" | "v4";
}): NextRequest {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-linkguard-platform": "android",
    "x-linkguard-app-version": "1.0.0+1",
  };
  if (input.requestHash) {
    headers["x-linkguard-play-integrity-token"] = "integrity-token";
    headers["x-linkguard-play-integrity-request-hash"] = input.requestHash;
  }

  const apiVersion = input.apiVersion || "v3";
  const url = input.apiModeQuery
    ? `https://www.minifyn.com/api/scamguard-ai/${apiVersion}/model-manifest?api_mode=true`
    : `https://www.minifyn.com/api/scamguard-ai/${apiVersion}/model-manifest`;

  return new Request(url, {
    method: "POST",
    headers,
    body: JSON.stringify(input.body),
  }) as NextRequest;
}

function manifestRequestHash(productId: string, purchaseToken: string): string {
  return crypto
    .createHash("sha256")
    .update(`product_id=${productId}&purchase_token=${purchaseToken}`)
    .digest("base64url");
}

function apiModeRequestHash(): string {
  return crypto.createHash("sha256").update("api_mode=true").digest("base64url");
}

function integrityPayload(requestHash: string) {
  return {
    tokenPayloadExternal: {
      requestDetails: {
        requestPackageName: "com.minifyn.linkguard",
        requestHash,
      },
      appIntegrity: {
        appRecognitionVerdict: "PLAY_RECOGNIZED",
      },
      deviceIntegrity: {
        deviceRecognitionVerdict: ["MEETS_DEVICE_INTEGRITY"],
      },
    },
  };
}
