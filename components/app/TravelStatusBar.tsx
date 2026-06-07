"use client";

import { useEffect, useState } from "react";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";
import type { OfflineWeather } from "@/lib/offline/types";
import { sessionHeaders } from "@/hooks/useSessionId";

export default function TravelStatusBar() {
  const { bundle, online } = useOfflineBundle();
  const [weather, setWeather] = useState<OfflineWeather | null>(null);
  const city = "Kathmandu";

  useEffect(() => {
    const cached = bundle?.weather?.[city];
    if (cached) setWeather(cached);

    if (!online) return;

    fetch(`/api/weather?city=${city}`, { headers: sessionHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then((w) => w && setWeather(w))
      .catch(() => {});
  }, [bundle, online]);

  if (!weather && !bundle?.dangerZones?.length) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {weather && (
        <div className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-2 text-[13px]">
          <span className="font-semibold text-[var(--gold)]">{weather.city}</span>
          {" · "}
          {weather.temperature}°C {weather.description}
          {weather.is_severe && (
            <span className="ml-2 font-semibold text-[var(--red)]">⚠️ Severe weather</span>
          )}
          {!online && <span className="ml-2 text-[var(--text-muted)]">(cached)</span>}
        </div>
      )}
      {bundle?.dangerZones?.length ? (
        <div className="rounded-xl border border-[var(--red)]/30 bg-[var(--red-muted)] px-4 py-2 text-[12px] text-[var(--red)]">
          {bundle.dangerZones.length} safety zone(s) in offline pack — GPS alerts active
        </div>
      ) : null}
    </div>
  );
}
