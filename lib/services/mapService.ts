import { createClientSafe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Place row for map markers (view model). */
export type MapPlace = {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  fairPriceNpr: number | null;
  category: string;
};

type SupabasePlaceRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  latitude: number | string;
  longitude: number | string;
  entry_fee_tourist: number | null;
  entry_fee_local: number | null;
};

type ApiPlaceRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  lat: number | null;
  lng: number | null;
  entryFeeTourist: number | null;
  entryFeeLocal: number | null;
  fairPriceTip?: string | null;
};

function toMapPlace(row: {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  lat: number;
  lng: number;
  fairPriceNpr: number | null;
}): MapPlace {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    lat: row.lat,
    lng: row.lng,
    fairPriceNpr: row.fairPriceNpr,
    category: row.category ?? "PLACE",
  };
}

function fairPriceFromRow(
  tourist: number | null | undefined,
  local: number | null | undefined
): number | null {
  if (tourist != null && tourist > 0) return tourist;
  if (local != null && local > 0) return local;
  return null;
}

/** Offline cache regions for Nepal trekking hubs. */
export const MAP_OFFLINE_REGIONS = {
  kathmandu: {
    id: "kathmandu",
    label: "Kathmandu",
    center: { lat: 27.7172, lng: 85.324 },
    bounds: [
      [27.62, 85.22],
      [27.82, 85.42],
    ] as [[number, number], [number, number]],
    zoomLevels: [11, 12, 13, 14, 15, 16] as number[],
  },
  pokhara: {
    id: "pokhara",
    label: "Pokhara",
    center: { lat: 28.2096, lng: 83.9856 },
    bounds: [
      [28.12, 83.9],
      [28.3, 84.08],
    ] as [[number, number], [number, number]],
    zoomLevels: [11, 12, 13, 14, 15, 16] as number[],
  },
} as const;

export type MapOfflineRegionId = keyof typeof MAP_OFFLINE_REGIONS;

async function getPlacesFromSupabase(): Promise<MapPlace[]> {
  const supabase = createClientSafe();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("places")
    .select(
      "id, name, slug, category, latitude, longitude, entry_fee_tourist, entry_fee_local"
    )
    .eq("approved", true)
    .order("name");

  if (error) {
    console.warn("[mapService] Supabase places:", error.message);
    return [];
  }

  return (data as SupabasePlaceRow[])
    .map((p) => {
      const lat = Number(p.latitude);
      const lng = Number(p.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return toMapPlace({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        lat,
        lng,
        fairPriceNpr: fairPriceFromRow(p.entry_fee_tourist, p.entry_fee_local),
      });
    })
    .filter((p): p is MapPlace => p != null);
}

async function getPlacesFromApi(): Promise<MapPlace[]> {
  const res = await fetch("/api/places", { cache: "no-store" });
  if (!res.ok) return [];
  const rows = (await res.json()) as ApiPlaceRow[];
  return rows
    .map((p) => {
      if (p.lat == null || p.lng == null) return null;
      return toMapPlace({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        lat: p.lat,
        lng: p.lng,
        fairPriceNpr: fairPriceFromRow(p.entryFeeTourist, p.entryFeeLocal),
      });
    })
    .filter((p): p is MapPlace => p != null);
}

/**
 * Fetch approved places for the map. Uses Supabase (RLS) when configured,
 * otherwise falls back to the Prisma-backed `/api/places` route.
 */
export async function getPlaces(): Promise<MapPlace[]> {
  if (isSupabaseConfigured()) {
    const fromDb = await getPlacesFromSupabase();
    if (fromDb.length > 0) return fromDb;
  }
  const fromApi = await getPlacesFromApi();
  return fromApi;
}

/** Verified business marker for tourism map layer. */
export type MapBusiness = {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  category: string;
  categoryLabel: string;
  trustScore: number;
  avgRating: number;
  minPrice: number | null;
  verified: boolean;
};

export async function getMapBusinesses(): Promise<MapBusiness[]> {
  const res = await fetch("/api/businesses?limit=100&verified=true", { cache: "no-store" });
  if (!res.ok) return [];
  const rows = (await res.json()) as {
    id: string;
    name: string;
    slug: string;
    lat?: number | null;
    lng?: number | null;
    category: string;
    categoryLabel: string;
    trustScore: number;
    avgRating: number;
    minPrice?: number | null;
    verified?: boolean;
  }[];
  return rows
    .filter((b) => b.lat != null && b.lng != null)
    .map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      lat: b.lat!,
      lng: b.lng!,
      category: b.category,
      categoryLabel: b.categoryLabel,
      trustScore: b.trustScore,
      avgRating: b.avgRating,
      minPrice: b.minPrice ?? null,
      verified: !!b.verified,
    }));
}
