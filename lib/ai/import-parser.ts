import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiModel } from "@/lib/ai/config";
import type { ImportPayload } from "@/lib/admin/apply-import";

const PROMPT = `You are a data import assistant for TrueRoute Nepal travel app.
Parse the user's CSV or text dump into JSON ONLY (no markdown).

Schema:
{
  "cities": [{ "name", "slug?", "description?", "lat?", "lng?" }],
  "places": [{ "name", "slug?", "cityName?", "citySlug?", "description?", "category?", "lat?", "lng?" }],
  "prices": [{ "serviceName", "cityName?", "category?", "touristPrice" (number), "fairPrice" (number), "routeFrom?", "routeTo?", "tip?" }],
  "emergency": [{ "label", "number", "description?" }],
  "phrases": [{ "english", "nepali", "pronunciation?", "category?" }]
}

Rules:
- Extract ALL rows from the input
- Prices in NPR unless stated otherwise
- category for prices: TRANSPORT, FOOD, ACCOMMODATION, ATTRACTION, SHOPPING
- category for places: TEMPLE, PALACE, LAKE, MARKET, PARK, MUSEUM, TRAIL, VIEWPOINT
- Default cityName to Kathmandu if missing
- Return empty arrays for missing types
- Output valid JSON only`;

export async function parseImportWithAI(rawText: string): Promise<ImportPayload> {
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) {
    return parseImportHeuristic(rawText);
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: getGeminiModel() });
  const result = await model.generateContent([
    { text: PROMPT },
    { text: `INPUT:\n${rawText.slice(0, 120000)}` },
  ]);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI did not return JSON");
  return JSON.parse(jsonMatch[0]) as ImportPayload;
}

/** Fallback when Gemini unavailable — simple CSV rows */
export function parseImportHeuristic(rawText: string): ImportPayload {
  const lines = rawText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    throw new Error("Need header row + at least one data row, or enable Gemini API key.");
  }

  const header = lines[0]!.toLowerCase().split(/[,;\t]/).map((h) => h.trim());
  const prices: ImportPayload["prices"] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i]!.split(/[,;\t]/).map((c) => c.trim());
    const row: Record<string, string> = {};
    header.forEach((h, j) => {
      row[h] = cols[j] ?? "";
    });

    const service =
      row.service || row.servicename || row.name || row.item || cols[0];
    if (!service) continue;

    prices.push({
      serviceName: service,
      cityName: row.city || row.location || "Kathmandu",
      category: (row.category || "TRANSPORT").toUpperCase(),
      touristPrice: parseFloat(row.tourist || row.touristprice || row.high || "0") || 0,
      fairPrice: parseFloat(row.fair || row.fairprice || row.low || "0") || 0,
      routeFrom: row.from || row.routefrom,
      routeTo: row.to || row.routeto,
      tip: row.tip || row.note,
    });
  }

  return { prices };
}
