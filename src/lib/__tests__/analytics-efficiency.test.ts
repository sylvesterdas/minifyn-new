import { describe, it, expect } from "vitest";
import {
  encodeRtdbKey,
  decodeRtdbKey,
  parseClientInfo,
  getCleanReferrer,
} from "../data";

describe("Analytics RTDB Key Sanitization", () => {
  it("encodes forbidden RTDB characters safely and reversibly", () => {
    const original = "https://sub.domain.com/path#hash[0]$val";
    const encoded = encodeRtdbKey(original);

    expect(encoded).not.toContain(".");
    expect(encoded).not.toContain("#");
    expect(encoded).not.toContain("$");
    expect(encoded).not.toContain("[");
    expect(encoded).not.toContain("]");
    expect(encoded).not.toContain("/");

    const decoded = decodeRtdbKey(encoded);
    expect(decoded).toBe(original);
  });

  it("handles domain names correctly", () => {
    const domain = "twitter.com";
    const encoded = encodeRtdbKey(domain);
    expect(encoded).toBe("twitter%2Ecom");
    expect(decodeRtdbKey(encoded)).toBe(domain);
  });
});

describe("Client Information & User-Agent Parsing", () => {
  it("detects mobile platforms accurately", () => {
    const iphoneUA =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
    const parsedIphone = parseClientInfo(iphoneUA);
    expect(parsedIphone.platform).toBe("iOS");
    expect(parsedIphone.browser).toBe("Safari");

    const androidUA =
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36";
    const parsedAndroid = parseClientInfo(androidUA);
    expect(parsedAndroid.platform).toBe("Android");
    expect(parsedAndroid.browser).toBe("Chrome");
  });

  it("detects desktop platforms and browsers", () => {
    const macChromeUA =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
    const parsedMac = parseClientInfo(macChromeUA);
    expect(parsedMac.platform).toBe("macOS");
    expect(parsedMac.browser).toBe("Chrome");

    const winFirefoxUA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0";
    const parsedWin = parseClientInfo(winFirefoxUA);
    expect(parsedWin.platform).toBe("Windows");
    expect(parsedWin.browser).toBe("Firefox");

    const edgeUA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0";
    const parsedEdge = parseClientInfo(edgeUA);
    expect(parsedEdge.browser).toBe("Edge");
  });

  it("returns fallback for unknown or empty user agent", () => {
    expect(parseClientInfo(null)).toEqual({
      browser: "Direct / Unknown",
      platform: "Unknown",
    });
    expect(parseClientInfo("")).toEqual({
      browser: "Direct / Unknown",
      platform: "Unknown",
    });
  });
});

describe("Referrer Cleaning", () => {
  it("extracts hostname and strips www prefix", () => {
    expect(getCleanReferrer("https://www.google.com/search?q=minifyn")).toBe(
      "google.com"
    );
    expect(getCleanReferrer("https://t.co/xyz123")).toBe("t.co");
    expect(getCleanReferrer("http://github.com")).toBe("github.com");
  });

  it("handles direct and empty referrers", () => {
    expect(getCleanReferrer("direct")).toBe("Direct");
    expect(getCleanReferrer(null)).toBe("Direct");
    expect(getCleanReferrer(undefined)).toBe("Direct");
    expect(getCleanReferrer("")).toBe("Direct");
  });
});
