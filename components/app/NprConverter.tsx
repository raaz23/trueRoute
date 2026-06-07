"use client";

import { useState } from "react";

const RATES: { code: string; symbol: string; toNpr: number }[] = [
  { code: "USD", symbol: "$", toNpr: 133 },
  { code: "EUR", symbol: "€", toNpr: 145 },
  { code: "INR", symbol: "₹", toNpr: 1.6 },
  { code: "GBP", symbol: "£", toNpr: 168 },
];

export default function NprConverter() {
  const [amount, setAmount] = useState("10");
  const [currency, setCurrency] = useState("USD");

  const rate = RATES.find((r) => r.code === currency)?.toNpr ?? 133;
  const num = parseFloat(amount) || 0;
  const npr = Math.round(num * rate);

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gold)]">
        Quick NPR converter
      </p>
      <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
        Approximate — use when negotiating (rates vary daily)
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-[11px] text-[var(--text-mid)]">Amount</label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-24 rounded-lg border border-white/10 bg-[var(--bg)] px-3 py-2 text-[14px]"
          />
        </div>
        <div>
          <label className="text-[11px] text-[var(--text-mid)]">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 rounded-lg border border-white/10 bg-[var(--bg)] px-3 py-2 text-[14px]"
          >
            {RATES.map((r) => (
              <option key={r.code} value={r.code}>
                {r.code}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-lg bg-[var(--gold-muted)] px-4 py-2">
          <span className="text-[12px] text-[var(--text-muted)]">≈ </span>
          <span className="font-display text-xl font-bold text-[var(--gold)]">
            NPR {npr.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
