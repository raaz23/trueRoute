import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { places: true, prices: true } },
    },
  });
  return NextResponse.json(cities);
}
