import MarketingShell from "@/components/landing/MarketingShell";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works — TrueRoute",
  description:
    "Step-by-step: open TrueRoute, search places and prices, see verified fair rates, travel with confidence in Nepal.",
};

const phases = [
  {
    title: "Before you land",
    body: "Skim the city pack for your first stop — typical taxi bands from the airport, SIM tips, and ATM quirks. Save offline snapshots in Phase 2 so baggage claim WiFi is optional.",
  },
  {
    title: "Every day on the ground",
    body: "Search a place (“Swayambhu steps”) or a need (“rickshaw 2 km”). You get a fair band, what locals usually pay, and the phrases that signal you are informed — not confrontational.",
  },
  {
    title: "When something feels off",
    body: "Open the emergency panel, switch to translate mode, or ping the AI guide with a photo of a menu or meter. TrueRoute is built for the moment pressure hits.",
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-[720px] px-6">
        <header className="mb-12 text-center md:text-left">
          <div className="section-tag mb-5 inline-flex items-center gap-2">
            <span className="inline-block h-[5px] w-[5px] rounded-full bg-[var(--gold)]" />
            Detailed guide
          </div>
          <h1 className="font-display text-[40px] font-bold leading-tight md:text-[48px]">
            How TrueRoute earns your <span className="grad-gold">trust.</span>
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-muted)]">
            We are not another glossy brochure. We are the layer that sits between you and the
            asymmetry every tourist feels on day one — unknown prices, unknown routes, unknown
            norms.
          </p>
        </header>

        <ol className="space-y-10 border-l border-[var(--gold)]/25 pl-8">
          {[
            {
              n: "1",
              t: "Open the app — no friction",
              d: "Browse cities, sample fair bands, and read place intros without an account. If you only need one fair price before a taxi negotiation, that is enough.",
            },
            {
              n: "2",
              t: "Ask in plain language",
              d: "Type how you would text a friend who lives here. The AI guide and search stack resolve Nepali names, alternate spellings, and “near Thamel” vagueness.",
            },
            {
              n: "3",
              t: "See the verified band",
              d: "Official rates, verified locals, and audited traveler receipts converge into a fair band — not a fantasy number, a realistic range you can show on your phone.",
            },
            {
              n: "4",
              t: "Move with confidence",
              d: "Use translation for the counter line, the emergency sheet when you need calm facts, and the map when alleys fork. The goal is fewer bad days, not zero spontaneity.",
            },
          ].map((step) => (
            <li key={step.n} className="relative">
              <span className="absolute -left-[41px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A017] to-[#A87C10] font-display text-sm font-bold text-white">
                {step.n}
              </span>
              <h2 className="font-display text-xl font-semibold">{step.t}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">{step.d}</p>
            </li>
          ))}
        </ol>

        <section className="mt-16 space-y-6 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold">What happens next</h2>
          {phases.map((p) => (
            <div key={p.title}>
              <h3 className="text-[16px] font-semibold text-[var(--gold)]">{p.title}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-muted)]">{p.body}</p>
            </div>
          ))}
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/#waitlist"
            className="inline-flex rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-8 py-4 text-[15px] font-semibold text-white"
          >
            Join the waitlist — free
          </Link>
          <p className="mt-4 text-[13px] text-[var(--text-muted)]">
            Want the feature tour? <Link className="text-[var(--gold)] hover:underline" href="/features">See all features</Link>
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
