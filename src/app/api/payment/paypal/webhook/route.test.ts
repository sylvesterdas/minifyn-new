import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

const { verifyPayPalWebhookSignature } = vi.hoisted(() => ({
  verifyPayPalWebhookSignature: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/paypal", () => ({ verifyPayPalWebhookSignature }));

vi.mock("@/lib/firebase-admin", () => {
  const mockUpdate = vi.fn().mockResolvedValue(undefined);
  const mockSet = vi.fn().mockResolvedValue(undefined);
  const mockRef = vi.fn((path?: string) => ({
    get: vi.fn().mockImplementation(async () => {
      if (path?.startsWith("webhook_events")) {
        return { exists: () => false, val: () => null };
      }
      return {
        exists: () => true,
        val: () => ({
          user_123: {
            email: "testuser@example.com",
            subscription: {
              id: "I-TESTSUB123",
              status: "active",
            },
          },
        }),
      };
    }),
    update: mockUpdate,
    set: mockSet,
  }));

  return {
    db: {
      ref: mockRef,
    },
    auth: {},
  };
});

describe("PayPal Webhook Route Handler", () => {
  beforeEach(() => {
	vi.clearAllMocks();
	verifyPayPalWebhookSignature.mockResolvedValue(true);
  });

  it("rejects a webhook when PayPal signature verification fails", async () => {
    verifyPayPalWebhookSignature.mockResolvedValueOnce(false);
    const req = new NextRequest("http://localhost:3000/api/payment/paypal/webhook", {
      method: "POST",
      body: JSON.stringify({ id: "WH-INVALID", event_type: "BILLING.SUBSCRIPTION.ACTIVATED" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("handles BILLING.SUBSCRIPTION.ACTIVATED event and activates Pro", async () => {
    const payload = {
      id: "WH-12345",
      event_type: "BILLING.SUBSCRIPTION.ACTIVATED",
      resource: {
        id: "I-TESTSUB123",
        subscriber: {
          email_address: "testuser@example.com",
        },
      },
    };

    const req = new NextRequest("http://localhost:3000/api/payment/paypal/webhook", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("handles BILLING.SUBSCRIPTION.CANCELLED event and resets to Free", async () => {
    const payload = {
      id: "WH-67890",
      event_type: "BILLING.SUBSCRIPTION.CANCELLED",
      resource: {
        id: "I-TESTSUB123",
      },
    };

    const req = new NextRequest("http://localhost:3000/api/payment/paypal/webhook", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("returns received: true when subscription is not matched", async () => {
    const payload = {
      id: "WH-99999",
      event_type: "BILLING.SUBSCRIPTION.ACTIVATED",
      resource: {
        id: "I-UNKNOWN",
      },
    };

    const req = new NextRequest("http://localhost:3000/api/payment/paypal/webhook", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
    expect(body.note).toBe("User not found");
  });
});
