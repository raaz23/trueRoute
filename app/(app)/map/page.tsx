"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/app/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(100dvh-10rem,720px)] w-full items-center justify-center rounded-2xl border border-white/10 bg-[var(--bg-card)] text-[var(--text-muted)]">
      Loading map…
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="tr-map-page space-y-3 md:space-y-4">
      <div className="px-0.5">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Live map</h1>
        <p className="mt-1 text-[13px] text-[var(--text-muted)] md:text-[14px]">
          Stadia Alidade Dark · offline tile packs · fair-price markers from Supabase · GPS &
          directions across Nepal.
        </p>
      </div>
      <MapView />
    </div>
  );
}
