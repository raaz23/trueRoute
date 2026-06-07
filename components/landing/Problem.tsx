"use client";

const problems = [
  {
    icon: "🛺",
    title: "Auto & Rickshaw",
    local: "NPR 80",
    charged: "NPR 500",
    story:
      "A 2 km ride that locals pay NPR 80 for becomes NPR 500 the moment you look like a tourist. That's 6× the real price — every single day.",
  },
  {
    icon: "🍽️",
    title: "Restaurants & Food",
    local: "NPR 150",
    charged: "NPR 600",
    story:
      "Printed tourist menus, dual pricing, or a casual 'oh that's more expensive for foreigners.' Dal Bhat for NPR 600 when locals pay NPR 150.",
  },
  {
    icon: "🎟️",
    title: "Entry Fees & Temples",
    local: "NPR 300",
    charged: "NPR 1,000+",
    story:
      "Unofficial guide fees, fake tickets, 'photography fees' that don't exist. Know the real entry price before you step through any gate.",
  },
  {
    icon: "🏨",
    title: "Hotels & Guesthouses",
    local: "NPR 800",
    charged: "NPR 2,500",
    story:
      "Walk-in tourists often pay 3× what a local contact would book the same room for. TrueRoute shows verified baseline rates for every neighbourhood.",
  },
  {
    icon: "🗺️",
    title: "Fake Guides",
    local: "No guide needed",
    charged: "NPR 3,000/day",
    story:
      "Strangers at bus stations and temple gates claim to be 'official guides' and offer tours at inflated prices. Our AI guide knows everything they do — for free.",
  },
  {
    icon: "💱",
    title: "Money Exchange",
    local: "Market rate",
    charged: "-15% rate",
    story:
      "Unofficial money changers and even some shops give exchange rates 10–15% below market. TrueRoute shows today's real rate so you always know.",
  },
];

export default function Problem() {
  return (
    <section className="py-24 px-6 border-t border-white/5" style={{ background: "rgba(224,82,82,0.025)" }}>
      <div className="max-w-[1120px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag mb-5"
            style={{ background: "rgba(224,82,82,0.1)", borderColor: "rgba(224,82,82,0.25)", color: "var(--red)" }}
          >
            <span className="w-[5px] h-[5px] rounded-full inline-block" style={{ background: "var(--red)" }} />
            The real problem every tourist faces
          </div>
          <h2 className="font-display text-[42px] md:text-[52px] font-bold leading-tight mb-5">
            Every tourist gets overcharged.<br />
            <em className="italic text-[var(--red)]">Every. Single. Day.</em>
          </h2>
          <p className="text-[16px] text-[var(--text-muted)] max-w-[560px] mx-auto leading-relaxed">
            The moment they hear your accent or see your camera, the price goes up.
            It happens across rickshaws, restaurants, temples, hotels, and taxis.
            TrueRoute shows you what locals actually pay — before you open your wallet.
          </p>
        </div>

        {/* Problem Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className={`reveal reveal-delay-${(i % 3) + 1} card-hover bg-[var(--bg-card)] border rounded-2xl p-6`}
              style={{ borderColor: "rgba(224,82,82,0.12)" }}
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-display text-[20px] font-semibold mb-3">{p.title}</h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-5">{p.story}</p>

              {/* Price comparison */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                <div className="flex-1 text-center">
                  <div className="text-[9px] uppercase tracking-widest text-[var(--red)] font-semibold mb-1">Tourist price</div>
                  <div className="font-display text-[18px] font-bold text-[var(--red)]">{p.charged}</div>
                </div>
                <div className="text-[var(--text-muted)] text-lg">→</div>
                <div className="flex-1 text-center">
                  <div className="text-[9px] uppercase tracking-widest text-[var(--teal)] font-semibold mb-1">Fair price</div>
                  <div className="font-display text-[18px] font-bold text-[var(--teal)]">{p.local}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="reveal mt-10 text-center">
          <div className="inline-block bg-[var(--gold-muted)] border border-[var(--gold)]/20 rounded-2xl px-8 py-5">
            <p className="text-[15px] font-semibold text-[var(--gold)]">
              TrueRoute is built to stop all of this. Verified prices. Real knowledge. Zero scams.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
