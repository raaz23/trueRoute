import { NextResponse } from "next/server";
import { fetchWeatherForCity } from "@/lib/data/travel-pack";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity/log";
import { getSessionIdFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Kathmandu";
    const sessionId = await getSessionIdFromRequest(request);

    const weather = await fetchWeatherForCity(city);

    if (!weather) {
      return NextResponse.json(
        { error: "Weather unavailable. Add OPENWEATHER_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    const admin = createAdminClient();
    if (admin && weather.is_severe) {
      const { data: cityRow } = await admin
        .from("cities")
        .select("id")
        .eq("name", city)
        .maybeSingle();

      if (cityRow?.id) {
        await admin.from("weather_alerts").insert({
          city_id: cityRow.id,
          alert_type: weather.condition.toLowerCase(),
          severity: "medium",
          title: `${weather.condition} in ${city}`,
          description: weather.description,
          valid_from: new Date().toISOString(),
          valid_until: new Date(Date.now() + 86400000).toISOString(),
          is_active: true,
        });
      }
    }

    await logActivity({
      sessionId,
      actionType: "weather_check",
      details: { city, temp: weather.temperature },
    });

    return NextResponse.json(weather);
  } catch (error) {
    console.error("Weather error:", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
