import { NextResponse } from "next/server";
import { parseImportWithAI } from "@/lib/ai/import-parser";
import { applyImportPayload } from "@/lib/admin/apply-import";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const paste = form.get("text") as string | null;

    let raw = paste?.trim() || "";
    if (file && file.size > 0) {
      raw = await file.text();
    }

    if (!raw || raw.length < 10) {
      return NextResponse.json({ error: "Upload a .txt or .csv file or paste content." }, { status: 400 });
    }

    if (raw.length > 500_000) {
      return NextResponse.json({ error: "File too large (max 500KB)." }, { status: 400 });
    }

    const parsed = await parseImportWithAI(raw);
    const summary = await applyImportPayload(parsed);

    return NextResponse.json({
      ok: true,
      parsed: {
        cities: parsed.cities?.length ?? 0,
        places: parsed.places?.length ?? 0,
        prices: parsed.prices?.length ?? 0,
        emergency: parsed.emergency?.length ?? 0,
        phrases: parsed.phrases?.length ?? 0,
      },
      applied: summary,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Import failed" },
      { status: 500 }
    );
  }
}
