"use client";
import { useState } from "react";

const cities = [
  {
    name: "Kathmandu",
    emoji: "🏛️",
    tagline: "The Ancient Capital",
    desc: "Nepal's historic heart — seven UNESCO World Heritage Sites in one valley. Durbar Square's medieval palaces, the living goddess Kumari, sacred Pashupatinath temple, and the labyrinthine streets of Thamel.",
    places: 48,
    altitude: "1,400m",
    bestTime: "Oct – Apr",
    highlights: ["Boudhanath Stupa", "Pashupatinath", "Swayambhunath", "Patan Durbar Square", "Bhaktapur", "Garden of Dreams"],
    fairPriceTip: "Rickshaw from Thamel to Boudha: NPR 120 fair (they ask NPR 500)",
  },
  {
    name: "Pokhara",
    emoji: "🏔️",
    tagline: "Gateway to the Himalayas",
    desc: "Nepal's adventure capital — stunning Phewa Lake reflecting the Annapurna range, legendary paragliding launches, the roaring Prithvi Highway, and the serenity of the World Peace Pagoda on the hill.",
    places: 32,
    altitude: "822m",
    bestTime: "Sep – Nov",
    highlights: ["Phewa Lake", "Peace Pagoda", "Sarangkot Sunrise", "Davis Falls", "Gupteshwor Cave", "Begnas Lake"],
    fairPriceTip: "Boat on Phewa Lake: NPR 400–500/hr fair (they ask NPR 1,200+)",
  },
  {
    name: "Chitwan",
    emoji: "🐘",
    tagline: "Nepal's Wildlife Capital",
    desc: "Home of the one-horned rhinoceros and Bengal tiger. Chitwan National Park is a UNESCO site — jeep safaris, canoe rides on the Rapti River, elephant spotting, and Tharu cultural dances at dusk.",
    places: 22,
    altitude: "415m",
    bestTime: "Oct – Mar",
    highlights: ["Chitwan National Park", "Elephant Breeding Centre", "Rapti River", "Gharial Crocodiles", "Tharu Village", "Bird Watching"],
    fairPriceTip: "Jungle safari day trip: NPR 4,000–5,500 fair (tourist price: NPR 8,000+)",
  },
  {
    name: "Lumbini",
    emoji: "☮️",
    tagline: "Birthplace of the Buddha",
    desc: "A UNESCO site of immense spiritual significance — the exact birth spot of Siddhartha Gautama. Sacred Mayadevi temple, the Ashoka Pillar, and over 30 monasteries from 20+ countries in a peaceful sacred garden.",
    places: 18,
    altitude: "95m",
    bestTime: "Nov – Feb",
    highlights: ["Mayadevi Temple", "Ashoka Pillar", "Sacred Pond", "World Peace Flame", "Japanese Monastery", "Myanmar Temple"],
    fairPriceTip: "Guide for sacred garden: NPR 500–800 fair (they ask NPR 2,000–3,000)",
  },
  {
    name: "Nagarkot",
    emoji: "🌅",
    tagline: "The Sunrise Capital",
    desc: "Perched at 2,195m on the edge of the Kathmandu Valley, Nagarkot offers the most accessible Himalayan panorama — including Mount Everest on clear days. A 1-hour drive from the capital.",
    places: 13,
    altitude: "2,195m",
    bestTime: "Oct – Dec",
    highlights: ["Himalaya Panorama", "Everest View", "Sunrise Viewpoint", "Nagarkot Fort", "Changu Narayan", "Valley Cycling"],
    fairPriceTip: "Taxi from Bhaktapur to Nagarkot: NPR 800–1,000 fair (tourist ask: NPR 2,000+)",
  },
  {
    name: "Mustang",
    emoji: "🏰",
    tagline: "The Forbidden Kingdom",
    desc: "One of Nepal's most remote regions — once an independent Buddhist kingdom sealed from the outside world. Ancient cave paintings, the walled city of Lo Manthang, and dramatic Tibetan-plateau landscapes.",
    places: 16,
    altitude: "3,840m",
    bestTime: "Mar – Nov",
    highlights: ["Lo Manthang", "Chhoser Caves", "Lomanthang Lha Phewa", "Kagbeni Village", "Muktinath Temple", "Jhong Cave"],
    fairPriceTip: "Restricted Area Permit required: $500/10 days (fixed govt rate — no negotiation)",
  },
];

export default function Cities() {
  const [active, setActive] = useState(0);
  const city = cities[active];

  return (
    <section id="cities" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-[1120px] mx-auto">

        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div className="section-tag mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--gold)] inline-block" />
            6 Cities · Full Coverage
          </div>
          <h2 className="font-display text-[42px] md:text-[52px] font-bold leading-tight mb-5">
            Every corner of Nepal,<br />
            <span className="grad-gold">fully mapped.</span>
          </h2>
          <p className="text-[16px] text-[var(--text-muted)] max-w-[480px] mx-auto">
            Rich history, fair prices, and local knowledge for every city.
            Launching with Nepal&apos;s 6 most-visited destinations.
          </p>
        </div>

        {/* City Tabs */}
        <div className="reveal flex gap-2 flex-wrap justify-center mb-8">
          {cities.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActive(i)}
              className={`city-tab border rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 flex items-center gap-2 ${
                i === active
                  ? "active text-[var(--gold)] border-[rgba(212,160,23,0.5)] bg-[rgba(212,160,23,0.12)]"
                  : "text-[var(--text-muted)] border-white/10 bg-transparent"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* City Detail Card */}
        <div className="reveal bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-[1fr_300px]">

            {/* Left: Info */}
            <div className="p-8 md:p-10">
              <div className="flex items-start gap-5 mb-6">
                <div className="text-5xl">{city.emoji}</div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)] mb-1">{city.tagline}</div>
                  <h3 className="font-display text-[34px] font-bold">{city.name}</h3>
                </div>
              </div>

              <p className="text-[15px] text-[var(--text-muted)] leading-relaxed mb-8 max-w-[520px]">
                {city.desc}
              </p>

              {/* Highlights */}
              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Top highlights</div>
                <div className="flex gap-2 flex-wrap">
                  {city.highlights.map((h) => (
                    <span
                      key={h}
                      className="bg-white/4 border border-white/8 rounded-lg px-3 py-1.5 text-[12px] text-[var(--text-mid)]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fair price tip */}
              <div className="bg-[var(--gold-muted)] border border-[var(--gold)]/18 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)] mb-1">TrueRoute Fair Price Tip</div>
                  <div className="text-[13px] text-[var(--text-mid)]">{city.fairPriceTip}</div>
                </div>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="border-t md:border-t-0 md:border-l border-white/6 p-8 flex flex-col gap-6 justify-center">
              <div className="text-center">
                <div className="font-display text-[56px] font-bold text-[var(--gold)] leading-none">{city.places}+</div>
                <div className="text-[12px] text-[var(--text-muted)] mt-1">Places mapped</div>
              </div>
              <div className="glow-divider" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="font-display text-[22px] font-semibold text-[var(--text)]">{city.altitude}</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Altitude</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-[18px] font-semibold text-[var(--text)]">{city.bestTime}</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Best time</div>
                </div>
              </div>
              <div className="glow-divider" />
              <div className="text-center">
                <div className="text-[12px] text-[var(--text-muted)] mb-3">More cities coming soon</div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {["Bandipur", "Ilam", "Janakpur", "Dharan"].map((c) => (
                    <span key={c} className="text-[10px] bg-white/4 border border-white/8 rounded-full px-2.5 py-1 text-[var(--text-muted)]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
