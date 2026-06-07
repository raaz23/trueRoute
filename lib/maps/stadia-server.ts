/** Server-side Stadia API helpers (geocoding, routing). */

export function getStadiaServerApiKey(): string | undefined {
  return (
    process.env.STADIA_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY?.trim() ||
    undefined
  );
}

export async function stadiaGet(
  path: string,
  params: Record<string, string | number | undefined>
): Promise<Response> {
  const url = new URL(`https://api.stadiamaps.com${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const key = getStadiaServerApiKey();
  if (key) url.searchParams.set("api_key", key);

  return fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
}

export type GeocodeFeature = {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
};

/** Normalize Stadia / Pelias geocoding JSON to simple places. */
export function parseGeocodeFeatures(data: unknown): GeocodeFeature[] {
  if (!data || typeof data !== "object") return [];
  const obj = data as { features?: unknown[] };
  if (!Array.isArray(obj.features)) return [];

  const out: GeocodeFeature[] = [];
  for (let i = 0; i < obj.features.length; i++) {
    const f = obj.features[i] as {
      properties?: {
        gid?: string;
        id?: string;
        name?: string;
        label?: string;
        street?: string;
        locality?: string;
        region?: string;
        country?: string;
      };
      geometry?: { coordinates?: [number, number] };
    };
    const coords = f.geometry?.coordinates;
    if (!coords || coords.length < 2) continue;
    const [lng, lat] = coords;
    const p = f.properties ?? {};
    const name = p.name || p.label || "Place";
    const parts = [p.street, p.locality, p.region, p.country].filter(Boolean);
    out.push({
      id: p.gid || p.id || `place-${i}`,
      name,
      address: parts.length ? parts.join(", ") : p.label,
      lat,
      lng,
    });
  }
  return out;
}
