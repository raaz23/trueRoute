import { NextResponse } from "next/server";
import { buildTravelPack, fetchWeatherForCity } from "@/lib/data/travel-pack";

export async function GET() {
  const bundle = await buildTravelPack();

  const weather: Record<string, NonNullable<Awaited<ReturnType<typeof fetchWeatherForCity>>>> =
    {};
  for (const city of ["Kathmandu", "Pokhara", "Chitwan"]) {
    const w = await fetchWeatherForCity(city);
    if (w) weather[city] = w;
  }

  return NextResponse.json(
    { ...bundle, weather, version: 2 },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    }
  );
}
