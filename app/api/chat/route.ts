import { NextResponse } from "next/server";
import { chatWithGemini } from "@/lib/ai/gemini";
import { resolveAiProvider } from "@/lib/ai/config";
import { buildTravelContextForAi } from "@/lib/ai/travel-context";
import { offlineChatReply } from "@/lib/offline/chat-offline";
import { buildTravelPack } from "@/lib/data/travel-pack";
import { logActivity } from "@/lib/activity/log";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClientSafe } from "@/lib/supabase/server";
import { getSessionIdFromRequest, SESSION_HEADER } from "@/lib/session";
import { chatSchema } from "@/lib/validations/common";

async function chatWithGroq(
  messages: { role: string; content: string }[],
  travelData: string
): Promise<string> {
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are TrueRoute AI for Nepal tourists. Simple words, fair NPR prices, anti-scam tips. Use this data when relevant:\n${travelData}`,
        },
        ...messages,
      ],
      max_tokens: 800,
    }),
  });
  const groqData = await groqRes.json();
  if (!groqRes.ok) {
    throw new Error(groqData.error?.message || "Groq request failed");
  }
  const text = groqData.choices?.[0]?.message?.content;
  if (!text?.trim()) throw new Error("GROQ_EMPTY_RESPONSE");
  return text;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const sessionId =
      request.headers.get(SESSION_HEADER) ||
      (await getSessionIdFromRequest(request));
    const { messages } = parsed.data;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return NextResponse.json({ error: "No user message" }, { status: 400 });
    }

    const cityContext = (body.cityContext as string | undefined) || "Kathmandu";
    const userLocation = body.userLocation as { lat: number; lng: number } | undefined;

    let userId: string | null = null;
    const supabase = await createClientSafe();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }

    const pack = await buildTravelPack();
    const travelData = buildTravelContextForAi(pack, { city: cityContext });

    let aiResponse: string;
    let provider: "gemini" | "groq" | "offline" = "offline";

    const configured = resolveAiProvider();

    try {
      if (configured === "gemini") {
        aiResponse = await chatWithGemini(lastUser.content, messages, {
          city: cityContext,
          lat: userLocation?.lat,
          lng: userLocation?.lng,
          travelData,
        });
        provider = "gemini";
      } else if (configured === "groq") {
        aiResponse = await chatWithGroq(messages, travelData);
        provider = "groq";
      } else {
        aiResponse = offlineChatReply(lastUser.content, pack);
        provider = "offline";
      }
    } catch (err) {
      console.warn("AI provider failed, using offline pack:", err);
      aiResponse = offlineChatReply(lastUser.content, pack);
      provider = "offline";
    }

    const fullMessages = [
      ...messages,
      { role: "assistant" as const, content: aiResponse },
    ];

    const admin = createAdminClient();
    if (admin) {
      await admin.from("chat_conversations").upsert(
        {
          session_id: sessionId,
          user_id: userId,
          messages: fullMessages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: new Date().toISOString(),
          })),
          city_context: cityContext ?? null,
          user_location: userLocation
            ? `(${userLocation.lat},${userLocation.lng})`
            : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" }
      );
    }

    await logActivity({
      userId,
      sessionId,
      actionType: "chat_message",
      details: { preview: lastUser.content.slice(0, 80), city: cityContext, provider },
      userLocation,
    });

    return NextResponse.json({
      response: aiResponse,
      message: { role: "assistant", content: aiResponse },
      sessionId,
      provider,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}
