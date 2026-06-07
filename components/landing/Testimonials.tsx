"use client";

import { useEffect, useState } from "react";

type T = {
  id: string;
  authorName: string;
  nationality?: string | null;
  location?: string | null;
  rating: number;
  text: string;
};

export default function Testimonials() {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <section className="border-t border-white/5 py-24 px-6">
      <div className="mx-auto max-w-[1120px]">
        <div className="reveal mb-12 text-center">
          <div className="section-tag mb-5">Traveler stories</div>
          <h2 className="font-display text-[38px] font-bold md:text-[48px]">
            They traveled <span className="grad-gold">honestly</span>
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <article
              key={t.id}
              className="reveal card-hover rounded-2xl border border-white/8 bg-[var(--bg-card)] p-6"
            >
              <div className="mb-3 text-[var(--gold)]">
                {"★".repeat(t.rating)}
                <span className="text-[var(--text-muted)]">{"☆".repeat(5 - t.rating)}</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--text-mid)]">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-4 text-[13px] font-semibold text-[var(--text)]">
                {t.authorName}
                {t.nationality ? ` · ${t.nationality}` : ""}
              </p>
              {t.location && (
                <p className="text-[12px] text-[var(--text-muted)]">{t.location}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
