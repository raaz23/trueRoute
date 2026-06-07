import { NextResponse } from "next/server";
import { listBusinesses } from "@/lib/business/queries";
import type { BusinessCategory } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? undefined;
  const category = searchParams.get("category") as BusinessCategory | undefined;
  const featured = searchParams.get("featured") === "true";
  const verified = searchParams.get("verified") === "true";
  const q = searchParams.get("q") ?? undefined;
  const minRating = searchParams.get("minRating")
    ? Number(searchParams.get("minRating"))
    : undefined;
  const minTrust = searchParams.get("minTrust")
    ? Number(searchParams.get("minTrust"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const sort = (searchParams.get("sort") as "trust" | "rating" | "price" | "popular") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? 50);

  const businesses = await listBusinesses({
    city,
    category,
    featured,
    verified,
    q,
    minRating: Number.isFinite(minRating) ? minRating : undefined,
    minTrust: Number.isFinite(minTrust) ? minTrust : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    sort,
    limit: Math.min(limit, 100),
  });

  return NextResponse.json(businesses, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
