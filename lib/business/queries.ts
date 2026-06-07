import { prisma } from "@/lib/prisma";
import type { BusinessCategory, BusinessStatus } from "@prisma/client";
import { parseJsonArray } from "@/lib/business/serialize";
import { averageRating } from "@/lib/business/trust-score";
import { categoryLabel } from "@/lib/business/constants";

export type BusinessListFilters = {
  city?: string;
  category?: BusinessCategory;
  featured?: boolean;
  verified?: boolean;
  q?: string;
  minRating?: number;
  minTrust?: number;
  maxPrice?: number;
  sort?: "trust" | "rating" | "price" | "popular" | "distance";
  limit?: number;
};

export async function listBusinesses(filters: BusinessListFilters = {}) {
  const { city, category, featured, verified, q, minRating, minTrust, maxPrice, sort, limit = 50 } =
    filters;

  const businesses = await prisma.business.findMany({
    where: {
      status: "APPROVED" as BusinessStatus,
      ...(city ? { city: { slug: city } } : {}),
      ...(category ? { category } : {}),
      ...(featured ? { featured: true } : {}),
      ...(verified ? { verifiedAt: { not: null } } : {}),
      ...(minTrust != null ? { trustScore: { gte: minTrust } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { tagline: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    include: {
      city: { select: { name: true, slug: true } },
      badges: true,
      reviews: { where: { approved: true }, select: { overallRating: true, approved: true } },
      services: {
        where: { published: true },
        select: { priceMin: true, priceMax: true },
        take: 5,
      },
      _count: { select: { reviews: true, services: true } },
    },
    orderBy:
      sort === "popular"
        ? [{ profileViews: "desc" as const }]
        : sort === "trust"
          ? [{ trustScore: "desc" as const }]
          : [{ featured: "desc" as const }, { trustScore: "desc" as const }, { profileViews: "desc" as const }],
    take: limit,
  });

  let results = businesses.map((b) => {
    const minServicePrice = b.services.reduce<number | null>((min, s) => {
      if (s.priceMin == null) return min;
      return min == null ? s.priceMin : Math.min(min, s.priceMin);
    }, null);

    return {
    id: b.id,
    slug: b.slug,
    qrCode: b.qrCode,
    name: b.name,
    tagline: b.tagline,
    category: b.category,
    categoryLabel: categoryLabel(b.category),
    city: b.city,
    coverImageUrl: b.coverImageUrl,
    logoUrl: b.logoUrl,
    trustScore: b.trustScore,
    emergencyTrustScore: b.emergencyTrustScore,
    featured: b.featured,
    verified: !!b.verifiedAt,
    badges: b.badges,
    reviewCount: b._count.reviews,
    serviceCount: b._count.services,
    lat: b.lat,
    lng: b.lng,
    languages: parseJsonArray(b.languagesJson),
    minPrice: minServicePrice,
    _avgRating: averageRating(b.reviews),
  };
  });

  if (minRating != null) {
    results = results.filter((b) => b._avgRating >= minRating);
  }
  if (maxPrice != null) {
    results = results.filter((b) => b.minPrice == null || b.minPrice <= maxPrice);
  }
  if (sort === "rating") {
    results.sort((a, b) => b._avgRating - a._avgRating);
  }
  if (sort === "price") {
    results.sort((a, b) => (a.minPrice ?? 999999) - (b.minPrice ?? 999999));
  }

  return results.map(({ _avgRating, ...b }) => ({
    ...b,
    avgRating: _avgRating,
  }));
}

export async function getBusinessBySlug(slug: string) {
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      city: true,
      badges: true,
      branches: { orderBy: { sortOrder: "asc" } },
      media: { orderBy: { sortOrder: "asc" } },
      services: { where: { published: true }, orderBy: { sortOrder: "asc" } },
      packages: { where: { published: true }, orderBy: { sortOrder: "asc" } },
      offers: { where: { published: true }, orderBy: { createdAt: "desc" } },
      blogPosts: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 10,
      },
      events: {
        where: { published: true, startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        take: 10,
      },
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      reports: {
        where: { status: { in: ["verified", "resolved"] } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      qas: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { follows: true, favorites: true } },
    },
  });

  if (!business) return null;

  return {
    ...business,
    languages: parseJsonArray(business.languagesJson),
    amenities: parseJsonArray(business.amenitiesJson),
    certifications: parseJsonArray(business.certificationsJson),
    awards: parseJsonArray(business.awardsJson),
    usps: parseJsonArray(business.uspJson),
    businessHours: business.businessHours
      ? (JSON.parse(business.businessHours) as Record<string, string>)
      : null,
    avgRating: averageRating(business.reviews),
    followCount: business._count.follows,
    favoriteCount: business._count.favorites,
    services: business.services.map((s) => ({
      ...s,
      includes: parseJsonArray(s.includesJson),
      excludes: parseJsonArray(s.excludesJson),
    })),
    packages: business.packages.map((p) => ({
      ...p,
      includes: parseJsonArray(p.includesJson),
      excludes: parseJsonArray(p.excludesJson),
    })),
    reviews: business.reviews.map((r) => ({
      ...r,
      photoUrls: parseJsonArray(r.photoUrlsJson),
    })),
  };
}

export async function trackAnalytics(
  businessId: string,
  eventType: "PROFILE_VIEW" | "QR_SCAN" | "INQUIRY" | "PHONE_CLICK" | "WHATSAPP_CLICK" | "DIRECTION_CLICK",
  metadata?: Record<string, unknown>
) {
  await prisma.$transaction([
    prisma.businessAnalyticsEvent.create({
      data: {
        businessId,
        eventType,
        metadataJson: metadata ? JSON.stringify(metadata) : null,
      },
    }),
    prisma.business.update({
      where: { id: businessId },
      data: {
        ...(eventType === "PROFILE_VIEW" ? { profileViews: { increment: 1 } } : {}),
        ...(eventType === "QR_SCAN" ? { qrScans: { increment: 1 } } : {}),
        ...(eventType === "INQUIRY" ? { leadCount: { increment: 1 } } : {}),
      },
    }),
  ]);
}

export async function refreshBusinessTrustScores(businessId: string) {
  const [reviews, reports] = await Promise.all([
    prisma.businessReview.findMany({ where: { businessId } }),
    prisma.businessReport.findMany({ where: { businessId } }),
  ]);

  const { computeTrustScore } = await import("@/lib/business/trust-score");
  const scores = computeTrustScore(reviews, reports);

  await prisma.business.update({
    where: { id: businessId },
    data: scores,
  });

  return scores;
}
