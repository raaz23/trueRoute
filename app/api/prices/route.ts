import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const citySlug = searchParams.get("city");
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const prices = await prisma.price.findMany({
    where: {
      verified: true,
      ...(citySlug
        ? { city: { slug: citySlug } }
        : {}),
      ...(category ? { category: category as never } : {}),
      ...(q
        ? {
            OR: [
              { serviceName: { contains: q } },
              { routeFrom: { contains: q } },
              { routeTo: { contains: q } },
            ],
          }
        : {}),
    },
    include: { city: { select: { name: true, slug: true } } },
    orderBy: [{ sortOrder: "asc" }, { serviceName: "asc" }],
  });

  return NextResponse.json(prices);
}
