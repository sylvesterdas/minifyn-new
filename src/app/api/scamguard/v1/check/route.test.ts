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

describe("scamguard v1 reputation checks", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    delete (globalThis as { __scamguardV1State__?: unknown }).__scamguardV1State__;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("returns warning when all configured reputation providers are unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("unavailable", { status: 503 }))
    );

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("warning");
    expect(verdict.reason).toContain("Reputation checks are unavailable");
  });

  test("returns safe with all 3 sources checked when clean", async () => {
    vi.stubEnv("LINKGUARD_WEBRISK_API_KEY", "test-key");
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("https://webrisk.googleapis.com/")) {
        return Response.json({});
      }
      return new Response("https://clean.example/path\n");
    });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/clean"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("safe");
    expect(verdict.reason).toContain("No known issues found");
    expect(verdict.sources_checked).toEqual(["webrisk", "openphish", "urlhaus"]);
  });

  test("returns risky when Web Risk reports a hit", async () => {
    vi.stubEnv("LINKGUARD_WEBRISK_API_KEY", "test-key");
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("https://webrisk.googleapis.com/")) {
        return Response.json({ threat: { threatTypes: ["MALWARE"] } });
      }
      return new Response("https://clean.example/path\n");
    });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("risky");
    expect(verdict.reason).toContain("known scam or malware reports");
  });

  test("returns risky when OpenPhish reports a hit", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("openphish")) {
          return new Response("https://example.com/login\n");
        }
        return new Response("https://clean.example/path\n");
      })
    );

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/login"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("risky");
    expect(verdict.reason).toContain("known scam or malware reports");
  });

  test("returns risky when URLhaus reports a hit", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("urlhaus")) {
          return new Response('"1","2026-08-25","https://malware.example/drop.apk","online"\n');
        }
        return new Response("https://clean.example/path\n");
      })
    );

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://malware.example/drop.apk"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("risky");
    expect(verdict.reason).toContain("known scam or malware reports");
  });

  test("rejects requests without Play Integrity proof when enforcement is enabled", async () => {
    stubIntegrityConfig();

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/"));
    const verdict = await response.json();

    expect(response.status).toBe(403);
    expect(response.headers.get("x-scamguard-integrity")).toBe("blocked");
    expect(verdict.reason).toContain("Missing Play Integrity token");
  });

  test.each([
    ["package", "wrong.example", "PLAY_RECOGNIZED", ["MEETS_DEVICE_INTEGRITY"], "LICENSED"],
    ["app", "com.minifyn.linkguard", "UNRECOGNIZED_VERSION", ["MEETS_DEVICE_INTEGRITY"], "LICENSED"],
    ["device", "com.minifyn.linkguard", "PLAY_RECOGNIZED", ["MEETS_VIRTUAL_INTEGRITY"], "LICENSED"],
    ["license", "com.minifyn.linkguard", "PLAY_RECOGNIZED", ["MEETS_DEVICE_INTEGRITY"], "UNLICENSED"],
  ])(
    "rejects invalid %s Play Integrity verdicts",
    async (_, packageName, appVerdict, deviceVerdicts, licensingVerdict) => {
      stubIntegrityConfig();
      const url = "https://example.com/";
      const requestHash = integrityRequestHash(url);
      vi.stubGlobal(
        "fetch",
        vi.fn(async (input: RequestInfo | URL) => {
          if (String(input).startsWith("https://playintegrity.googleapis.com/")) {
            return Response.json(
              integrityPayload({
                requestHash,
                packageName,
                appVerdict,
                deviceVerdicts,
                licensingVerdict,
              })
            );
          }
          return new Response("https://clean.example/path\n");
        })
      );

      const { POST } = await import("./route");
      const response = await POST(
        linkCheckRequest(url, {
          play_integrity_token: "integrity-token",
          play_integrity_request_hash: requestHash,
        })
      );

      expect(response.status).toBe(403);
    }
  );

  test("accepts recognized, device-trusted, licensed Play Integrity proof", async () => {
    stubIntegrityConfig();
    const url = "https://example.com/";
    const requestHash = integrityRequestHash(url);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).startsWith("https://playintegrity.googleapis.com/")) {
          return Response.json(integrityPayload({ requestHash }));
        }
        return new Response("https://clean.example/path\n");
      })
    );

    const { POST } = await import("./route");
    const response = await POST(
      linkCheckRequest(url, {
        play_integrity_token: "integrity-token",
        play_integrity_request_hash: requestHash,
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-scamguard-integrity")).not.toBe("blocked");
  });
});

function linkCheckRequest(
  url: string,
  extraBody: Record<string, string> = {}
): NextRequest {
  return new Request("https://www.minifyn.com/api/scamguard/v1/check", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url, ...extraBody }),
  }) as NextRequest;
}

function stubIntegrityConfig(): void {
  vi.stubEnv("LINKGUARD_PLAY_INTEGRITY_ENABLED", "true");
  vi.stubEnv("LINKGUARD_PLAY_INTEGRITY_ENFORCE", "true");
  vi.stubEnv("LINKGUARD_PLAY_PACKAGE_NAME", "com.minifyn.linkguard");
  vi.stubEnv("LINKGUARD_PLAY_SERVICE_ACCOUNT_JSON", "{}");
  vi.stubEnv("LINKGUARD_PLAY_REQUIRE_LICENSED", "true");
}

function integrityRequestHash(normalizedUrl: string): string {
  const urlHash = crypto.createHash("sha256").update(normalizedUrl).digest("hex");
  return crypto
    .createHash("sha256")
    .update(`url=${normalizedUrl}&url_hash=${urlHash}`)
    .digest("base64url");
}

function integrityPayload({
  requestHash,
  packageName = "com.minifyn.linkguard",
  appVerdict = "PLAY_RECOGNIZED",
  deviceVerdicts = ["MEETS_DEVICE_INTEGRITY"],
  licensingVerdict = "LICENSED",
}: {
  requestHash: string;
  packageName?: string;
  appVerdict?: string;
  deviceVerdicts?: string[];
  licensingVerdict?: string;
}) {
  return {
    tokenPayloadExternal: {
      requestDetails: { requestPackageName: packageName, requestHash },
      appIntegrity: { appRecognitionVerdict: appVerdict },
      deviceIntegrity: { deviceRecognitionVerdict: deviceVerdicts },
      accountDetails: { appLicensingVerdict: licensingVerdict },
    },
  };
}
