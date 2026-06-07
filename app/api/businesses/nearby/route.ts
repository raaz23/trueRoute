import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { distanceMeters } from "@/lib/geo";
import { averageRating } from "@/lib/business/trust-score";
import { categoryLabel } from "@/lib/business/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radiusKm = Number(searchParams.get("radius") ?? 10);
  const category = searchParams.get("category") ?? undefined;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const businesses = await prisma.business.findMany({
    where: {
      status: "APPROVED",
      lat: { not: null },
      lng: { not: null },
      ...(category ? { category: category as never } : {}),
    },
    include: {
      city: { select: { name: true, slug: true } },
      badges: true,
      reviews: { where: { approved: true }, select: { overallRating: true, approved: true } },
    },
  });

  const nearby = businesses
    .map((b) => ({
      ...b,
      distanceKm: distanceMeters(lat, lng, b.lat!, b.lng!) / 1000,
      categoryLabel: categoryLabel(b.category),
      avgRating: averageRating(b.reviews),
    }))
    .filter((b) => b.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 30);

  return NextResponse.json(nearby);
}
