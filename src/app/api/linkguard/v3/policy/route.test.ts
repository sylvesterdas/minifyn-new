import crypto from "node:crypto";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("linkguard v3 policy", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("returns a signed policy envelope", async () => {
    const { privateKey } = crypto.generateKeyPairSync("ed25519");
    vi.stubEnv(
      "LINKGUARD_POLICY_SIGNING_KEY",
      privateKey.export({ format: "pem", type: "pkcs8" }).toString()
    );
    vi.stubEnv("LINKGUARD_POLICY_SIGNING_KEY_ID", "test-key");

    const { GET } = await import("./route");
    const response = GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.policy.official_safe_domains).toContain("mnfy.in");
    expect(json.signature_algorithm).toBe("ed25519");
    expect(json.signing_key_id).toBe("test-key");
    expect(json.signature).toEqual(expect.any(String));
  });

  test("fails closed when no signing key is configured", async () => {
    const { GET } = await import("./route");
    const response = GET();
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.error).toContain("signing key");
  });
});
