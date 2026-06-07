import MarketingShell from "@/components/landing/MarketingShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cities — TrueRoute",
  description:
    "TrueRoute covers Kathmandu, Pokhara, Lalitpur, Chitwan, Lumbini, Nagarkot — honest prices and guides for Nepal.",
};

const cities = [
  {
    name: "Kathmandu",
    emoji: "🏔️",
    tagline: "Valley capital, temples, and the steepest learning curve on prices.",
    detail:
      "Thamel to the heritage cores — we map fair taxis, rickshaws, and entry fees so you spend on experiences, not confusion.",
  },
  {
    name: "Pokhara",
    emoji: "🛶",
    tagline: "Lakeside calm, Annapurna gateway, and boat rides that need a fair anchor.",
    detail:
      "From paragliding quotes to lakeside meals, TrueRoute keeps lakeside energy high and overcharging low.",
  },
  {
    name: "Lalitpur (Patan)",
    emoji: "🏛️",
    tagline: "Living Newar city — courtyards, metalwork, and ticket clarity.",
    detail:
      "Durbar Square zones, local cafés, and side-street gems with the same honest price lens as Kathmandu.",
  },
  {
    name: "Chitwan",
    emoji: "🐘",
    tagline: "Jungle rhythm — safaris and homestays where package pricing hides.",
    detail:
      "We break down day rates, jeep inclusions, and village stays so wildlife memories stay untarnished.",
  },
  {
    name: "Lumbini",
    emoji: "☮️",
    tagline: "Sacred garden sprawl — monasteries, cycles, and respectful visits.",
    detail:
      "Wide grounds and quiet corners: routes, modest dress tips, and fair e-rickshaw loops.",
  },
  {
    name: "Nagarkot",
    emoji: "🌅",
    tagline: "Ridge lines and sunrise bets — weather honest, prices should be too.",
    detail:
      "When clouds win, you still deserve fair transport and guesthouse math for the overnight.",
  },
];

export default function CitiesPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-[1120px] px-6">
        <header className="mb-14 text-center">
          <div className="section-tag mb-5 inline-flex items-center gap-2">
            <span className="inline-block h-[5px] w-[5px] rounded-full bg-[var(--gold)]" />
            Six cities, one honest lens
          </div>
          <h1 className="font-display text-[40px] font-bold leading-tight md:text-[52px]">
            Built for Nepal&apos;s{" "}
            <span className="grad-gold">most-loved stops.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[16px] text-[var(--text-muted)]">
            Every city below gets fair-price tables, place stories, and safety context — with
            the same zero-scam bar.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {cities.map((c) => (
            <article
              key={c.name}
              className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6 md:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{c.emoji}</span>
                <h2 className="font-display text-2xl font-bold">{c.name}</h2>
              </div>
              <p className="text-[15px] font-medium text-[var(--gold)]">{c.tagline}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--text-muted)]">{c.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </MarketingShell>
  );
}
