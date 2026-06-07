"use client";

import { useEffect, useState } from "react";

type FaqItem = { id: string; question: string; answer: string };

const fallback: FaqItem[] = [
  {
    id: "1",
    question: "Is TrueRoute really free for tourists?",
    answer: "Yes — forever. Tourists never pay for fair prices, maps, translation, or emergency info.",
  },
];

export default function FAQ() {
  const [items, setItems] = useState<FaqItem[]>(fallback);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setItems(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="faq" className="border-t border-white/5 py-24 px-6">
      <div className="mx-auto max-w-[720px]">
        <div className="reveal mb-12 text-center">
          <div className="section-tag mb-5">Questions</div>
          <h2 className="font-display text-[38px] font-bold md:text-[48px]">
            Frequently asked
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const isOpen = open === item.id;
            return (
              <div
                key={item.id}
                className="reveal overflow-hidden rounded-2xl border border-white/8 bg-[var(--bg-card)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-[15px]">{item.question}</span>
                  <span
                    className={`shrink-0 text-[var(--gold)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-white/6 px-5 pb-4 pt-2 text-[14px] leading-relaxed text-[var(--text-muted)]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

