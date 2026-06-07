"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Loader2, LocateFixed, Search } from "lucide-react";
import type { TileLayerOffline } from "leaflet.offline";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";
import { useMapGeolocation } from "@/hooks/useMapGeolocation";
import { getMapBusinesses, getPlaces, type MapBusiness, type MapPlace } from "@/lib/services/mapService";
import {
  getStadiaMapsApiKey,
  getStadiaTileLayer,
  isStadiaMapsConfigured,
  STADIA_DEFAULT_STYLE,
} from "@/lib/maps/stadia";
import { NEPAL_DEFAULT_CENTER, toLeafletPosition, type LatLng } from "@/lib/maps/coords";
import PlaceMarker from "@/components/app/map/PlaceMarker";
import BusinessMarker from "@/components/app/map/BusinessMarker";
import OfflineTileLayer from "@/components/app/map/OfflineTileLayer";
import UserLocationMarker from "@/components/app/map/UserLocationMarker";
import MapOfflineManager from "@/components/app/map/MapOfflineManager";
import "leaflet/dist/leaflet.css";

type MapMode = "explore" | "search" | "directions" | "nearby";

type PlaceResult = {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
};

const NEARBY_CATEGORIES = [
  { id: "restaurant", label: "Food", icon: "🍽️" },
  { id: "hospital", label: "Hospital", icon: "🏥" },
  { id: "pharmacy", label: "Pharmacy", icon: "💊" },
  { id: "atm", label: "ATM", icon: "🏧" },
  { id: "lodging", label: "Hotels", icon: "🏨" },
  { id: "tourist_attraction", label: "Sights", icon: "📸" },
] as const;

const defaultCenter: [number, number] = [
  NEPAL_DEFAULT_CENTER.lat,
  NEPAL_DEFAULT_CENTER.lng,
];

