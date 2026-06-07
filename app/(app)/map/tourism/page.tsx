"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const TourismMapLibre = dynamic(() => import("@/components/app/map/TourismMapLibre"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-2xl border border-white/10 text-[var(--text-muted)]">
      Loading tourism map…
    </div>
  ),
});

export default function TourismMapPage() {
  return (
    <div className="space-y-4">
      <div>
        <Link href="/map" className="text-[13px] text-[var(--gold)] hover:underline">
          ← Standard map
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold">Tourism Map (MapLibre)</h1>
        <p className="text-[14px] text-[var(--text-muted)]">
          3D perspective map with verified business discovery — click markers for trust scores and prices.
        </p>
      </div>
      <TourismMapLibre />
    </div>
  );
}
