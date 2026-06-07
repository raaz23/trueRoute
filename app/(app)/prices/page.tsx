"use client";

import { useMemo, useState } from "react";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";
import type { OfflinePrice } from "@/lib/offline/types";
import NprConverter from "@/components/app/NprConverter";

function savings(t: number, f: number) {
  if (t <= 0) return 0;
  return Math.round(((t - f) / t) * 100);
}

export default function PricesPage() {
  const { bundle, online, hasOfflineData, loading } = useOfflineBundle();
  const [q, setQ] = useState("");

  const prices = useMemo(() => {
    const list = bundle?.prices ?? [];
    if (!q.trim()) return list;
    const lower = q.toLowerCase();
    return list.filter((p) => {
      const hay = `${p.serviceName} ${p.routeFrom ?? ""} ${p.routeTo ?? ""} ${p.category} ${p.city?.name ?? ""}`.toLowerCase();
      return hay.includes(lower);
    });
  }, [bundle, q]);

  if (loading && !bundle) {
    return <p className="text-[var(--text-muted)]">Loading prices…</p>;
  }

  if (!hasOfflineData && !online) {
    return (
      <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold-muted)] p-6">
        <p className="font-semibold text-[var(--gold)]">No offline data yet</p>
        <p className="mt-2 text-[14px] text-[var(--text-muted)]">
          Connect to WiFi once and download the offline pack from Profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Fair prices</h1>
        <p className="mt-1 text-[14px] text-[var(--text-muted)]">
          Show this screen before you pay — verified local rates
          {!online && hasOfflineData && (
            <span className="ml-2 text-[var(--teal)]">(offline)</span>
          )}
        </p>
      </div>
      <NprConverter />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search rickshaw, dal bhat, taxi…"
        className="w-full max-w-md rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3 text-[14px] outline-none"
      />
      {prices.length === 0 ? (
        <p className="text-[var(--text-muted)]">No prices match your search.</p>
      ) : (
        <div className="grid gap-4">
          {prices.map((p) => (
            <PriceCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PriceCard({ p }: { p: OfflinePrice }) {
  return (
    <article className="rounded-2xl border border-white/8 bg-[var(--bg-card)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)]">
            {p.category} · {p.city?.name}
          </span>
          <h2 className="mt-1 text-[17px] font-semibold">{p.serviceName}</h2>
          {(p.routeFrom || p.routeTo) && (
            <p className="text-[13px] text-[var(--text-muted)]">
              {p.routeFrom} → {p.routeTo}
            </p>
          )}
        </div>
        <span className="rounded-full bg-[var(--gold-muted)] px-3 py-1 text-[12px] font-bold text-[var(--gold)]">
          Save {savings(p.touristPriceMin, p.fairPriceMin)}%
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[var(--red-muted)] p-3">
          <p className="text-[11px] uppercase text-[var(--red)]">They charge</p>
          <p className="font-display text-2xl font-bold text-[var(--red)]">NPR {p.touristPriceMin}</p>
        </div>
        <div className="rounded-xl bg-[var(--teal-muted)] p-3">
          <p className="text-[11px] uppercase text-[var(--teal)]">Fair price</p>
          <p className="font-display text-2xl font-bold text-[var(--teal)]">NPR {p.fairPriceMin}</p>
        </div>
      </div>
      {p.localTip && (
        <p className="mt-3 text-[13px] text-[var(--text-mid)]">💡 {p.localTip}</p>
      )}
    </article>
  );
}
