import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { refreshBusinessTrustScores } from "@/lib/business/queries";

export async function GET() {
  const reviews = await prisma.businessReview.findMany({
    where: { approved: false },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      business: { select: { name: true, slug: true } },
    },
  });
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const { id, action } = await request.json();
  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  const review = await prisma.businessReview.findUnique({ where: { id } });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    await prisma.businessReview.update({
      where: { id },
      data: { approved: true },
    });
    await refreshBusinessTrustScores(review.businessId);
  } else {
    await prisma.businessReview.delete({ where: { id } });
  }

  return NextResponse.json({ ok: true });
}
