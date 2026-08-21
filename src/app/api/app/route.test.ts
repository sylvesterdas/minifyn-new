import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";
import { GET, OPTIONS } from "./route";

describe("/api/app discovery route", () => {
  test("returns 200 with app list, ETag, and Cache-Control headers on cold request", async () => {
    const request = new NextRequest("https://www.minifyn.com/api/app");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const etag = response.headers.get("etag");
    expect(etag).toBeTruthy();
    expect(response.headers.get("cache-control")).toContain("max-age=3600");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("vary")).toContain("If-None-Match");

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(3);
    expect(data.some((app: { packageId: string }) => app.packageId === "com.minifyn.clipfyn")).toBe(true);
  });

  test("returns 304 Not Modified when matching If-None-Match header is provided", async () => {
    const initialReq = new NextRequest("https://www.minifyn.com/api/app");
    const initialRes = await GET(initialReq);
    const etag = initialRes.headers.get("etag")!;

    const conditionalReq = new NextRequest("https://www.minifyn.com/api/app", {
      headers: {
        "if-none-match": etag,
      },
    });

    const response = await GET(conditionalReq);
    expect(response.status).toBe(304);
    expect(response.headers.get("etag")).toBe(etag);
  });

  test("handles OPTIONS preflight request with appropriate CORS headers", async () => {
    const response = await OPTIONS();
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("access-control-allow-methods")).toContain("GET");
    expect(response.headers.get("access-control-allow-headers")).toContain("If-None-Match");
  });
});
