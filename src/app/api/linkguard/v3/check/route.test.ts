import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("linkguard v3 reputation checks", () => {
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

  test("does not safe-list official trusted domains inside the reputation endpoint", async () => {
    const fetchMock = vi.fn(async () => new Response("unavailable", { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://docs.google/account"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("warning");
    expect(verdict.reason).toContain("Reputation checks are unavailable");
    expect(fetchMock).toHaveBeenCalled();
  });

  test("does not resolve trusted brand shorteners", async () => {
    vi.stubEnv("LINKGUARD_WEBRISK_API_KEY", "");
    const fetchMock = vi.fn(async () => new Response("https://clean.example/path\n"));
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const response = await POST(linkCheckRequest("https://share.google/abc123"));
    const verdict = await response.json();

    expect(verdict.risk).toBe("safe");
    expect(verdict.reason).toContain("No known issues found");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calls = fetchMock.mock.calls as unknown as [RequestInfo | URL][];
    expect(String(calls[0][0])).toBe("https://openphish.com/feed.txt");
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

  test("requests the full current Web Risk threat type set", async () => {
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
      "UNWANTED_SOFTWARE",
      "SOCIAL_ENGINEERING_EXTENDED_COVERAGE",
    ]);
  });
});

function linkCheckRequest(url: string): NextRequest {
  return new Request("https://www.minifyn.com/api/linkguard/v3/check", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url }),
  }) as NextRequest;
}
