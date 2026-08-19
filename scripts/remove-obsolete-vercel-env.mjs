import { execSync } from "child_process";

const obsoleteVars = [
  "RAZORPAY_TEST_KEY_ID",
  "RAZORPAY_TEST_KEY_SECRET",
  "RAZORPAY_TEST_MONTHLY_PLAN_ID",
  "RAZORPAY_TEST_YEARLY_PLAN_ID",
  "MAILTRAP_HOST",
  "MAILTRAP_PORT",
  "MAILTRAP_USER",
  "MAILTRAP_PASS",
];

console.log("🧹 Removing obsolete environment variables from Vercel...\n");

for (const varName of obsoleteVars) {
  console.log(`🗑️ Removing ${varName} from Vercel...`);
  try {
    const out = execSync(`pnpm dlx vercel env rm ${varName} --yes`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    console.log(`  ✅ Successfully removed ${varName}.`);
  } catch (err) {
    const msg = err.stderr || err.stdout || err.message;
    console.log(`  ℹ️ Result for ${varName}: ${msg.trim().split("\n")[0]}`);
  }
}

console.log("\n✨ Cleanup of obsolete variables completed!");
