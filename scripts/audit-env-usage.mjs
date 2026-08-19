import fs from "fs";
import path from "path";

const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
const envVars = [];

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars.push(match[1].trim());
  }
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allSrcFiles = getAllFiles(path.resolve(process.cwd(), "src"));
const allFileContents = allSrcFiles.map((f) => ({
  path: f,
  content: fs.readFileSync(f, "utf-8"),
}));

console.log(`Auditing ${envVars.length} environment variables against ${allSrcFiles.length} source files...\n`);

const unused = [];
const used = [];

for (const varName of envVars) {
  let count = 0;
  const matchesIn = [];
  for (const { path: filePath, content } of allFileContents) {
    if (content.includes(varName)) {
      count++;
      matchesIn.push(path.relative(process.cwd(), filePath));
    }
  }

  if (count === 0) {
    unused.push(varName);
  } else {
    used.push({ varName, count, matchesIn });
  }
}

console.log("=== UNUSED / POTENTIALLY OBSOLETE ENVIRONMENT VARIABLES ===");
if (unused.length === 0) {
  console.log("None! All variables in .env.local are referenced.");
} else {
  unused.forEach((v) => console.log(`❌ ${v}`));
}

console.log("\n=== USED ENVIRONMENT VARIABLES ===");
used.forEach(({ varName, count, matchesIn }) => {
  console.log(`✅ ${varName} (${count} file(s)): ${matchesIn.slice(0, 3).join(", ")}${matchesIn.length > 3 ? "..." : ""}`);
});
