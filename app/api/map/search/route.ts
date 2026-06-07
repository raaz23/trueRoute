import { NextRequest, NextResponse } from "next/server";
import { parseGeocodeFeatures, stadiaGet } from "@/lib/maps/stadia-server";

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text")?.trim();
  if (!text) {
    return NextResponse.json({ places: [] });
  }

  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  const params: Record<string, string> = {
    text,
    size: "10",
    lang: "en",
    "boundary.country": "NPL,IND",
  };
  if (lat && lon) {
    params["focus.point.lat"] = lat;
    params["focus.point.lon"] = lon;
    params["boundary.circle.lat"] = lat;
    params["boundary.circle.lon"] = lon;
    params["boundary.circle.radius"] = "50";
  }

  const res = await stadiaGet("/geocoding/v1/search", params);
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: "Search failed", detail: err.slice(0, 200) },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({ places: parseGeocodeFeatures(data) });
}
