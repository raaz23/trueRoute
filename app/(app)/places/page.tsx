"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";

const emoji: Record<string, string> = {
  TEMPLE: "🕌",
  PALACE: "🏛️",
  LAKE: "🏔️",
  MARKET: "🛍️",
  PARK: "🌳",
  MUSEUM: "🏺",
  TRAIL: "🥾",
  VIEWPOINT: "🌅",
};

export default function PlacesPage() {
  const { bundle, online, hasOfflineData, loading } = useOfflineBundle();
  const [q, setQ] = useState("");

  const places = useMemo(() => {
    const list = bundle?.places ?? [];
    if (!q.trim()) return list;
    const lower = q.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.city?.name ?? "").toLowerCase().includes(lower)
    );
  }, [bundle, q]);

  if (loading && !bundle) {
    return <p className="text-[var(--text-muted)]">Loading places…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Places</h1>
        <p className="mt-1 text-[14px] text-[var(--text-muted)]">
          History, tips & fair prices {!online && hasOfflineData && "(offline)"}
        </p>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Boudhanath, Pokhara…"
        className="w-full max-w-md rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3 text-[14px] outline-none"
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {places.map((p) => (
          <li key={p.id}>
            <Link
              href={`/places/${p.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-4 hover:border-[var(--gold)]/35"
            >
              <span className="text-3xl">{emoji[p.category] ?? "📍"}</span>
              <div>
                <p className="font-display text-[17px] font-semibold">{p.name}</p>
                <p className="text-[12px] text-[var(--gold)]">{p.city?.name}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
