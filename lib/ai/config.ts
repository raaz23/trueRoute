/** Gemini model — override with GEMINI_MODEL in .env */
export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
}

export type AiProvider = "gemini" | "groq" | "offline";

export function resolveAiProvider(): AiProvider | null {
  if (process.env.GOOGLE_GEMINI_API_KEY?.trim()) return "gemini";
  if (process.env.GROQ_API_KEY?.trim()) return "groq";
  return null;
}
