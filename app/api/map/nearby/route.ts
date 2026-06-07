import { NextRequest, NextResponse } from "next/server";
import { parseGeocodeFeatures, stadiaGet } from "@/lib/maps/stadia-server";

const CATEGORY_QUERY: Record<string, string> = {
  restaurant: "restaurant",
  hospital: "hospital",
  pharmacy: "pharmacy",
  atm: "atm",
  lodging: "hotel",
  tourist_attraction: "tourist attraction",
  gas_station: "petrol station",
  bus_station: "bus station",
};

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  const category = req.nextUrl.searchParams.get("category") ?? "";
  const keyword = req.nextUrl.searchParams.get("keyword")?.trim() ?? "";
  const query =
    keyword || CATEGORY_QUERY[category] || category || "restaurant";

  const params: Record<string, string> = {
    text: query,
    size: "12",
    lang: "en",
    layers: "venue,address",
    "focus.point.lat": lat,
    "focus.point.lon": lon,
    "boundary.circle.lat": lat,
    "boundary.circle.lon": lon,
    "boundary.circle.radius": "8",
    "boundary.country": "NPL,IND",
  };

  const res = await stadiaGet("/geocoding/v1/search", params);
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: "Nearby search failed", detail: err.slice(0, 200) },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({ places: parseGeocodeFeatures(data) });
}
