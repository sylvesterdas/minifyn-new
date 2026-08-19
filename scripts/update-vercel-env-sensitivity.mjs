import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Parse .env.local
const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
const envVars = {};

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    let key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Unescape \n
    val = val.replace(/\\n/g, "\n");
    envVars[key] = val;
  }
}

console.log(`Loaded ${Object.keys(envVars).length} environment variables from .env.local.`);

function setVercelEnv(name, target, value, isSensitive = false) {
  if (!value) {
    console.warn(`⚠️ Skipping ${name} for ${target} (no value found).`);
    return;
  }
  console.log(`⚙️ Setting ${name} for [${target}] (Sensitive: ${isSensitive})...`);
  try {
    const sensitiveFlag = isSensitive ? "--sensitive" : "--no-sensitive";
    // Pipe value to avoid CLI argument escaping issues with special chars and private keys
    execSync(
      `pnpm dlx vercel env add ${name} ${target} ${sensitiveFlag} --force --yes`,
      {
        input: value,
        stdio: ["pipe", "pipe", "pipe"],
        encoding: "utf-8",
      }
    );
    console.log(`  ✅ Successfully updated ${name} for [${target}].`);
  } catch (err) {
    console.error(`  ❌ Failed to set ${name} for ${target}:`, err.stderr || err.message);
  }
}

async function main() {
  console.log("🚀 Starting Vercel Environment Variables Sensitivity & Target Sync...\n");

  // 1. Secrets across Production & Preview (Mark as Sensitive)
  const sharedSensitive = [
    "FIREBASE_PRIVATE_KEY",
    "LINKGUARD_PLAY_SERVICE_ACCOUNT_JSON",
    "LINKGUARD_ENTITLEMENT_SIGNING_SECRET",
    "LINKGUARD_POLICY_SIGNING_KEY",
    "LINKGUARD_RECOVERY_SIGNING_SECRET",
    "SCAMGUARD_MODEL_SIGNING_KEY",
    "SPONSORSHIP_SESSION_SECRET",
    "OG_IMAGE_SECRET",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_SANDBOX_BUSINESS_PASSWORD",
    "RAZORPAY_WEBHOOK_SECRET",
    "HASHNODE_ACCESS_TOKEN",
    "NEXT_HASHNODE_ACCESS_TOKEN",
    "GEMINI_API_KEY",
    "LINKGUARD_WEBRISK_API_KEY",
    "WEBRISK_API_KEY",
    "REVALIDATION_TOKEN",
    "LINKGUARD_BEARER_TOKEN",
  ];

  for (const secret of sharedSensitive) {
    if (envVars[secret]) {
      // Set as sensitive in Production, Preview, and Development
      setVercelEnv(secret, "production,preview", envVars[secret], true);
      setVercelEnv(secret, "development", envVars[secret], false);
    }
  }

  // 2. Razorpay Production vs Dev/Preview
  // Production (Live)
  if (envVars.RAZORPAY_KEY_ID) {
    setVercelEnv("RAZORPAY_KEY_ID", "production", envVars.RAZORPAY_KEY_ID, false);
  }
  if (envVars.RAZORPAY_KEY_SECRET) {
    setVercelEnv("RAZORPAY_KEY_SECRET", "production", envVars.RAZORPAY_KEY_SECRET, true);
  }
  if (envVars.RAZORPAY_MONTHLY_PLAN_ID) {
    setVercelEnv("RAZORPAY_MONTHLY_PLAN_ID", "production", envVars.RAZORPAY_MONTHLY_PLAN_ID, false);
  }
  if (envVars.RAZORPAY_YEARLY_PLAN_ID) {
    setVercelEnv("RAZORPAY_YEARLY_PLAN_ID", "production", envVars.RAZORPAY_YEARLY_PLAN_ID, false);
  }

  // Dev & Preview (Test Keys)
  const testKeyId = envVars.RAZORPAY_TEST_KEY_ID || envVars.RAZORPAY_KEY_ID;
  const testKeySecret = envVars.RAZORPAY_TEST_KEY_SECRET || envVars.RAZORPAY_KEY_SECRET;
  const testMonthlyPlan = envVars.RAZORPAY_TEST_MONTHLY_PLAN_ID || envVars.RAZORPAY_MONTHLY_PLAN_ID;
  const testYearlyPlan = envVars.RAZORPAY_TEST_YEARLY_PLAN_ID || envVars.RAZORPAY_YEARLY_PLAN_ID;

  if (testKeyId) {
    setVercelEnv("RAZORPAY_KEY_ID", "preview,development", testKeyId, false);
  }
  if (testKeySecret) {
    setVercelEnv("RAZORPAY_KEY_SECRET", "preview,development", testKeySecret, false);
  }
  if (testMonthlyPlan) {
    setVercelEnv("RAZORPAY_MONTHLY_PLAN_ID", "preview,development", testMonthlyPlan, false);
  }
  if (testYearlyPlan) {
    setVercelEnv("RAZORPAY_YEARLY_PLAN_ID", "preview,development", testYearlyPlan, false);
  }

  // 3. Email (SMTP / Mailtrap)
  if (envVars.SMTP_PASS) {
    setVercelEnv("SMTP_PASS", "production", envVars.SMTP_PASS, true);
  }
  if (envVars.MAILTRAP_PASS) {
    setVercelEnv("MAILTRAP_PASS", "preview,development", envVars.MAILTRAP_PASS, false);
  }

  // 4. Origins and Payment Modes
  setVercelEnv("SPONSORSHIP_PUBLIC_ORIGIN", "production", "https://www.minifyn.com", false);
  setVercelEnv("SPONSORSHIP_PUBLIC_ORIGIN", "development", "http://localhost:9002", false);
  setVercelEnv("LINKGUARD_PAYMENT_MODE", "production", "live", false);
  setVercelEnv("LINKGUARD_PAYMENT_MODE", "preview,development", "test", false);

  console.log("\n✨ Vercel Environment Variables Sensitivity & Target Sync Completed!");
}

main().catch((err) => {
  console.error("Runner Error:", err);
  process.exit(1);
});