const pinIcon = new L.DivIcon({
  className: "",
  html: `<span style="font-size:28px">📌</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function MapFlyTo({ target, zoom }: { target: LatLng | null; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo(toLeafletPosition(target), zoom, { duration: 0.8 });
  }, [map, target?.lat, target?.lng, zoom]);
  return null;
}

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const t = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(t);
  }, [map]);
  return null;
}

function PlacePicker({
  placeholder,
  focus,
  onSelect,
  value,
  onChange,
}: {
  placeholder: string;
  focus: LatLng | null;
  onSelect: (p: PlaceResult) => void;
  value: string;
  onChange: (v: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const q = new URLSearchParams({ text: value.trim() });
        if (focus) {
          q.set("lat", String(focus.lat));
          q.set("lon", String(focus.lng));
        }
        const res = await fetch(`/api/map/autocomplete?${q}`);
        const data = (await res.json()) as { places?: PlaceResult[] };
        setSuggestions(data.places ?? []);
        setOpen((data.places?.length ?? 0) > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, focus?.lat, focus?.lng]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2.5 text-[14px] text-white placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--teal)]"
        autoComplete="off"
      />
      {loading && (
        <span className="absolute right-3 top-3 text-[11px] text-[var(--text-muted)]">…</span>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-[2000] mt-1 max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-[var(--bg-card)] shadow-xl">
          {suggestions.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="w-full px-3 py-2.5 text-left hover:bg-white/5"
                onClick={() => {
                  onSelect(p);
                  onChange(p.name);
                  setOpen(false);
                }}
              >
                <span className="block text-[13px] font-medium text-white">{p.name}</span>
                {p.address && (
                  <span className="block text-[11px] text-[var(--text-muted)]">{p.address}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MapView() {
  const [mounted, setMounted] = useState(false);
  const [tilesLoading, setTilesLoading] = useState(true);
  const [mode, setMode] = useState<MapMode>("explore");
  const [flyTarget, setFlyTarget] = useState<LatLng | null>(null);
  const [flyZoom, setFlyZoom] = useState(14);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [businesses, setBusinesses] = useState<MapBusiness[]>([]);
  const [showBusinesses, setShowBusinesses] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [selected, setSelected] = useState<PlaceResult | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlaceResult[]>([]);
  const [nearbyCategory, setNearbyCategory] = useState<string>("restaurant");
  const [nearbyKeyword, setNearbyKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromPlace, setFromPlace] = useState<PlaceResult | null>(null);
  const [toPlace, setToPlace] = useState<PlaceResult | null>(null);
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distanceText?: string;
    durationText?: string;
  } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [offlineLayer, setOfflineLayer] = useState<TileLayerOffline | null>(null);
  const [directionsTarget, setDirectionsTarget] = useState<MapPlace | null>(null);

  const { online } = useOfflineBundle();
  const { position: userPos, locating, error: geoError, locate } = useMapGeolocation(true);
  const apiKey = getStadiaMapsApiKey();
  const stadiaReady = isStadiaMapsConfigured();

  const tile = useMemo(
    () => getStadiaTileLayer(STADIA_DEFAULT_STYLE, apiKey),
    [apiKey]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPlacesLoading(true);
      try {
        const data = await getPlaces();
        if (!cancelled) setPlaces(data);
      } catch {
        if (!cancelled) setMapError("Could not load places.");
      } finally {
        if (!cancelled) setPlacesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMapBusinesses();
        if (!cancelled) setBusinesses(data);
      } catch {
        /* optional layer */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const flyToPlace = useCallback((p: { lat: number; lng: number; name: string }, zoom = 16) => {
    setSelected({ id: p.lat.toString(), name: p.name, lat: p.lat, lng: p.lng });
    setFlyTarget({ lat: p.lat, lng: p.lng });
    setFlyZoom(zoom);
  }, []);

  const handleGetDirections = useCallback(
    (place: MapPlace) => {
      setDirectionsTarget(place);
      setMode("directions");
      setToText(place.name);
      setToPlace({
        id: place.id,
        name: place.name,
        lat: place.lat,
        lng: place.lng,
      });
      if (userPos) {
        setFromPlace({
          id: "gps",
          name: "My location",
          lat: userPos.lat,
          lng: userPos.lng,
        });
        setFromText("My location");
      }
      flyToPlace(place, 14);
    },
    [userPos, flyToPlace]
  );

  const runSearch = useCallback(async () => {
    const text = searchQuery.trim();
    if (!text) return;
    setMapError(null);
    try {
      const q = new URLSearchParams({ text });
      if (userPos) {
        q.set("lat", String(userPos.lat));
        q.set("lon", String(userPos.lng));
      }
      const res = await fetch(`/api/map/search?${q}`);
      const data = (await res.json()) as { places?: PlaceResult[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      const first = data.places?.[0];
      if (first) flyToPlace(first);
      else setMapError("No results — try a different spelling.");
    } catch (e) {
      setMapError(e instanceof Error ? e.message : "Search failed");
    }
  }, [searchQuery, userPos, flyToPlace]);

  const runDirections = useCallback(async () => {
    if (!fromPlace || !toPlace) {
      setMapError("Pick both From and To from the suggestions list.");
      return;
    }
    setRouteLoading(true);
    setMapError(null);
    setRouteInfo(null);
    try {
      const res = await fetch("/api/map/directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: { lat: fromPlace.lat, lng: fromPlace.lng },
          to: { lat: toPlace.lat, lng: toPlace.lng },
          costing: "auto",
        }),
      });
      const data = (await res.json()) as {
        positions?: [number, number][];
        distanceText?: string;
        durationText?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not get route");
      setRoutePositions(data.positions ?? []);
      setRouteInfo({
        distanceText: data.distanceText,
        durationText: data.durationText,
      });
      if (data.positions?.length) {
        setFlyTarget({ lat: data.positions[0][0], lng: data.positions[0][1] });
        setFlyZoom(12);
      }
    } catch (e) {
      setMapError(e instanceof Error ? e.message : "Routing failed");
      setRoutePositions([]);
    } finally {
      setRouteLoading(false);
    }
  }, [fromPlace, toPlace]);

  const runNearby = useCallback(async () => {
    const center = userPos ?? NEPAL_DEFAULT_CENTER;
    setNearbyLoading(true);
    setMapError(null);
    try {
      const q = new URLSearchParams({
        lat: String(center.lat),
        lon: String(center.lng),
        category: nearbyCategory,
      });
      if (nearbyKeyword.trim()) q.set("keyword", nearbyKeyword.trim());
      const res = await fetch(`/api/map/nearby?${q}`);
      const data = (await res.json()) as { places?: PlaceResult[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Nearby search failed");
      setNearbyPlaces(data.places ?? []);
      if (data.places?.[0]) flyToPlace(data.places[0], 14);
    } catch (e) {
      setMapError(e instanceof Error ? e.message : "Nearby search failed");
      setNearbyPlaces([]);
    } finally {
      setNearbyLoading(false);
    }
  }, [userPos, nearbyCategory, nearbyKeyword, flyToPlace]);

  if (!mounted) {
    return (
      <div className="tr-map-loading flex h-[min(100dvh-8rem,720px)] w-full items-center justify-center rounded-2xl border border-white/10 bg-[var(--bg-card)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--gold)]" aria-hidden />
        <span className="sr-only">Loading map…</span>
      </div>
    );
  }

  const modes: { id: MapMode; label: string }[] = [
    { id: "explore", label: "Places" },
    { id: "search", label: "Search" },
    { id: "directions", label: "Directions" },
    { id: "nearby", label: "Near me" },
  ];

  return (
    <div className="tr-map-root flex flex-col gap-3">
      {!stadiaReady && (
        <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-muted)] px-4 py-3 text-[13px]">
          <p className="font-semibold text-[var(--gold)]">Stadia Maps</p>
          <p className="mt-1 text-[var(--text-muted)]">
            Add <code className="text-[var(--gold)]">NEXT_PUBLIC_STADIA_MAPS_API_KEY</code> (or{" "}
            <code className="text-[var(--gold)]">NEXT_PUBLIC_STADIA_API_KEY</code>) for production
            tiles.
          </p>
        </div>
      )}

      <MapOfflineManager tileLayer={offlineLayer} online={online} />

      <div className="flex flex-wrap items-center gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              setMapError(null);
              if (m.id !== "directions") setRoutePositions([]);
            }}
            className={`rounded-full px-3 py-2 text-[12px] font-medium sm:px-4 sm:text-[13px] ${
              mode === m.id
                ? "bg-[var(--teal)] text-white"
                : "border border-white/10 bg-[var(--bg-card)] text-[var(--text-muted)]"
            }`}
          >
            {m.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowBusinesses((v) => !v)}
          className={`rounded-full px-3 py-2 text-[12px] font-medium sm:px-4 sm:text-[13px] ${
            showBusinesses
              ? "bg-[var(--gold-muted)] text-[var(--gold)]"
              : "border border-white/10 bg-[var(--bg-card)] text-[var(--text-muted)]"
          }`}
        >
          🏪 Businesses ({businesses.length})
        </button>
        <button
          type="button"
          onClick={locate}
          disabled={locating}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[var(--bg-card)] px-3 py-2 text-[12px] text-[var(--gold)] sm:px-4 sm:text-[13px]"
        >
          <LocateFixed className={`h-4 w-4 ${locating ? "animate-pulse" : ""}`} aria-hidden />
          {locating ? "GPS…" : "My location"}
        </button>
      </div>

      {(geoError || mapError) && (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-[12px] text-red-300">
          {mapError ?? geoError}
        </p>
      )}

      {mode === "search" && (
        <div className="flex gap-2">
          <PlacePicker
            placeholder="Search places, addresses, hotels…"
            focus={userPos}
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={(p) => flyToPlace(p)}
          />
          <button
            type="button"
            onClick={runSearch}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[var(--teal)] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            <Search className="h-4 w-4" aria-hidden />
            Go
          </button>
        </div>
      )}

      {mode === "directions" && (
        <div className="space-y-2">
          {directionsTarget && (
            <p className="text-[12px] text-[var(--text-muted)]">
              Directions to <span className="text-[var(--gold)]">{directionsTarget.name}</span>
            </p>
          )}
          <PlacePicker
            placeholder="From — start"
            focus={userPos}
            value={fromText}
            onChange={setFromText}
            onSelect={(p) => setFromPlace(p)}
          />
          <PlacePicker
            placeholder="To — destination"
            focus={userPos}
            value={toText}
            onChange={setToText}
            onSelect={(p) => setToPlace(p)}
          />
          <button
            type="button"
            disabled={routeLoading}
            onClick={runDirections}
            className="w-full rounded-xl bg-[var(--teal)] py-2.5 text-[14px] font-semibold text-white disabled:opacity-50"
          >
            {routeLoading ? "Calculating route…" : "Get route & distance"}
          </button>
        </div>
      )}

      {mode === "nearby" && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {NEARBY_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setNearbyCategory(c.id);
                  setNearbyKeyword("");
                }}
                className={`rounded-full border px-3 py-1.5 text-[12px] ${
                  nearbyCategory === c.id
                    ? "border-[var(--teal)] bg-[var(--teal)]/20 text-white"
                    : "border-white/10 bg-[var(--bg-card)] text-[var(--text-muted)]"
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={nearbyKeyword}
              onChange={(e) => setNearbyKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runNearby()}
              placeholder='Or type: "coffee", "ATM"…'
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2.5 text-[14px] text-white placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--teal)]"
            />
            <button
              type="button"
              disabled={nearbyLoading}
              onClick={runNearby}
              className="shrink-0 rounded-xl bg-[var(--teal)] px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50"
            >
              {nearbyLoading ? "…" : "Search"}
            </button>
          </div>
        </div>
      )}

      <div className="tr-map-canvas relative overflow-hidden rounded-2xl border border-white/10">
        {(tilesLoading || placesLoading) && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--gold)]" aria-hidden />
              <span className="text-[13px]">
                {tilesLoading ? "Loading map tiles…" : "Loading places…"}
              </span>
            </div>
          </div>
        )}

        <MapContainer
          center={defaultCenter}
          zoom={13}
          className="tr-map-leaflet z-0 h-[min(100dvh-12rem,680px)] w-full touch-none sm:h-[min(78vh,680px)]"
          scrollWheelZoom
          zoomControl
        >
          <OfflineTileLayer
            url={tile.url}
            attribution={tile.attribution}
            onLayerReady={(layer) => {
              setOfflineLayer(layer);
              setTilesLoading(false);
              layer.on("load", () => setTilesLoading(false));
            }}
          />
          <MapResizeFix />
          <MapFlyTo target={flyTarget} zoom={flyZoom} />

          {userPos && <UserLocationMarker position={userPos} />}

          {places.map((p) => (
            <PlaceMarker key={p.id} place={p} onGetDirections={handleGetDirections} />
          ))}

          {showBusinesses &&
            businesses.map((b) => <BusinessMarker key={b.id} business={b} />)}

          {selected && (
            <Marker position={[selected.lat, selected.lng]} icon={pinIcon}>
              <Popup>
                <strong>{selected.name}</strong>
                {selected.address && <p className="text-[12px]">{selected.address}</p>}
              </Popup>
            </Marker>
          )}

          {nearbyPlaces.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              eventHandlers={{ click: () => flyToPlace(p) }}
            />
          ))}

          {routePositions.length > 1 && (
            <Polyline
              positions={routePositions}
              pathOptions={{ color: "#0F9D8D", weight: 5, opacity: 0.85 }}
            />
          )}
        </MapContainer>
      </div>

      {routeInfo && mode === "directions" && (
        <div className="rounded-xl border border-[var(--teal)]/30 bg-[var(--teal)]/10 px-4 py-3">
          <p className="font-semibold text-[var(--teal)]">Route</p>
          <p className="mt-1 text-[14px] text-white">
            {[routeInfo.distanceText, routeInfo.durationText].filter(Boolean).join(" · ") ||
              "Route drawn on map"}
          </p>
        </div>
      )}

      {mode === "explore" && places.length > 0 && (
        <p className="text-[11px] text-[var(--text-muted)]">
          {places.length} TrueRoute places on map · tap a gold marker for fair price & directions
        </p>
      )}

      {selected && (
        <div className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3">
          <p className="font-semibold text-white">{selected.name}</p>
          {selected.address && (
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">{selected.address}</p>
          )}
          <a
            href={`https://www.openstreetmap.org/directions?from=&to=${selected.lat}%2C${selected.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[13px] text-[var(--teal)]"
          >
            Open in OSM directions →
          </a>
        </div>
      )}

      <p className="text-[11px] text-[var(--text-muted)]">
        Maps © Stadia Maps · Offline packs via leaflet.offline · Data from Supabase (RLS)
      </p>
    </div>
  );
}
