import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiModel } from "@/lib/ai/config";

const SYSTEM = `You are TrueRoute AI — a friendly travel guide for tourists visiting Nepal.

YOUR ROLE:
- Help with routes, fair prices, places, safety, and culture
- Explain like talking to a 10-year-old — step by step, very simple
- Always include fair local prices in NPR for transport and services
- Warn about common scams warmly, not scary

RULES:
1. Keep answers SHORT (3-5 sentences) unless they ask for more
2. Use simple words and friendly emojis: 🚕 🏛️ 💰 ✅ ⚠️
3. For routes: Step 1, Step 2 format
4. Always give price numbers: "Fair price is NPR 120-150"
5. When TRUE ROUTE VERIFIED DATA is provided below, use those exact prices — do not invent higher numbers
6. If unsure, say so and suggest what they can do instead`;

export async function chatWithGemini(
  message: string,
  history: { role: string; content: string }[],
  context?: {
    city?: string;
    lat?: number;
    lng?: number;
    travelData?: string;
  }
): Promise<string> {
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_NOT_CONFIGURED");

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: getGeminiModel() });

  const contextLines = [
    context?.city ? `Tourist is asking about: ${context.city}` : "",
    context?.lat != null ? `Location: ${context.lat}, ${context.lng}` : "",
    context?.travelData ?? "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemBlock = SYSTEM + (contextLines ? `\n\n${contextLines}` : "");

  const geminiHistory = history.slice(-10).map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemBlock }] },
      {
        role: "model",
        parts: [{ text: "Got it! I will use TrueRoute fair prices and help tourists travel safely in Nepal. 🧭" }],
      },
      ...geminiHistory.slice(0, -1),
    ],
  });

  const result = await chat.sendMessage(message);
  const text = result.response.text();
  if (!text?.trim()) throw new Error("GEMINI_EMPTY_RESPONSE");
  return text;
}
