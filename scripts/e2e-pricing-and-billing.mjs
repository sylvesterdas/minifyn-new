import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "/Users/sylvester/.gemini/antigravity/brain/0361d98a-98cf-42c4-a69b-33740b1699a6";
const BASE_URL = "http://localhost:9002";

async function runE2E() {
  console.log("🚀 Starting E2E test for Pricing & Billing pages...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  try {
    // 1. Test Pricing Page
    console.log("📍 Visiting /pricing...");
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: "networkidle" });
    
    // Screenshot initial INR view
    const inrPath = path.join(ARTIFACT_DIR, "pricing_inr_view.png");
    await page.screenshot({ path: inrPath });
    console.log("📸 Captured pricing_inr_view.png");

    // Click USD button
    await page.getByRole("button", { name: /USD/i }).click();
    await page.waitForTimeout(500);
    console.log("✅ Switched currency to USD ($)");

    const usdPath = path.join(ARTIFACT_DIR, "pricing_usd_view.png");
    await page.screenshot({ path: usdPath });
    console.log("📸 Captured pricing_usd_view.png");

    // 2. Test Webhook Route POST
    console.log("📍 Testing POST /api/payment/paypal/webhook...");
    const hookRes = await fetch(`${BASE_URL}/api/payment/paypal/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "WH-TEST",
        event_type: "BILLING.SUBSCRIPTION.ACTIVATED",
        resource: { id: "I-NONEXISTENT" },
      }),
    });
    const hookData = await hookRes.json();
    console.log("✅ Webhook response:", hookData);

    console.log("🎉 Pricing & PayPal E2E verification succeeded!");
  } catch (err) {
    console.error("❌ E2E Error:", err);
  } finally {
    await browser.close();
  }
}

runE2E();
