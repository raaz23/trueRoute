import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { OfflineBundle, OfflineDangerZone, OfflineWeather } from "@/lib/offline/types";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function fromPrisma(): Promise<OfflineBundle> {
  const [prices, places, cities, emergency, phrases, faq, settingsRows] =
    await Promise.all([
      prisma.price.findMany({
        where: { verified: true },
        include: { city: { select: { name: true, slug: true } } },
      }),
      prisma.place.findMany({
        where: { approved: true },
        include: { city: { select: { name: true, slug: true } } },
      }),
      prisma.city.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.emergencyNumber.findMany({ where: { published: true } }),
      prisma.translationPhrase.findMany({ where: { published: true } }),
      prisma.faq.findMany({ where: { published: true } }),
      prisma.siteSetting.findMany(),
    ]);

  const settings = Object.fromEntries(settingsRows.map((s) => [s.key, s.value]));

  const dangerZones: OfflineDangerZone[] = [
    {
      id: "dz-thamel",
      zone_name: "Thamel late-night caution",
      reason: "Stay on main lit streets after midnight",
      latitude: 27.7154,
      longitude: 85.3123,
      radius_meters: 400,
      severity: "caution",
    },
  ];

  return {
    syncedAt: new Date().toISOString(),
    version: 2,
    prices: prices.map((p) => ({
      ...p,
      city: p.city ? { name: p.city.name, slug: p.city.slug } : undefined,
    })),
    places: places.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      history: p.history,
      category: p.category,
      lat: p.lat,
      lng: p.lng,
      entryFeeLocal: p.entryFeeLocal,
      entryFeeTourist: p.entryFeeTourist,
      fairPriceTip: p.fairPriceTip,
      howToGetThere: p.howToGetThere,
      bestTime: p.bestTime,
      city: p.city ? { name: p.city.name, slug: p.city.slug } : undefined,
    })),
    cities: cities.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      country: c.country,
      description: c.description,
      lat: c.lat ?? undefined,
      lng: c.lng ?? undefined,
    })),
    emergency,
    phrases,
    faq,
    settings,
    dangerZones,
    weather: {},
  };
}

async function fromSupabase(): Promise<OfflineBundle | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const [pricesRes, placesRes, citiesRes, dangerRes] = await Promise.all([
    admin.from("prices").select("*, cities(name)").eq("verified", true),
    admin.from("places").select("*, cities(name)").eq("approved", true),
    admin.from("cities").select("*").eq("is_active", true),
    admin.from("danger_zones").select("*").eq("is_active", true),
  ]);

  if (pricesRes.error && placesRes.error) return null;

  const prismaFallback = await fromPrisma();

  const prices = (pricesRes.data ?? []).map((p: Record<string, unknown>) => ({
    id: String(p.id),
    serviceName: String(p.service_name),
    routeFrom: p.route_from as string | null,
    routeTo: p.route_to as string | null,
    touristPriceMin: Number(p.tourist_price_min ?? p.fair_price_min),
    touristPriceMax: p.tourist_price_max as number | null,
    fairPriceMin: Number(p.fair_price_min),
    fairPriceMax: p.fair_price_max as number | null,
    localTip: p.local_tip as string | null,
    category: String(p.category),
    city: p.cities
      ? { name: (p.cities as { name: string }).name, slug: slugify((p.cities as { name: string }).name) }
      : undefined,
  }));

  const places = (placesRes.data ?? []).map((p: Record<string, unknown>) => ({
    id: String(p.id),
    name: String(p.name),
    slug: String(p.slug),
    description: p.description as string | null,
    history: p.history as string | null,
    category: String(p.category ?? "TEMPLE"),
    lat: Number(p.latitude),
    lng: Number(p.longitude),
    entryFeeLocal: p.entry_fee_local as number | null,
    entryFeeTourist: p.entry_fee_tourist as number | null,
    fairPriceTip: null,
    howToGetThere: p.how_to_get_there as string | null,
    bestTime: p.best_time as string | null,
    city: p.cities
      ? { name: (p.cities as { name: string }).name, slug: slugify((p.cities as { name: string }).name) }
      : undefined,
  }));

  const cities = (citiesRes.data ?? []).map((c: Record<string, unknown>) => ({
    id: String(c.id),
    name: String(c.name),
    slug: slugify(String(c.name)),
    country: String(c.country ?? "Nepal"),
    description: c.description as string | null,
    lat: Number(c.latitude),
    lng: Number(c.longitude),
  }));

  const dangerZones: OfflineDangerZone[] = (dangerRes.data ?? []).map(
    (z: Record<string, unknown>) => ({
      id: String(z.id),
      zone_name: String(z.zone_name),
      reason: String(z.reason),
      latitude: Number(z.latitude),
      longitude: Number(z.longitude),
      radius_meters: Number(z.radius_meters),
      severity: String(z.severity ?? "caution"),
    })
  );

  return {
    ...prismaFallback,
    syncedAt: new Date().toISOString(),
    version: 2,
    prices: prices.length ? prices : prismaFallback.prices,
    places: places.length ? places : prismaFallback.places,
    cities: cities.length ? cities : prismaFallback.cities,
    dangerZones: dangerZones.length ? dangerZones : prismaFallback.dangerZones,
    weather: prismaFallback.weather,
  };
}

export async function buildTravelPack(): Promise<OfflineBundle> {
  if (isSupabaseConfigured()) {
    const sb = await fromSupabase();
    if (sb) return sb;
  }
  return fromPrisma();
}

export async function fetchWeatherForCity(
  city: string
): Promise<OfflineWeather | null> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},NP&appid=${key}&units=metric`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;
    const w = await res.json();
    return {
      city: w.name as string,
      temperature: Math.round(w.main.temp),
      feels_like: Math.round(w.main.feels_like),
      condition: w.weather[0].main as string,
      description: w.weather[0].description as string,
      icon: w.weather[0].icon as string,
      humidity: w.main.humidity as number,
      wind_speed: w.wind.speed as number,
      is_severe: (w.weather[0].id as number) < 700,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
