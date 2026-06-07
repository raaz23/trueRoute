import { prisma } from "@/lib/prisma";
import { PlaceCategory, PriceCategory } from "@prisma/client";

export type ImportPayload = {
  cities?: Array<{
    name: string;
    slug?: string;
    description?: string;
    lat?: number;
    lng?: number;
  }>;
  places?: Array<{
    name: string;
    slug?: string;
    citySlug?: string;
    cityName?: string;
    description?: string;
    category?: string;
    lat?: number;
    lng?: number;
  }>;
  prices?: Array<{
    serviceName: string;
    citySlug?: string;
    cityName?: string;
    category?: string;
    touristPrice?: number;
    fairPrice?: number;
    currency?: string;
    routeFrom?: string;
    routeTo?: string;
    tip?: string;
  }>;
  emergency?: Array<{
    label: string;
    number: string;
    description?: string;
  }>;
  phrases?: Array<{
    english: string;
    nepali: string;
    pronunciation?: string;
    category?: string;
  }>;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapPlaceCategory(raw?: string): PlaceCategory {
  const u = (raw || "").toUpperCase();
  const keys = Object.keys(PlaceCategory) as PlaceCategory[];
  return keys.find((k) => k === u || k.startsWith(u.slice(0, 4))) ?? PlaceCategory.TEMPLE;
}

function mapPriceCategory(raw?: string): PriceCategory {
  const u = (raw || "TRANSPORT").toUpperCase();
  const keys = Object.keys(PriceCategory) as PriceCategory[];
  return keys.find((k) => k === u) ?? PriceCategory.TRANSPORT;
}

export async function applyImportPayload(data: ImportPayload) {
  const summary = {
    cities: 0,
    places: 0,
    prices: 0,
    emergency: 0,
    phrases: 0,
    errors: [] as string[],
  };

  const cityBySlug = new Map<string, string>();

  for (const c of data.cities ?? []) {
    try {
      const slug = c.slug || slugify(c.name);
      const row = await prisma.city.upsert({
        where: { slug },
        create: {
          name: c.name,
          slug,
          description: c.description,
          lat: c.lat,
          lng: c.lng,
          isActive: true,
        },
        update: {
          name: c.name,
          description: c.description,
          lat: c.lat,
          lng: c.lng,
        },
      });
      cityBySlug.set(slug, row.id);
      summary.cities++;
    } catch (e) {
      summary.errors.push(`City ${c.name}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }

  const allCities = await prisma.city.findMany();
  for (const c of allCities) cityBySlug.set(c.slug, c.id);

  async function resolveCityId(slug?: string, name?: string) {
    if (slug && cityBySlug.has(slug)) return cityBySlug.get(slug)!;
    if (name) {
      const s = slugify(name);
      if (cityBySlug.has(s)) return cityBySlug.get(s)!;
      const found = allCities.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (found) return found.id;
    }
    return allCities[0]?.id;
  }

  for (const p of data.places ?? []) {
    try {
      const cityId = await resolveCityId(p.citySlug, p.cityName);
      if (!cityId) {
        summary.errors.push(`Place ${p.name}: no city`);
        continue;
      }
      const slug = p.slug || slugify(p.name);
      await prisma.place.upsert({
        where: { slug },
        create: {
          name: p.name,
          slug,
          cityId,
          description: p.description || "",
          category: mapPlaceCategory(p.category),
          lat: p.lat,
          lng: p.lng,
          approved: true,
        },
        update: {
          description: p.description,
          lat: p.lat,
          lng: p.lng,
        },
      });
      summary.places++;
    } catch (e) {
      summary.errors.push(`Place ${p.name}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }

  for (const pr of data.prices ?? []) {
    try {
      const cityId = await resolveCityId(pr.citySlug, pr.cityName);
      if (!cityId) {
        summary.errors.push(`Price ${pr.serviceName}: no city`);
        continue;
      }
      const tourist = pr.touristPrice ?? 0;
      const fair = pr.fairPrice ?? 0;
      await prisma.price.create({
        data: {
          serviceName: pr.serviceName,
          cityId,
          category: mapPriceCategory(pr.category),
          touristPriceMin: tourist,
          touristPriceMax: tourist,
          fairPriceMin: fair,
          fairPriceMax: fair,
          currency: pr.currency || "NPR",
          routeFrom: pr.routeFrom,
          routeTo: pr.routeTo,
          localTip: pr.tip,
          verified: true,
        },
      });
      summary.prices++;
    } catch (e) {
      summary.errors.push(`Price ${pr.serviceName}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }

  for (const e of data.emergency ?? []) {
    try {
      await prisma.emergencyNumber.create({
        data: {
          label: e.label,
          number: e.number,
          description: e.description,
          published: true,
          sortOrder: 0,
        },
      });
      summary.emergency++;
    } catch (err) {
      summary.errors.push(`Emergency ${e.label}: ${err instanceof Error ? err.message : "failed"}`);
    }
  }

  for (const ph of data.phrases ?? []) {
    try {
      await prisma.translationPhrase.create({
        data: {
          english: ph.english,
          nepali: ph.nepali,
          category: ph.category || "general",
          published: true,
          sortOrder: 0,
        },
      });
      summary.phrases++;
    } catch (err) {
      summary.errors.push(`Phrase: ${err instanceof Error ? err.message : "failed"}`);
    }
  }

  return summary;
}
