import type { OfflineBundle } from "./types";

/** Offline AI: search cached fair prices, places, FAQ — no network needed */
export function offlineChatReply(question: string, bundle: OfflineBundle): string {
  const q = question.toLowerCase();
  const lines: string[] = [];

  const matchedPrices = bundle.prices.filter((p) => {
    const hay = `${p.serviceName} ${p.routeFrom ?? ""} ${p.routeTo ?? ""} ${p.category} ${p.city?.name ?? ""}`.toLowerCase();
    return q.split(/\s+/).some((w) => w.length > 2 && hay.includes(w));
  });

  if (matchedPrices.length > 0) {
    lines.push("**Fair prices (offline data):**\n");
    for (const p of matchedPrices.slice(0, 4)) {
      const route = [p.routeFrom, p.routeTo].filter(Boolean).join(" → ");
      lines.push(
        `• **${p.serviceName}**${route ? ` (${route})` : ""}\n  They charge ~NPR **${p.touristPriceMin}** → Fair: **NPR ${p.fairPriceMin}**${p.localTip ? `\n  Tip: ${p.localTip}` : ""}`
      );
    }
  }

  const matchedPlaces = bundle.places.filter((p) => {
    const hay = `${p.name} ${p.history ?? ""} ${p.description ?? ""}`.toLowerCase();
    return q.split(/\s+/).some((w) => w.length > 3 && hay.includes(w));
  });

  if (matchedPlaces.length > 0) {
    lines.push("\n**Places:**\n");
    for (const p of matchedPlaces.slice(0, 3)) {
      lines.push(`• **${p.name}** (${p.city?.name ?? "Nepal"})${p.fairPriceTip ? ` — ${p.fairPriceTip}` : ""}`);
    }
  }

  const matchedFaq = bundle.faq.filter(
    (f) =>
      f.question.toLowerCase().includes(q.slice(0, 20)) ||
      q.split(/\s+/).some((w) => w.length > 4 && f.answer.toLowerCase().includes(w))
  );

  if (matchedFaq.length > 0 && lines.length < 3) {
    lines.push(`\n**FAQ:** ${matchedFaq[0].answer}`);
  }

  if (lines.length === 0) {
    return `**Offline mode** — I searched your downloaded Nepal pack but found no exact match for "${question}".

Try asking about:
• Rickshaw or taxi prices in Kathmandu
• Boudhanath or Thamel entry fees
• Dal bhat fair price

Emergency: Police **100**, Tourist Police **1144**, Ambulance **102**.

Connect to WiFi and open **Profile → Download offline pack** for the latest prices.`;
  }

  lines.push("\n\n_Show this screen when negotiating. Data from your offline TrueRoute pack._");
  return lines.join("\n");
}
