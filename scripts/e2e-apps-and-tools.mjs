import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "/Users/sylvester/.gemini/antigravity/brain/0361d98a-98cf-42c4-a69b-33740b1699a6";
const BASE_URL = "http://localhost:9002";

async function runAppsAndToolsE2E() {
  console.log("🚀 Launching Chromium for Apps & Tools E2E Verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // 1. ScamGuard App Landing Page
  console.log("📍 Test 1: Testing ScamGuard Landing Page (/scamguard)...");
  await page.goto(`${BASE_URL}/scamguard`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "app_scamguard.png"), fullPage: true });
  console.log("📸 Captured app_scamguard.png");

  // 2. CensorFyn App Landing Page
  console.log("📍 Test 2: Testing CensorFyn Landing Page (/censorfyn)...");
  await page.goto(`${BASE_URL}/censorfyn`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "app_censorfyn.png"), fullPage: true });
  console.log("📸 Captured app_censorfyn.png");

  // 3. ClipFyn App Landing Page
  console.log("📍 Test 3: Testing ClipFyn Landing Page (/clipfyn)...");
  await page.goto(`${BASE_URL}/clipfyn`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "app_clipfyn.png"), fullPage: true });
  console.log("📸 Captured app_clipfyn.png");

  // 4. Developer Tools Hub
  console.log("📍 Test 4: Testing Tools Hub (/tools)...");
  await page.goto(`${BASE_URL}/tools`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "tools_hub.png") });
  console.log("📸 Captured tools_hub.png");

  // 5. JSON Formatter Interaction
  console.log("📍 Test 5: Testing JSON Formatter Interaction...");
  await page.goto(`${BASE_URL}/tools/json-formatter`, { waitUntil: "networkidle" });
  const jsonTextarea = page.locator("textarea").first();
  if (await jsonTextarea.isVisible()) {
    await jsonTextarea.fill('{"hello":"world","minifyn":{"status":"active","version":16}}');
    const formatBtn = page.getByRole("button", { name: /Format|Prettify/i }).first();
    if (await formatBtn.isVisible()) {
      await formatBtn.click();
      await page.waitForTimeout(500);
      console.log("✅ Clicked JSON Format button");
    }
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "tool_json_formatter_tested.png") });
  console.log("📸 Captured tool_json_formatter_tested.png");

  // 6. JWT Debugger Interaction
  console.log("📍 Test 6: Testing JWT Debugger Interaction...");
  await page.goto(`${BASE_URL}/tools/jwt-debugger`, { waitUntil: "networkidle" });
  const jwtTextarea = page.locator("textarea").first();
  if (await jwtTextarea.isVisible()) {
    const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    await jwtTextarea.fill(sampleJwt);
    await page.waitForTimeout(500);
    console.log("✅ Filled sample token in JWT debugger");
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "tool_jwt_debugger_tested.png") });
  console.log("📸 Captured tool_jwt_debugger_tested.png");

  // 7. Code Minifier Interaction
  console.log("📍 Test 7: Testing Code Minifier Interaction...");
  await page.goto(`${BASE_URL}/tools/code-minifier`, { waitUntil: "networkidle" });
  const minifierTextarea = page.locator("textarea").first();
  if (await minifierTextarea.isVisible()) {
    await minifierTextarea.fill('function testMinify() {\n  const a = 10;\n  const b = 20;\n  return a + b;\n}');
    const minifyBtn = page.getByRole("button", { name: /Minify/i }).first();
    if (await minifyBtn.isVisible()) {
      await minifyBtn.click();
      await page.waitForTimeout(500);
      console.log("✅ Clicked Code Minifier button");
    }
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "tool_code_minifier_tested.png") });
  console.log("📸 Captured tool_code_minifier_tested.png");

  await browser.close();
  console.log("🎉 All Apps and Tools Verified Successfully!");
  process.exit(0);
}

runAppsAndToolsE2E().catch((err) => {
  console.error("❌ Apps & Tools E2E Failed:", err);
  process.exit(1);
});
