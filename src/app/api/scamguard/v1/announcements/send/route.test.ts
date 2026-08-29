import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

const send = vi.fn();

vi.mock("@/lib/firebase-admin", () => ({
  messaging: { send },
}));

describe("scamguard v1 announcements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("LINKGUARD_BEARER_TOKEN", "test-token");
  });

  test("preserves bearer authentication", async () => {
    const { POST } = await import("./route");
    const response = await POST(announcementRequest());

    expect(response.status).toBe(401);
  });

  test("supports authenticated dry runs without sending FCM", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      announcementRequest({ authorization: "Bearer test-token", dryRun: true })
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({ success: true, dryRun: true, topic: "announcements" });
    expect(send).not.toHaveBeenCalled();
  });
});

function announcementRequest(input: {
  authorization?: string;
  dryRun?: boolean;
} = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (input.authorization) headers.authorization = input.authorization;
  return new Request("https://www.minifyn.com/api/scamguard/v1/announcements/send", {
    method: "POST",
    headers,
    body: JSON.stringify({ title: "Security update", body: "Stay alert.", dryRun: input.dryRun }),
  }) as NextRequest;
}
