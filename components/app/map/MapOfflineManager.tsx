"use client";

import { useCallback, useState } from "react";
import { Download, HardDrive, Loader2 } from "lucide-react";
import L from "leaflet";
import {
  downloadTile,
  getStorageLength,
  saveTile,
  type TileLayerOffline,
} from "leaflet.offline";
import {
  MAP_OFFLINE_REGIONS,
  type MapOfflineRegionId,
} from "@/lib/services/mapService";

type MapOfflineManagerProps = {
  tileLayer: TileLayerOffline | null;
  online: boolean;
};

export default function MapOfflineManager({ tileLayer, online }: MapOfflineManagerProps) {
  const [caching, setCaching] = useState<MapOfflineRegionId | null>(null);
  const [progress, setProgress] = useState(0);
  const [storedCount, setStoredCount] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refreshStorageCount = useCallback(async () => {
    try {
      const n = await getStorageLength();
      setStoredCount(n);
    } catch {
      setStoredCount(null);
    }
  }, []);

  const cacheRegion = useCallback(
    async (regionId: MapOfflineRegionId) => {
      if (!tileLayer) {
        setMessage("Map is still loading — try again in a moment.");
        return;
      }
      if (!online) {
        setMessage("Connect to Wi‑Fi to download map tiles.");
        return;
      }

      const region = MAP_OFFLINE_REGIONS[regionId];
      const bounds = L.latLngBounds(region.bounds[0], region.bounds[1]);
      // leaflet.offline Bounds type differs from L.LatLngBounds at compile time only
      const tiles = region.zoomLevels.flatMap((z) => tileLayer.getTileUrls(bounds as never, z));

      if (tiles.length === 0) {
        setMessage("No tiles to cache for this region.");
        return;
      }

      setCaching(regionId);
      setProgress(0);
      setMessage(`Downloading ${region.label}… 0%`);

      let saved = 0;
      for (const tile of tiles) {
        try {
          const blob = await downloadTile(tile.url);
          await saveTile(tile, blob);
        } catch {
          /* skip failed tiles — trekking areas may have gaps */
        }
        saved += 1;
        const pct = Math.round((saved / tiles.length) * 100);
        setProgress(pct);
        setMessage(`Downloading ${region.label}… ${pct}%`);
      }

      setCaching(null);
      setMessage(`${region.label} cached (${saved} tiles). Map works offline in this area.`);
      await refreshStorageCount();
    },
    [tileLayer, online, refreshStorageCount]
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/95 p-3 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--gold)]">
        <HardDrive className="h-4 w-4" aria-hidden />
        Offline map packs
      </div>
      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
        Pre-cache tiles while on Wi‑Fi before trekking. Uses Stadia Alidade Dark tiles.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(MAP_OFFLINE_REGIONS) as MapOfflineRegionId[]).map((id) => {
          const region = MAP_OFFLINE_REGIONS[id];
          const busy = caching === id;
          return (
            <button
              key={id}
              type="button"
              disabled={!online || busy || !tileLayer}
              onClick={() => cacheRegion(id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[var(--bg)] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:border-[var(--gold)]/40 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Download className="h-3.5 w-3.5 text-[var(--gold)]" aria-hidden />
              )}
              {region.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={refreshStorageCount}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-[var(--text-muted)] hover:text-white"
        >
          <HardDrive className="h-3.5 w-3.5" aria-hidden />
          {storedCount != null ? `${storedCount} tiles` : "Count tiles"}
        </button>
      </div>
      {caching && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-[var(--teal)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {message && (
        <p className="mt-2 text-[11px] text-[var(--text-mid)]" role="status">
          {message}
        </p>
      )}
      {!online && (
        <p className="mt-2 text-[11px] text-[var(--gold)]">
          Offline — using cached tiles where available.
        </p>
      )}
    </div>
  );
}
