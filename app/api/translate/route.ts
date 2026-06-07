import { NextResponse } from "next/server";
import { translateSchema } from "@/lib/validations/common";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity/log";
import { getSessionIdFromRequest, SESSION_HEADER } from "@/lib/session";

async function translateLibre(text: string, source: string, target: string) {
  const res = await fetch("https://libretranslate.com/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, source, target, format: "text" }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { translatedText?: string };
  return data.translatedText ?? null;
}

async function translateMyMemory(text: string, source: string, target: string) {
  const pair = `${source}|${target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as { responseData?: { translatedText?: string } };
  return data.responseData?.translatedText ?? null;
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = translateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { text, source, target } = parsed.data;
  const sessionId =
    request.headers.get(SESSION_HEADER) || (await getSessionIdFromRequest(request));

  let translated =
    (await translateLibre(text, source, target)) ??
    (await translateMyMemory(text, source, target)) ??
    text;

  let method = "libretranslate";
  if (translated === text) method = "fallback";

  const admin = createAdminClient();
  if (admin) {
    await admin.from("translations").insert({
      session_id: sessionId,
      source_text: text,
      source_language: source,
      target_language: target,
      translated_text: translated,
      translation_method: method,
    });
  }

  await logActivity({
    sessionId,
    actionType: "translation",
    details: { source, target, len: text.length },
  });

  return NextResponse.json({
    translated,
    translatedText: translated,
    detectedLanguage: source,
    method,
  });
}
