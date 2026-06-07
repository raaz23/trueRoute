/** Haversine distance in meters */
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type DangerZoneHit = {
  id: string;
  zone_name: string;
  reason: string;
  severity: string;
  distance_meters: number;
};

export function checkDangerZonesNearby(
  lat: number,
  lng: number,
  zones: {
    id: string;
    zone_name: string;
    reason: string;
    severity: string;
    latitude: number;
    longitude: number;
    radius_meters: number;
  }[],
  extraBufferM = 500
): DangerZoneHit[] {
  return zones
    .map((z) => {
      const d = distanceMeters(lat, lng, Number(z.latitude), Number(z.longitude));
      const threshold = z.radius_meters + extraBufferM;
      if (d > threshold) return null;
      return {
        id: z.id,
        zone_name: z.zone_name,
        reason: z.reason,
        severity: z.severity,
        distance_meters: Math.round(d),
      };
    })
    .filter((x): x is DangerZoneHit => x !== null)
    .sort((a, b) => a.distance_meters - b.distance_meters);
}
