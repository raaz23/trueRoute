/**
 * Sync .env.local vars to Vercel (production). Skips DATABASE_URL sqlite.
 * Usage: node scripts/sync-vercel-env.mjs
 */
import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";

const envFile = existsSync(".env.local") ? ".env.local" : existsSync(".env") ? ".env" : null;
if (!envFile) {
  console.log("No .env.local or .env found — skip env sync");
  process.exit(0);
}

const skip = new Set(["DATABASE_URL"]);
const lines = readFileSync(envFile, "utf8").split(/\r?\n/);

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq < 1) continue;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  if (skip.has(key)) continue;
  if (!value || value.includes("your-") || value.includes("localhost")) {
    if (key === "NEXT_PUBLIC_SITE_URL") continue;
  }

  console.log(`Setting ${key}...`);
  const result = spawnSync("npx", ["--yes", "vercel@latest", "env", "add", key, "production", "--force"], {
    input: value,
    encoding: "utf8",
    shell: true,
  });
  if (result.status !== 0) {
    console.warn(`  warn: ${key} — ${result.stderr?.trim() || result.stdout?.trim()}`);
  }
}

console.log("Env sync done.");
