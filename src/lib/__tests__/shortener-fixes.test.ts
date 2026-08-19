import { describe, it, expect, vi } from "vitest";
import { getCountryFromIP } from "../ip-to-country";
import { fetchMetadata } from "../scraper";
import { urlSchema } from "../schema";

describe("IP Geolocation - ipToLong & getCountryFromIP", () => {
  it("correctly identifies US for IPs >= 128.0.0.0 without signed integer overflow", async () => {
    // 185.199.108.153 (GitHub Pages - US in geoDb)
    const country = await getCountryFromIP("185.199.108.10");
    expect(country).toBe("US");
  });

  it("correctly identifies India for Indian IP ranges", async () => {
    // 202.89.64.10 (India in geoDb)
    const country = await getCountryFromIP("202.89.64.10");
    expect(country).toBe("IN");
  });

  it("returns null for private IPs and localhost", async () => {
    expect(await getCountryFromIP("127.0.0.1")).toBeNull();
    expect(await getCountryFromIP("192.168.1.1")).toBeNull();
    expect(await getCountryFromIP("10.0.0.1")).toBeNull();
    expect(await getCountryFromIP("172.16.0.1")).toBeNull();
    expect(await getCountryFromIP("::1")).toBeNull();
  });
});

describe("Scraper SSRF Protection", () => {
  it("blocks local and internal URLs from being fetched", async () => {
    const localhostRes = await fetchMetadata("http://localhost:3000/test");
    expect(localhostRes).toEqual({});

    const loopbackRes = await fetchMetadata("http://127.0.0.1:8080/admin");
    expect(loopbackRes).toEqual({});

    const metadataGcpRes = await fetchMetadata("http://169.254.169.254/computeMetadata/v1/");
    expect(metadataGcpRes).toEqual({});

    const privateSubnetRes = await fetchMetadata("http://192.168.1.100/config");
    expect(privateSubnetRes).toEqual({});

    const privateClassARes = await fetchMetadata("http://10.10.10.10/");
    expect(privateClassARes).toEqual({});
  });

  it("blocks non-HTTP protocols", async () => {
    const fileRes = await fetchMetadata("file:///etc/passwd");
    expect(fileRes).toEqual({});

    const ftpRes = await fetchMetadata("ftp://example.com/file");
    expect(ftpRes).toEqual({});
  });
});

describe("URL Schema Validation & Protocol Enforcement", () => {
  it("accepts valid HTTP and HTTPS URLs", async () => {
    const res1 = await urlSchema.safeParseAsync({ longUrl: "https://example.com/page" });
    expect(res1.success).toBe(true);

    const res2 = await urlSchema.safeParseAsync({ longUrl: "http://example.org/path?q=1" });
    expect(res2.success).toBe(true);
  });

  it("rejects dangerous or non-HTTP protocols", async () => {
    const jsRes = await urlSchema.safeParseAsync({ longUrl: "javascript:alert(1)" });
    expect(jsRes.success).toBe(false);

    const dataRes = await urlSchema.safeParseAsync({ longUrl: "data:text/html,<script>alert(1)</script>" });
    expect(dataRes.success).toBe(false);

    const fileRes = await urlSchema.safeParseAsync({ longUrl: "file:///etc/passwd" });
    expect(fileRes.success).toBe(false);
  });

  it("rejects direct links to dangerous executable files", async () => {
    const exeRes = await urlSchema.safeParseAsync({ longUrl: "https://example.com/downloads/setup.exe" });
    expect(exeRes.success).toBe(false);

    const apkRes = await urlSchema.safeParseAsync({ longUrl: "https://example.com/app.apk" });
    expect(apkRes.success).toBe(false);

    const batRes = await urlSchema.safeParseAsync({ longUrl: "https://example.com/run.bat" });
    expect(batRes.success).toBe(false);

    const msiRes = await urlSchema.safeParseAsync({ longUrl: "https://example.com/installer.msi" });
    expect(msiRes.success).toBe(false);
  });
});


