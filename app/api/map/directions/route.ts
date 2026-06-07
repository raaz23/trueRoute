import { NextRequest, NextResponse } from "next/server";
import { getStadiaServerApiKey } from "@/lib/maps/stadia-server";
import polyline from "@mapbox/polyline";

type RouteLeg = {
  shape?: string;
  summary?: { length?: number; time?: number };
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    from?: { lat: number; lng: number };
    to?: { lat: number; lng: number };
    costing?: string;
  };

  const { from, to, costing = "auto" } = body;
  if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) {
    return NextResponse.json({ error: "from and to required" }, { status: 400 });
  }

  const key = getStadiaServerApiKey();
  const url = key
    ? `https://api.stadiamaps.com/route/v1?api_key=${encodeURIComponent(key)}`
    : "https://api.stadiamaps.com/route/v1";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      locations: [
        { lat: from.lat, lon: from.lng, type: "break" },
        { lat: to.lat, lon: to.lng, type: "break" },
      ],
      costing,
      units: "kilometers",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: "Routing failed", detail: err.slice(0, 300) },
      { status: res.status }
    );
  }

  const data = (await res.json()) as {
    trip?: {
      summary?: { length?: number; time?: number };
      legs?: RouteLeg[];
    };
  };

  const leg = data.trip?.legs?.[0];
  const encoded = leg?.shape;
  if (!encoded) {
    return NextResponse.json({ error: "No route shape returned" }, { status: 502 });
  }

  const decoded = polyline.decode(encoded, 6) as [number, number][];
  const positions: [number, number][] = decoded.map(([lat, lng]) => [lat, lng]);

  const summary = data.trip?.summary ?? leg?.summary;
  const distanceKm = summary?.length;
  const timeSec = summary?.time;

  return NextResponse.json({
    positions,
    distanceKm,
    durationMin: timeSec != null ? Math.round(timeSec / 60) : undefined,
    distanceText:
      distanceKm != null ? `${distanceKm.toFixed(1)} km` : undefined,
    durationText:
      timeSec != null
        ? timeSec < 3600
          ? `${Math.round(timeSec / 60)} min`
          : `${Math.floor(timeSec / 3600)} h ${Math.round((timeSec % 3600) / 60)} min`
        : undefined,
  });
}
