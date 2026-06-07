import { NextResponse } from "next/server";
import { resolveAiProvider } from "@/lib/ai/config";

/** Lightweight ping for real connectivity (WiFi can show connected but browser says offline). */
export async function GET() {
  const ai = resolveAiProvider() ?? "offline";
  return NextResponse.json(
    { ok: true, ts: Date.now(), ai },
    { headers: { "Cache-Control": "no-store" } }
  );
}
