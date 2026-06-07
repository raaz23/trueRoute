import { NextResponse } from "next/server";
import { isSupabaseConfigured, isSupabaseServiceConfigured } from "@/lib/supabase/config";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const configured = isSupabaseConfigured();
  const serviceConfigured = isSupabaseServiceConfigured();

  if (!configured) {
    return NextResponse.json({
      ok: false,
      mode: "local",
      message: "Supabase env vars not set — using Prisma/SQLite",
      checks: { env: false, dns: null, auth: null, tables: null },
    });
  }

  const checks: Record<string, unknown> = {
    env: true,
    url,
    serviceKey: serviceConfigured,
    dns: false,
    rest: false,
    storage: false,
    error: null as string | null,
  };

  try {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(`${url}/rest/v1/cities?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(10000),
    });
    checks.dns = true;
    checks.rest = res.ok;
    if (!res.ok) {
      const body = await res.text();
      checks.error = `REST ${res.status}: ${body.slice(0, 200)}`;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    checks.error = message;
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      checks.error =
        `DNS failed for ${url} — project may be deleted, paused, or URL is wrong. Create a new Supabase project and update .env.local`;
    }
  }

  const marketplaceTables: Record<string, boolean> = {};

  if (checks.dns && checks.rest) {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    for (const table of ["businesses", "business_media", "business_documents"]) {
      try {
        const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          signal: AbortSignal.timeout(8000),
        });
        marketplaceTables[table] = res.ok;
      } catch {
        marketplaceTables[table] = false;
      }
    }
    checks.marketplaceTables = marketplaceTables;
    checks.marketplaceReady = Object.values(marketplaceTables).every(Boolean);
  }

  if (serviceConfigured && checks.dns) {
    try {
      const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      const storageRes = await fetch(`${url}/storage/v1/bucket`, {
        headers: { apikey: svc, Authorization: `Bearer ${svc}` },
        signal: AbortSignal.timeout(10000),
      });
      if (storageRes.ok) {
        const buckets = (await storageRes.json()) as { name: string }[];
        const names = buckets.map((b) => b.name);
        checks.storage = true;
        checks.storageBuckets = {
          "business-media": names.includes("business-media"),
          "business-documents": names.includes("business-documents"),
        };
      } else {
        checks.storage = false;
      }
    } catch {
      checks.storage = false;
    }
  }

  const ok = Boolean(checks.dns && checks.rest);
  const marketplaceReady = Boolean((checks as { marketplaceReady?: boolean }).marketplaceReady);

  let message = ok ? "Supabase is reachable" : (checks.error as string) ?? "Supabase configured but not reachable";
  if (ok && !marketplaceReady) {
    message = "Supabase OK — run supabase/marketplace.sql in SQL Editor (tables missing)";
  }
  if (ok && marketplaceReady && checks.storage) {
    message = "Supabase fully ready for marketplace (tables + storage)";
  }

  return NextResponse.json({
    ok,
    mode: ok ? (marketplaceReady ? "supabase" : "supabase-partial") : "degraded",
    message,
    checks,
  });
}
