import { describe, it, expect, vi } from "vitest";
import { getCountryFromIP } from "../ip-to-country";
import { fetchMetadata } from "../scraper";

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
