import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiModel } from "@/lib/ai/config";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["description", "blog", "seo", "marketing"]),
  businessName: z.string().min(2),
  category: z.string(),
  context: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const prompts: Record<string, string> = {
      description: `Write a transparent, honest business description for a Nepal tourism business.
Name: ${data.businessName}
Category: ${data.category}
Context: ${data.context ?? "none"}
Keep it 2-3 paragraphs. Emphasize fair pricing and transparency. No exaggerated claims.`,
      blog: `Draft a short travel blog post (300 words) for this Nepal business:
Name: ${data.businessName}, Category: ${data.category}
Topic context: ${data.context ?? "local travel tips"}
Include practical tips for tourists.`,
      seo: `Suggest SEO title (max 60 chars) and meta description (max 155 chars) for:
${data.businessName} - ${data.category} in Nepal.
Return as JSON: {"title":"...","description":"..."}`,
      marketing: `Give 5 marketing recommendations for a ${data.category} in Nepal named ${data.businessName}.
Focus on transparency, trust, and tourist appeal.`,
    };

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: getGeminiModel() });
    const result = await model.generateContent(prompts[data.type]);
    const text = result.response.text();

    return NextResponse.json({ content: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
