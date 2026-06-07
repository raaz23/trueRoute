"use client";

import { useState } from "react";

const categories = ["Transport", "Food & Drink", "Attractions", "Hotels"];

const priceData: Record<string, Array<{ service: string; tourist: string; fair: string; save: string; note: string }>> = {
  "Transport": [
    { service: "Rickshaw · 1–2 km", tourist: "NPR 400–600", fair: "NPR 80–120", save: "75%", note: "Agree price before boarding" },
    { service: "Taxi · Thamel → Airport", tourist: "NPR 1,200–1,800", fair: "NPR 600–800", save: "50%", note: "Use meter or agree upfront" },
    { service: "Local bus · City route", tourist: "NPR 50–100", fair: "NPR 15–25", save: "70%", note: "Ask locals for correct stop" },
    { service: "Taxi · Thamel → Patan", tourist: "NPR 800–1,200", fair: "NPR 350–500", save: "55%", note: "Metered taxis best option" },
    { service: "Auto · Short hop · 2 km", tourist: "NPR 300–500", fair: "NPR 60–100", save: "80%", note: "Most overcharged route type" },
    { service: "Boat · Phewa Lake · Pokhara", tourist: "NPR 1,000–1,500", fair: "NPR 400–600", save: "60%", note: "Negotiate before boarding" },
  ],
  "Food & Drink": [
    { service: "Dal Bhat (full meal)", tourist: "NPR 500–800", fair: "NPR 150–250", save: "67%", note: "Eat where locals eat" },
    { service: "Momo (plate of 10)", tourist: "NPR 300–500", fair: "NPR 80–150", save: "67%", note: "Street momos are best" },
    { service: "Masala tea / chai", tourist: "NPR 100–200", fair: "NPR 20–40", save: "75%", note: "Tea shops, not cafés" },
    { service: "Fresh juice · seasonal", tourist: "NPR 300–400", fair: "NPR 80–120", save: "70%", note: "Avoid tourist strip cafés" },
    { service: "Thakali set lunch", tourist: "NPR 600–1,000", fair: "NPR 200–350", save: "65%", note: "Try Jhochhe or Ason area" },
    { service: "Beer · local brand", tourist: "NPR 400–600", fair: "NPR 200–280", save: "45%", note: "Everest / Gorkha locally" },
  ],
  "Attractions": [
    { service: "Boudhanath · Official entry", tourist: "NPR 400", fair: "NPR 400", save: "0%", note: "Official fixed price — fair" },
    { service: "Pashupatinath · Non-Hindus", tourist: "NPR 1,000", fair: "NPR 1,000", save: "0%", note: "Fixed official government rate" },
    { service: "Patan Durbar Square", tourist: "NPR 1,000", fair: "NPR 1,000", save: "0%", note: "Watch for touts adding fees" },
    { service: "Swayambhunath (Monkey Temple)", tourist: "NPR 200", fair: "NPR 200", save: "0%", note: "Touts may ask NPR 500–800" },
    { service: "Garden of Dreams", tourist: "NPR 400", fair: "NPR 400", save: "0%", note: "Lovely garden, fair price" },
    { service: "Chitwan safari · 1 day", tourist: "NPR 8,000+", fair: "NPR 4,000–5,500", save: "40%", note: "Book through community" },
  ],
  "Hotels": [
    { service: "Budget guesthouse · Thamel", tourist: "NPR 2,000–3,500", fair: "NPR 800–1,500", save: "55%", note: "Book directly, avoid touts" },
    { service: "Mid-range hotel · central", tourist: "NPR 5,000–8,000", fair: "NPR 2,500–4,000", save: "50%", note: "Walk-in vs. booked rates differ" },
    { service: "Lakeside guesthouse · Pokhara", tourist: "NPR 2,500–4,000", fair: "NPR 1,200–2,000", save: "50%", note: "Walk further from lake" },
    { service: "Homestay · rural village", tourist: "NPR 2,000–3,000", fair: "NPR 800–1,200", save: "60%", note: "Best cultural experience" },
  ],
};

export default function FairPrice() {
  const [activeTab, setActiveTab] = useState("Transport");

  return (
    <section id="prices" className="py-24 px-6 border-t border-white/5" style={{ background: "linear-gradient(180deg, rgba(212,160,23,0.04) 0%, transparent 100%)" }}>
      <div className="max-w-[1120px] mx-auto">

        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div className="section-tag mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--gold)] inline-block" />
            Fair Price Engine · The #1 Feature
          </div>
          <h2 className="font-display text-[42px] md:text-[52px] font-bold leading-tight mb-5">
            Know before you pay.<br />
            <span className="grad-gold">Every time.</span>
          </h2>
          <p className="text-[16px] text-[var(--text-muted)] max-w-[520px] mx-auto leading-relaxed">
            Real prices verified by local contributors, updated weekly. Show TrueRoute
            to your driver or vendor — they&apos;ll know you know the fair price.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="reveal flex gap-3 flex-wrap justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`city-tab border rounded-full px-5 py-2 text-[13px] font-medium transition-all duration-200 ${
                activeTab === cat
                  ? "active text-[var(--gold)] bg-[rgba(212,160,23,0.15)] border-[rgba(212,160,23,0.5)]"
                  : "text-[var(--text-muted)] bg-transparent border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Table */}
        <div className="reveal bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          {/* Table head */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-b border-white/6" style={{ background: "rgba(212,160,23,0.06)" }}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)]">Service</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--red)]">Tourist Price</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--teal)]">Fair Price</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">You Save</span>
          </div>

          {/* Rows */}
          {priceData[activeTab].map((row, i) => (
            <div
              key={i}
              className="price-row grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-b border-white/5 last:border-0 group"
            >
              <div>
                <div className="text-[14px] font-medium text-[var(--text)]">{row.service}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  💡 {row.note}
                </div>
              </div>
              <div className="text-[14px] font-semibold text-[var(--red)] self-center line-through opacity-75">
                {row.tourist}
              </div>
              <div className="text-[14px] font-bold text-[var(--teal)] self-center">
                {row.fair}
              </div>
              <div className="text-[14px] font-bold text-[var(--gold)] self-center">
                {row.save !== "0%" ? `-${row.save}` : <span className="text-[var(--teal)]">Fixed ✓</span>}
              </div>
            </div>
          ))}
        </div>

        <p className="reveal text-center text-[12px] text-[var(--text-muted)] mt-5">
          Prices verified by local contributors · Updated weekly · Kathmandu region shown · Hover any row for a local tip
        </p>
      </div>
    </section>
  );
}
