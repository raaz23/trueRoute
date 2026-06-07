import type { OfflineBundle } from "@/lib/offline/types";

/** Compact TrueRoute data for AI system context (RAG-style, no vector DB). */
export function buildTravelContextForAi(
  pack: OfflineBundle,
  options?: { city?: string; maxPrices?: number; maxPlaces?: number }
): string {
  const cityFilter = options?.city?.toLowerCase();
  const maxPrices = options?.maxPrices ?? 40;
  const maxPlaces = options?.maxPlaces ?? 25;

  let prices = pack.prices;
  let places = pack.places;

  if (cityFilter) {
    prices = prices.filter((p) => p.city?.name?.toLowerCase().includes(cityFilter));
    places = places.filter((p) => p.city?.name?.toLowerCase().includes(cityFilter));
  }

  const priceLines = prices.slice(0, maxPrices).map((p) => {
    const route = [p.routeFrom, p.routeTo].filter(Boolean).join(" → ");
    const routePart = route ? ` (${route})` : "";
    return `- ${p.serviceName}${routePart}: tourist ~NPR ${p.touristPriceMin}, fair NPR ${p.fairPriceMin}${p.localTip ? ` | tip: ${p.localTip}` : ""}`;
  });

  const placeLines = places.slice(0, maxPlaces).map((p) => {
    const fee =
      p.entryFeeTourist != null
        ? ` entry tourist NPR ${p.entryFeeTourist}`
        : p.fairPriceTip
          ? ` ${p.fairPriceTip}`
          : "";
    return `- ${p.name} (${p.city?.name ?? "Nepal"}, ${p.category})${fee}`;
  });

  const emergency = pack.emergency
    .slice(0, 8)
    .map((e) => `${e.label}: ${e.number}`)
    .join(", ");

  const faqSnippets = pack.faq
    .slice(0, 5)
    .map((f) => `Q: ${f.question} A: ${f.answer.slice(0, 120)}`)
    .join("\n");

  return [
    "=== TRUE ROUTE VERIFIED DATA (prefer these numbers over guessing) ===",
    priceLines.length ? `FAIR PRICES (NPR):\n${priceLines.join("\n")}` : "",
    placeLines.length ? `PLACES:\n${placeLines.join("\n")}` : "",
    emergency ? `EMERGENCY: ${emergency}` : "",
    faqSnippets ? `FAQ:\n${faqSnippets}` : "",
    "=== END DATA ===",
  ]
    .filter(Boolean)
    .join("\n\n");
}
