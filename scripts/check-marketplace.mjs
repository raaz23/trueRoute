import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    const vars = {};
    for (const line of raw.split(/\r?\n/)) {
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
    return vars;
  } catch {
    return {};
  }
}

const env = loadEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const svc = env.SUPABASE_SERVICE_ROLE_KEY;

async function probe(table, key) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const text = await res.text();
  let err = null;
  try {
    const j = JSON.parse(text);
    err = j.message || j.hint || j.code;
  } catch {
    err = text.slice(0, 100);
  }
  return { status: res.status, ok: res.ok, error: res.ok ? null : err };
}

console.log("=== Marketplace tables (Supabase) ===\n");
const tables = [
  "businesses",
  "business_media",
  "business_services",
  "business_documents",
  "business_reviews",
];

let allOk = true;
for (const t of tables) {
  const r = await probe(t, anon);
  const icon = r.ok ? "✅" : "❌";
  console.log(`${icon} ${t}: ${r.status}${r.error ? ` — ${r.error}` : ""}`);
  if (!r.ok) allOk = false;
}

if (svc) {
  const sr = await fetch(`${url}/storage/v1/bucket`, {
    headers: { apikey: svc, Authorization: `Bearer ${svc}` },
  });
  const buckets = await sr.json();
  const names = Array.isArray(buckets) ? buckets.map((b) => b.name) : [];
  console.log("\nStorage buckets:", names.length ? names.join(", ") : "(none or error)");
  for (const need of ["business-media", "business-documents"]) {
    console.log(names.includes(need) ? `✅ ${need}` : `❌ ${need} — run supabase/storage-marketplace.sql`);
  }
}

if (!allOk) {
  console.log("\n→ Run supabase/marketplace.sql in Supabase SQL Editor, then storage-marketplace.sql");
  process.exit(1);
}
console.log("\n✅ Marketplace schema present on Supabase");
