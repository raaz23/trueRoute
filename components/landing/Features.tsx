"use client";

import Link from "next/link";

const features = [
  { href: "/prices", icon: "💰", color: "var(--gold)", colorMuted: "rgba(212,160,23,0.1)", title: "Fair Price Engine", badge: "Live tool", desc: "Verified NPR rates for taxi, food, hotels. Open and show your driver." },
  { href: "/chat", icon: "🤖", color: "var(--teal)", colorMuted: "rgba(15,157,141,0.1)", title: "AI Travel Guide", badge: "Live tool", desc: "Ask routes, scams, food, safety — real AI answers with fair prices." },
  { href: "/map", icon: "🗺️", color: "#6B8FD4", colorMuted: "rgba(107,143,212,0.1)", title: "Smart Route Maps", badge: "Live tool", desc: "GPS map with places across Nepal — works with offline pack." },
  { href: "/translate", icon: "🌐", color: "#A855F7", colorMuted: "rgba(168,85,247,0.1)", title: "Live Language Bridge", badge: "Live tool", desc: "Phrase book + translation for Nepali, Hindi, and more." },
  { href: "/places", icon: "📖", color: "var(--gold)", colorMuted: "rgba(212,160,23,0.1)", title: "Places & History", badge: "Live tool", desc: "Temples, lakes, trails with stories and entry info." },
  { href: "/emergency", icon: "🆘", color: "var(--red)", colorMuted: "rgba(224,82,82,0.1)", title: "Emergency Panel", badge: "Live tool", desc: "Police, ambulance, tourist police — tap to call." },
  { href: "/map", icon: "📍", color: "var(--teal)", colorMuted: "rgba(15,157,141,0.1)", title: "Live GPS", badge: "Live tool", desc: "Location tracking and danger zone alerts." },
  { href: "/submit-price", icon: "⭐", color: "#F59E0B", colorMuted: "rgba(245,158,11,0.1)", title: "Submit a Price", badge: "Community", desc: "Report what you paid — help other tourists." },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="section-tag mb-5">Working services — tap to open</div>
          <h2 className="font-display text-[42px] md:text-[52px] font-bold leading-tight mb-5">
            Real tools.<br />
            <span className="grad-gold">Not just marketing.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Link
              key={f.title}
              href={f.href}
              className={`reveal reveal-delay-${(i % 4) + 1} card-hover bg-[var(--bg-card)] border border-white/6 rounded-2xl p-6 flex flex-col hover:border-[var(--gold)]/30 transition`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: f.colorMuted }}>
                {f.icon}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: f.color }}>{f.badge}</div>
              <h3 className="font-display text-[18px] font-semibold mb-3">{f.title}</h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed flex-1">{f.desc}</p>
              <span className="mt-4 text-[13px] font-semibold text-[var(--gold)]">Open app →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
