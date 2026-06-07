/**
 * Applies marketplace storage buckets + optional SQL via SUPABASE_DB_URL.
 * Usage: node scripts/setup-supabase-marketplace.mjs
 */
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const vars = {};
  for (const f of [".env.local", ".env"]) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      vars[trimmed.slice(0, eq).trim()] = val;
    }
  }
  return vars;
}

const env = { ...process.env, ...loadEnvLocal() };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const svc = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !svc) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function ensureBucket(id, { public: isPublic, fileSizeLimit, allowedMimeTypes }) {
  const list = await fetch(`${url}/storage/v1/bucket`, {
    headers: { apikey: svc, Authorization: `Bearer ${svc}` },
  });
  const buckets = await list.json();
  if (Array.isArray(buckets) && buckets.some((b) => b.name === id || b.id === id)) {
    console.log(`✅ Bucket exists: ${id}`);
    return;
  }
  const res = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: svc,
      Authorization: `Bearer ${svc}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name: id,
      public: isPublic,
      file_size_limit: fileSizeLimit,
      allowed_mime_types: allowedMimeTypes,
    }),
  });
  const body = await res.text();
  if (res.ok || body.includes("already exists")) {
    console.log(`✅ Bucket ready: ${id}`);
  } else {
    console.error(`❌ Bucket ${id}:`, res.status, body.slice(0, 200));
  }
}

console.log("=== Setting up Supabase marketplace storage ===\n");

await ensureBucket("business-media", {
  public: true,
  fileSizeLimit: 5242880,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4"],
});

await ensureBucket("business-documents", {
  public: false,
  fileSizeLimit: 10485760,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
});

const dbUrl = env.SUPABASE_DB_URL || env.DIRECT_URL;
if (dbUrl?.startsWith("postgres")) {
  try {
    const { default: pg } = await import("pg");
    const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const sqlPath = join(root, "supabase", "marketplace.sql");
    const sql = readFileSync(sqlPath, "utf8");
    await client.query(sql);
    console.log("\n✅ Applied supabase/marketplace.sql via SUPABASE_DB_URL");
    await client.end();
  } catch (e) {
    console.error("\n⚠️ Could not apply SQL via SUPABASE_DB_URL:", e.message);
    console.log("   Paste supabase/marketplace.sql into Supabase SQL Editor manually.");
  }
} else {
  console.log("\n📋 Marketplace tables: paste supabase/marketplace.sql into Supabase → SQL Editor → Run");
  console.log("   Optional: add SUPABASE_DB_URL to .env.local for automatic apply next time.");
}

console.log("\nVerify: npm run check:marketplace");
