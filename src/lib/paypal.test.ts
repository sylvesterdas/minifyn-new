import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPayPalBaseUrl, cancelPayPalSubscription } from "@/lib/paypal";

describe("PayPal Library Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.PAYPAL_CLIENT_ID = "mock_client_id";
    process.env.PAYPAL_CLIENT_SECRET = "mock_client_secret";
  });

  it("getPayPalBaseUrl returns correct base URL based on PAYPAL_ENVIRONMENT", () => {
    const originalEnv = process.env.PAYPAL_ENVIRONMENT;
    
    // Test Sandbox
    process.env.PAYPAL_ENVIRONMENT = "sandbox";
    expect(getPayPalBaseUrl()).toBe("https://api-m.sandbox.paypal.com");

    // Test Live
    process.env.PAYPAL_ENVIRONMENT = "live";
    expect(getPayPalBaseUrl()).toBe("https://api-m.paypal.com");

    // Restore
    process.env.PAYPAL_ENVIRONMENT = originalEnv;
  });

  it("cancelPayPalSubscription handles non-204 errors gracefully", async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (typeof url === "string" && url.includes("/v1/oauth2/token")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ access_token: "mock_token", expires_in: 3600 }),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 400,
        text: () => Promise.resolve("Subscription cannot be cancelled"),
      });
    }) as any;

    const result = await cancelPayPalSubscription("I-MOCK12345");
    expect(result.success).toBe(false);
    expect(result.error).toContain("Subscription cannot be cancelled");
  });
});
