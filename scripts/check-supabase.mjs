import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.SUPABASE_URL || "https://ccxolvuvtxwkkolksfdx.supabase.co";

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    const vars = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      vars[key] = val;
    }
    return vars;
  } catch (e) {
    console.error("Could not read .env.local:", e.message);
    return {};
  }
}

const env = loadEnvLocal();
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const configuredUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;

async function probe(key, label, baseUrl) {
  const tables = ["cities", "places", "prices", "users", "chat_conversations"];
  const results = {};
  for (const t of tables) {
    const res = await fetch(`${baseUrl}/rest/v1/${t}?select=*&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text.slice(0, 150) };
    }
    results[t] = {
      status: res.status,
      ok: res.ok,
      error: res.ok ? null : data.message || data.hint || text.slice(0, 120),
    };
  }
  return { label, baseUrl, results };
}

async function countApproved(baseUrl, key) {
  const res = await fetch(`${baseUrl}/rest/v1/places?select=id&approved=eq.true`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "count=exact",
    },
  });
  return {
    status: res.status,
    contentRange: res.headers.get("content-range"),
  };
}

console.log("=== Supabase database check ===\n");
console.log("Target URL:", url);
console.log(".env.local URL:", configuredUrl || "(missing)");
console.log("URL match:", configuredUrl === url ? "YES" : "NO — fix .env.local");
console.log("Anon key:", anon ? "present" : "MISSING");
console.log("Service key:", service ? "present" : "MISSING");
console.log("");

if (!anon) {
  console.error("Cannot test without NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

let anonResult;
try {
  anonResult = await probe(anon, "anon (RLS)", url);
  console.log(JSON.stringify(anonResult, null, 2));
} catch (err) {
  const msg = err?.cause?.code === "ENOTFOUND" || String(err).includes("ENOTFOUND")
    ? `DNS ENOTFOUND — host ${url} does not resolve. The Supabase project may be deleted, paused, or the URL in .env.local is wrong. Create a new project at https://supabase.com/dashboard and update NEXT_PUBLIC_SUPABASE_URL.`
    : String(err);
  console.error("\n❌ Supabase unreachable:", msg);
  console.log("\nTrueRoute will use Prisma/SQLite locally until Supabase is fixed.");
  process.exit(1);
}

if (service) {
  const svcResult = await probe(service, "service_role", url);
  console.log(JSON.stringify(svcResult, null, 2));
  const counts = await countApproved(url, service);
  console.log("Approved places:", JSON.stringify(counts));
}
