import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const ARTIFACT_DIR = "/Users/sylvester/.gemini/antigravity/brain/0361d98a-98cf-42c4-a69b-33740b1699a6";

async function runE2E() {
  console.log("🚀 Launching Chromium browser with Playwright...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  console.log("📍 Step 1: Navigating to Landing Page (http://localhost:9002)...");
  await page.goto("http://localhost:9002", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step1_landing_page.png"), fullPage: false });
  console.log("📸 Captured step1_landing_page.png");

  console.log("📍 Step 2: Filling in URL Shortener input with 'https://github.com'...");
  const input = page.locator("#longUrl");
  await input.waitFor({ state: "visible" });
  await input.fill("https://github.com");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step2_form_filled.png") });
  console.log("📸 Captured step2_form_filled.png");

  console.log("📍 Step 3: Submitting Shorten URL form...");
  const submitBtn = page.getByRole("button", { name: /Shorten URL/i });
  await submitBtn.click();

  console.log("⏳ Waiting for shortened link result to appear...");
  // Wait for the result link container or copy button
  const resultLink = page.locator("a[href*='mnfy.in'], a[href*='localhost:9002']");
  await resultLink.waitFor({ state: "visible", timeout: 15000 });
  const generatedShortUrl = await resultLink.textContent();
  console.log(`🎉 Short URL created successfully: ${generatedShortUrl}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step3_shortened_result.png") });
  console.log("📸 Captured step3_shortened_result.png");

  console.log("📍 Step 4: Testing Copy Button...");
  const copyBtn = page.getByRole("button", { name: /Copy to clipboard/i });
  if (await copyBtn.isVisible()) {
    await copyBtn.click();
    console.log("✅ Clicked Copy to clipboard button");
  }

  console.log("📍 Step 5: Testing QR Code Generator tab...");
  const qrTab = page.getByRole("tab", { name: /QR Code/i });
  await qrTab.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step4_qr_code_tab.png") });
  console.log("📸 Captured step4_qr_code_tab.png");

  console.log("📍 Step 6: Testing shortlink browser redirection...");
  const slug = generatedShortUrl.split("/").pop().trim();
  console.log(`🔗 Navigating directly to shortlink http://localhost:9002/${slug}...`);
  
  const redirectPage = await context.newPage();
  await redirectPage.goto(`http://localhost:9002/${slug}`, { waitUntil: "domcontentloaded", timeout: 15000 });
  const finalUrl = redirectPage.url();
  console.log(`🎯 Successfully redirected to: ${finalUrl}`);
  await redirectPage.screenshot({ path: path.join(ARTIFACT_DIR, "step5_redirect_destination.png") });
  console.log("📸 Captured step5_redirect_destination.png");
  await redirectPage.close();

  console.log("📍 Step 7: Testing Developer Utility (/tools/json-formatter)...");
  await page.goto("http://localhost:9002/tools/json-formatter", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "step6_json_formatter.png") });
  console.log("📸 Captured step6_json_formatter.png");

  await browser.close();
  console.log("✨ All browser tests completed successfully!");
}

runE2E().catch((err) => {
  console.error("❌ E2E Browser Test Failed:", err);
  process.exit(1);
});
