import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionIdFromRequest } from "@/lib/session";

const schema = z.object({
  source_text: z.string(),
  source_language: z.string(),
  target_language: z.string(),
  translated_text: z.string(),
  translation_method: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const sessionId = await getSessionIdFromRequest(request);
  const admin = createAdminClient();
  if (admin) {
    await admin.from("translations").insert({
      session_id: sessionId,
      ...parsed.data,
      translation_method: parsed.data.translation_method ?? "libretranslate",
    });
  }

  return NextResponse.json({ ok: true });
}
