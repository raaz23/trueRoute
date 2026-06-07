/** Default map center — Kathmandu. */
export const NEPAL_DEFAULT_CENTER = { lat: 27.7172, lng: 85.324 } as const;

export type LatLng = { lat: number; lng: number };

export function toLeafletPosition(p: LatLng): [number, number] {
  return [p.lat, p.lng];
}
