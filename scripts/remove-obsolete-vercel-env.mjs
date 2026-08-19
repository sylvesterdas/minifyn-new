import { execSync } from "child_process";

const obsoleteVars = [
  "HASHNODE_ACCESS_TOKEN",
  "NEXT_HASHNODE_ACCESS_TOKEN",
  "HASHNODE_GQL_ENDPOINT",
  "HASHNODE_HOST",
  "HASHNODE_PUBLICATION_ID",
  "SPONSORSHIP_ADMIN_EMAILS",
  "SPONSORSHIP_PUBLIC_ORIGIN",
  "SPONSORSHIP_SESSION_SECRET",
  "OG_IMAGE_SECRET",
  "GEMINI_API_KEY",
  "VERCEL_OIDC_TOKEN",
];

console.log("🧹 Removing 11 unused/obsolete environment variables from Vercel...\n");

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

console.log("\n✨ Cleanup of 11 obsolete variables completed!");
