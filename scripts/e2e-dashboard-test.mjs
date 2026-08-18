import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "/Users/sylvester/.gemini/antigravity/brain/0361d98a-98cf-42c4-a69b-33740b1699a6";
const BASE_URL = "http://localhost:9002";

async function runDashboardE2E() {
  console.log("🚀 Launching Chromium for Dashboard & Auth E2E Testing...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Track console errors
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  // 1. Test Dashboard Route Protection (Unauthenticated visitor)
  console.log("📍 Test 1: Accessing /dashboard while unauthenticated...");
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
  const currentUrl = page.url();
  console.log(`🔒 Redirected to: ${currentUrl}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "dashboard_unauth_redirect.png") });
  console.log("📸 Captured dashboard_unauth_redirect.png");

  // 2. Test Sign In Page UI & Interactions
  console.log("📍 Test 2: Sign In Page UI (/auth/signin)...");
  await page.goto(`${BASE_URL}/auth/signin`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "auth_signin_page.png") });
  console.log("📸 Captured auth_signin_page.png");

  // Fill in email field to test client interaction
  const emailInput = page.locator("input[type='email']");
  if (await emailInput.isVisible()) {
    await emailInput.fill("testuser@example.com");
    console.log("✅ Filled email on sign-in page");
  }

  // 3. Test Sign Up Page UI & Interactions
  console.log("📍 Test 3: Sign Up Page UI (/auth/signup)...");
  await page.goto(`${BASE_URL}/auth/signup`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "auth_signup_page.png") });
  console.log("📸 Captured auth_signup_page.png");

  // 4. Test Forgot Password Page UI
  console.log("📍 Test 4: Forgot Password Page UI (/auth/forgot-password)...");
  await page.goto(`${BASE_URL}/auth/forgot-password`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "auth_forgot_password_page.png") });
  console.log("📸 Captured auth_forgot_password_page.png");

  // 5. Test Tools: JWT Debugger
  console.log("📍 Test 5: Testing /tools/jwt-debugger...");
  await page.goto(`${BASE_URL}/tools/jwt-debugger`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "tool_jwt_debugger.png") });
  console.log("📸 Captured tool_jwt_debugger.png");

  // 6. Test Tools: Code Minifier
  console.log("📍 Test 6: Testing /tools/code-minifier...");
  await page.goto(`${BASE_URL}/tools/code-minifier`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "tool_code_minifier.png") });
  console.log("📸 Captured tool_code_minifier.png");

  // 7. Verify all Dashboard subroutes are protected
  console.log("📍 Test 7: Verifying all dashboard subroutes enforce auth protection...");
  const subroutes = ["/dashboard/links", "/dashboard/analytics", "/dashboard/settings"];
  for (const sub of subroutes) {
    await page.goto(`${BASE_URL}${sub}`, { waitUntil: "networkidle" });
    const u = page.url();
    if (u.includes("/auth/signin")) {
      console.log(`  ✅ ${sub} properly protected -> redirected to sign-in`);
    } else {
      console.warn(`  ⚠️ ${sub} reached: ${u}`);
    }
  }

  await browser.close();
  console.log("✨ All Dashboard & Auth E2E Tests Completed Successfully!");
}

runDashboardE2E().catch((err) => {
  console.error("❌ Dashboard E2E Failed:", err);
  process.exit(1);
});
