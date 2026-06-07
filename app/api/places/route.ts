import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const citySlug = searchParams.get("city");
  const featured = searchParams.get("featured");

  const places = await prisma.place.findMany({
    where: {
      approved: true,
      ...(citySlug ? { city: { slug: citySlug } } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    },
    include: { city: { select: { name: true, slug: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(places);
}
