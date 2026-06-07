"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import type { MapBusiness } from "@/lib/services/mapService";
import { getMapBusinesses } from "@/lib/services/mapService";
import { NEPAL_DEFAULT_CENTER } from "@/lib/maps/coords";

const STYLE_URL = "https://demotiles.maplibre.org/style.json";

export default function TourismMapLibre() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [businesses, setBusinesses] = useState<MapBusiness[]>([]);
  const [selected, setSelected] = useState<MapBusiness | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getMapBusinesses().then(setBusinesses).catch(() => {});
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [NEPAL_DEFAULT_CENTER.lng, NEPAL_DEFAULT_CENTER.lat],
      zoom: 12,
      pitch: 45,
      bearing: -10,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.GeolocateControl({ trackUserLocation: true }), "top-right");

    map.on("load", () => {
      setReady(true);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const sourceId = "businesses";
    const layerId = "businesses-circles";

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: businesses.map((b) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [b.lng, b.lat] },
        properties: {
          id: b.id,
          slug: b.slug,
          name: b.name,
          trust: b.trustScore,
          rating: b.avgRating,
          minPrice: b.minPrice,
          category: b.categoryLabel,
        },
      })),
    };

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource(sourceId, { type: "geojson", data: geojson });
      map.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": 10,
          "circle-color": "#D4A017",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#060A14",
        },
      });
      map.on("click", layerId, (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const slug = f.properties?.slug as string;
        const biz = businesses.find((b) => b.slug === slug);
        if (biz) setSelected(biz);
      });
      map.on("mouseenter", layerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layerId, () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, [businesses, ready]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[min(100dvh-14rem,720px)] w-full overflow-hidden rounded-2xl border border-white/10"
      />

      {selected && (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-w-md rounded-2xl border border-white/10 bg-[rgba(6,10,20,0.95)] p-4 backdrop-blur-xl md:left-4 md:right-auto">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-3 top-3 text-[var(--text-muted)]"
          >
            ×
          </button>
          <p className="text-[11px] uppercase tracking-widest text-[var(--gold)]">{selected.categoryLabel}</p>
          <h3 className="font-display text-lg font-semibold">{selected.name}</h3>
          <div className="mt-2 flex flex-wrap gap-3 text-[12px]">
            <span className="text-[var(--gold)]">★ {selected.avgRating || "—"}</span>
            <span className="text-[var(--teal)]">Trust {selected.trustScore}%</span>
            {selected.minPrice != null && <span>From NPR {selected.minPrice}</span>}
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              href={`/business/${selected.slug}`}
              className="rounded-xl bg-[var(--teal)] px-4 py-2 text-[12px] font-semibold text-white"
            >
              Full profile
            </Link>
            <a
              href={`https://www.openstreetmap.org/directions?to=${selected.lat},${selected.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 px-4 py-2 text-[12px]"
            >
              Directions
            </a>
          </div>
        </div>
      )}

      <p className="mt-2 text-[11px] text-[var(--text-muted)]">
        MapLibre GL · 3D pitch · Verified business layer · {businesses.length} markers
      </p>
    </div>
  );
}
