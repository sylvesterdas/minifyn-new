import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("legacy linkguard reputation checks", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    delete (globalThis as { __linkguardState__?: unknown }).__linkguardState__;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("keeps legacy safe result when reputation providers are unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("unavailable", { status: 503 }))
    );

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("safe");
    expect(verdict.reason).toContain("No known issues found");
  });

  test("does not enforce Play Integrity from the v2 global flag on legacy checks", async () => {
    vi.stubEnv("LINKGUARD_PLAY_INTEGRITY_ENABLED", "true");
    vi.stubEnv("LINKGUARD_PLAY_INTEGRITY_ENFORCE", "true");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("https://clean.example/path\n"))
    );

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/"));
    const verdict = await response.json();

    expect(response.status).toBe(200);
    expect(verdict.risk).toBe("safe");
  });

  test("can still explicitly enforce Play Integrity on legacy checks", async () => {
    vi.stubEnv("LINKGUARD_PLAY_INTEGRITY_ENABLED", "true");
    vi.stubEnv("LINKGUARD_PLAY_INTEGRITY_ENFORCE_LEGACY", "true");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("https://clean.example/path\n"))
    );

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/"));
    const verdict = await response.json();

    expect(response.status).toBe(403);
    expect(response.headers.get("x-linkguard-integrity")).toBe("blocked");
    expect(verdict.reason).toContain("Play Integrity");
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
      vi.fn(async () => new Response("https://example.com/login\n"))
    );

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://example.com/login"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("risky");
    expect(verdict.reason).toContain("known scam or malware reports");
  });

  test("keeps the legacy Web Risk threat type set", async () => {
    vi.stubEnv("LINKGUARD_WEBRISK_API_KEY", "test-key");
    let webRiskUrl = "";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.startsWith("https://webrisk.googleapis.com/")) {
          webRiskUrl = url;
          return Response.json({});
        }
        return new Response("https://clean.example/path\n");
      })
    );

    const { POST } = await import("./route");
    await POST(linkCheckRequest("https://example.com/"));

    const threatTypes = new URL(webRiskUrl).searchParams.getAll("threatTypes");
    expect(threatTypes).toEqual([
      "MALWARE",
      "SOCIAL_ENGINEERING",
    ]);
  });
});

function linkCheckRequest(url: string): NextRequest {
  return new Request("https://www.minifyn.com/api/linkguard/check", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url }),
  }) as NextRequest;
}
