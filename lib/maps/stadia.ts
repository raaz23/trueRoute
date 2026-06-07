/** Stadia Maps tiles + config for Leaflet. */

export type StadiaMapStyle =
  | "alidade_smooth_dark"
  | "alidade_smooth"
  | "osm_bright"
  | "stamen_toner_lite"
  | "outdoors";

export const STADIA_STYLES: { id: StadiaMapStyle; label: string }[] = [
  { id: "alidade_smooth_dark", label: "Dark" },
  { id: "alidade_smooth", label: "Light" },
  { id: "osm_bright", label: "OSM Bright" },
  { id: "outdoors", label: "Outdoors" },
  { id: "stamen_toner_lite", label: "Toner" },
];

const ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export function getStadiaMapsApiKey(): string | undefined {
  const key =
    process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_STADIA_API_KEY?.trim() ||
    process.env.STADIA_MAPS_API_KEY?.trim();
  return key || undefined;
}

/** Alidade Smooth Dark — default TrueRoute map theme. */
export const STADIA_DEFAULT_STYLE: StadiaMapStyle = "alidade_smooth_dark";

export function isStadiaMapsConfigured(): boolean {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
  }
  return Boolean(getStadiaMapsApiKey());
}

/** Leaflet tile URL for a Stadia style. On localhost, api_key is optional. */
export function getStadiaTileLayer(style: StadiaMapStyle, apiKey?: string): {
  url: string;
  attribution: string;
} {
  const base = `https://tiles.stadiamaps.com/tiles/${style}/{z}/{x}/{y}{r}.png`;
  const url = apiKey ? `${base}?api_key=${encodeURIComponent(apiKey)}` : base;
  return { url, attribution: ATTRIBUTION };
}
