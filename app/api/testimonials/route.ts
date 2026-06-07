import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.testimonial.findMany({
    where: { published: true, featured: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}
