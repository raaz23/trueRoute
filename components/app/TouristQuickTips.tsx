"use client";

import { useState } from "react";

const TIPS = [
  {
    icon: "🚕",
    title: "Taxi rule",
    body: "Agree NPR price before you sit. Show the Fair Price screen if they quote high.",
  },
  {
    icon: "💵",
    title: "Cash is king",
    body: "Most shops prefer NPR cash. ATMs in Thamel/Lakeside — withdraw in daylight.",
  },
  {
    icon: "📶",
    title: "Offline first",
    body: "Download the offline pack on WiFi once — prices & emergency work without data.",
  },
  {
    icon: "🆘",
    title: "Emergency",
    body: "Save Police 100, Tourist Police 1144. Share live location from Emergency tab.",
  },
  {
    icon: "🧭",
    title: "Scam signal",
    body: "“Closed today” + redirect, gem shop tours, or “government office” — walk away.",
  },
];

export default function TouristQuickTips() {
  const [i, setI] = useState(0);
  const tip = TIPS[i]!;

  return (
    <div className="mb-4 rounded-xl border border-[var(--teal)]/25 bg-[var(--teal-muted)]/40 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--teal)]">
            Travel tip
          </p>
          <p className="mt-1 text-[14px] font-semibold">
            {tip.icon} {tip.title}
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">{tip.body}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            aria-label="Previous tip"
            onClick={() => setI((v) => (v - 1 + TIPS.length) % TIPS.length)}
            className="rounded-lg border border-white/10 px-2 py-1 text-[12px] hover:bg-white/5"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next tip"
            onClick={() => setI((v) => (v + 1) % TIPS.length)}
            className="rounded-lg border border-white/10 px-2 py-1 text-[12px] hover:bg-white/5"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
