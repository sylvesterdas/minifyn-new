import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "/Users/sylvester/.gemini/antigravity/brain/0361d98a-98cf-42c4-a69b-33740b1699a6";
const BASE_URL = "http://localhost:9002";
const TEST_EMAIL = "test-dashboard-user@minifyn.com";
const TEST_PASSWORD = "Password123!";

async function runAuthenticatedDashboardE2E() {
  console.log("🚀 Setting up Verified Pro test user in Firebase...");
  const { auth, db } = await import("../src/lib/firebase-admin.ts");
  
  let user;
  try {
    user = await auth.getUserByEmail(TEST_EMAIL);
    await auth.updateUser(user.uid, {
      password: TEST_PASSWORD,
      emailVerified: true,
    });
  } catch {
    user = await auth.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      emailVerified: true,
      displayName: "Demo Pro User",
    });
  }

  // Ensure Pro profile in Realtime DB
  await db.ref(`user_profiles/${user.uid}`).set({
    email: TEST_EMAIL,
    name: "Demo Pro User",
    plan: "pro",
    onboardingCompleted: true,
    createdAt: Date.now(),
  });

  // Ensure sample links exist for the user
  const { createShortLink } = await import("../src/lib/data.ts");
  await createShortLink({ longUrl: "https://github.com/trending", userId: user.uid });
  await createShortLink({ longUrl: "https://news.ycombinator.com", userId: user.uid });

  console.log("🚀 Launching Chromium for End-to-End Logged-in User Experience...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // 1. Sign in through the actual UI login form
  console.log("📍 Step 1: Navigating to /auth/signin and signing in...");
  await page.goto(`${BASE_URL}/auth/signin`, { waitUntil: "networkidle" });
  await page.locator("input[type='email']").fill(TEST_EMAIL);
  await page.locator("input[type='password']").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /^Sign In$/i }).click();

  // Wait for redirect to /dashboard
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  console.log("✅ Successfully logged in through UI and redirected to /dashboard!");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "auth_dashboard_overview.png"), fullPage: true });
  console.log("📸 Captured auth_dashboard_overview.png");

  // 2. Links Management Page (/dashboard/links)
  console.log("📍 Step 2: Navigating to /dashboard/links...");
  await page.goto(`${BASE_URL}/dashboard/links`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "auth_dashboard_links.png"), fullPage: true });
  console.log("📸 Captured auth_dashboard_links.png");

  // 3. Analytics Page (/dashboard/analytics)
  console.log("📍 Step 3: Navigating to /dashboard/analytics...");
  await page.goto(`${BASE_URL}/dashboard/analytics`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "auth_dashboard_analytics.png"), fullPage: true });
  console.log("📸 Captured auth_dashboard_analytics.png");

  // 4. Settings Page (/dashboard/settings)
  console.log("📍 Step 4: Navigating to /dashboard/settings...");
  await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "auth_dashboard_settings.png"), fullPage: true });
  console.log("📸 Captured auth_dashboard_settings.png");

  await browser.close();
  console.log("🎉 Complete Authenticated In-Dashboard Testing Finished Successfully!");
  process.exit(0);
}

runAuthenticatedDashboardE2E().catch((err) => {
  console.error("❌ Authenticated Dashboard E2E Failed:", err);
  process.exit(1);
});
