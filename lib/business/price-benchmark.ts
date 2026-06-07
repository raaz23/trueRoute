import { prisma } from "@/lib/prisma";
import type { BusinessCategory } from "@prisma/client";

const CATEGORY_TO_PRICE: Partial<Record<BusinessCategory, string>> = {
  HOTEL: "ACCOMMODATION",
  RESORT: "ACCOMMODATION",
  RESTAURANT: "FOOD",
  CAFE: "FOOD",
  TAXI: "TRANSPORT",
  TRANSPORT: "TRANSPORT",
  CAR_RENTAL: "TRANSPORT",
  BIKE_RENTAL: "TRANSPORT",
  ATTRACTION: "ATTRACTION",
  SHOP: "SHOPPING",
  HANDICRAFT: "SHOPPING",
};

export async function benchmarkBusinessServices(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      services: { where: { published: true } },
      city: true,
    },
  });
  if (!business?.cityId) return [];

  const priceCategory = CATEGORY_TO_PRICE[business.category];
  const marketPrices = priceCategory
    ? await prisma.price.findMany({
        where: { cityId: business.cityId, category: priceCategory as never },
        take: 20,
      })
    : [];

  return business.services.map((service) => {
    const match = marketPrices.find((p) =>
      p.serviceName.toLowerCase().includes(service.name.toLowerCase().slice(0, 8))
    );
    const fairMin = match?.fairPriceMin ?? null;
    const touristMin = match?.touristPriceMin ?? null;
    const priceMin = service.priceMin ?? null;

    let status: "fair" | "above_market" | "unknown" = "unknown";
    let deviationPct: number | null = null;

    if (priceMin != null && fairMin != null && fairMin > 0) {
      deviationPct = Math.round(((priceMin - fairMin) / fairMin) * 100);
      status = priceMin <= fairMin * 1.25 ? "fair" : "above_market";
    }

    return {
      serviceId: service.id,
      serviceName: service.name,
      businessPriceMin: priceMin,
      fairMarketMin: fairMin,
      touristMarketMin: touristMin,
      deviationPct,
      status,
      marketReference: match?.serviceName ?? null,
    };
  });
}
