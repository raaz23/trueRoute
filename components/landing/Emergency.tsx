"use client";

import { useOfflineBundle } from "@/hooks/useOfflineBundle";

export default function Emergency() {
  const { bundle } = useOfflineBundle();
  const contacts =
    bundle?.emergency.length
      ? bundle.emergency
      : [
          { id: "1", label: "Nepal Police", number: "100" },
          { id: "2", label: "Ambulance", number: "102" },
          { id: "3", label: "Tourist Police", number: "1144" },
          { id: "4", label: "Fire Brigade", number: "101" },
          { id: "5", label: "Mountain Rescue", number: "4411767" },
        ];

  const call = (n: string) => {
    window.location.href = `tel:${n.replace(/[^\d+]/g, "")}`;
  };

  return (
    <section
      id="emergency"
      className="border-t border-white/5 px-6 py-20"
      style={{
        background: "linear-gradient(180deg, rgba(212,160,23,0.03) 0%, transparent 100%)",
      }}
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="reveal mb-12 text-center">
          <div className="section-tag mb-5">Emergency Panel</div>
          <h2 className="mb-4 font-display text-[38px] font-bold leading-tight md:text-[48px]">
            One tap. Right number.
            <br />
            Always safe.
          </h2>
          <p className="mx-auto max-w-[480px] text-[15px] text-[var(--text-muted)]">
            Call instantly — works offline after you download the travel pack.
          </p>
        </div>
        <div className="reveal grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {contacts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => call(c.number)}
              className="card-hover flex flex-col items-center gap-3 rounded-2xl border border-white/6 bg-[var(--bg-card)] p-5 text-center"
            >
              <span className="text-3xl">🚨</span>
              <div>
                <div className="mb-1.5 text-[11px] text-[var(--text-muted)]">{c.label}</div>
                <div className="font-display text-[22px] font-bold text-[var(--red)]">
                  {c.number}
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[var(--teal)]">Tap to call</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
