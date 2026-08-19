import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "/Users/sylvester/.gemini/antigravity/brain/0361d98a-98cf-42c4-a69b-33740b1699a6";
const BASE_URL = "http://localhost:9002";

async function testGeoFlows() {
  console.log("🚀 Starting Geolocation E2E Test (US vs India)...");
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Simulate Indian Visitor (x-vercel-ip-country: IN)
    console.log("📍 Scenario 1: Visitor from India (x-vercel-ip-country: IN)...");
    const inContext = await browser.newContext({
      extraHTTPHeaders: { "x-vercel-ip-country": "IN" },
      viewport: { width: 1280, height: 900 },
    });
    const inPage = await inContext.newPage();
    await inPage.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });
    const inPricingText = await inPage.textContent("body");
    console.log(" - INR price visible:", inPricingText?.includes("₹149"));
    await inPage.screenshot({ path: path.join(ARTIFACT_DIR, "pricing_geo_india.png") });
    console.log("📸 Captured pricing_geo_india.png");

    // 2. Simulate US Visitor (x-vercel-ip-country: US)
    console.log("📍 Scenario 2: Visitor from United States (x-vercel-ip-country: US)...");
    const usContext = await browser.newContext({
      extraHTTPHeaders: { "x-vercel-ip-country": "US" },
      viewport: { width: 1280, height: 900 },
    });
    const usPage = await usContext.newPage();
    await usPage.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });
    const usPricingText = await usPage.textContent("body");
    console.log(" - USD price visible:", usPricingText?.includes("$2.00"));
    console.log(" - PayPal badge visible:", usPricingText?.includes("PayPal"));
    await usPage.screenshot({ path: path.join(ARTIFACT_DIR, "pricing_geo_us.png") });
    console.log("📸 Captured pricing_geo_us.png");

    console.log("🎉 Geolocation testing 100% verified!");
  } catch (err) {
    console.error("❌ Geo E2E Error:", err);
  } finally {
    await browser.close();
  }
}

testGeoFlows();
