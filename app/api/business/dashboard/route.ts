import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyBusinessOwner } from "@/lib/auth/rbac";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.toLowerCase().trim();
  const businessId = searchParams.get("businessId") ?? undefined;

  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      ownedBusinesses: {
        ...(businessId ? { where: { id: businessId } } : {}),
        include: {
          city: { select: { name: true, slug: true } },
          badges: true,
          inquiries: { orderBy: { createdAt: "desc" }, take: 20 },
          _count: {
            select: {
              reviews: true,
              inquiries: true,
              reports: true,
              follows: true,
            },
          },
        },
      },
    },
  });

  if (!user?.ownedBusinesses.length) {
    return NextResponse.json({ error: "No businesses found for this owner email" }, { status: 404 });
  }

  if (businessId) {
    const ok = await verifyBusinessOwner(email, businessId);
    if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const analytics = await Promise.all(
    user.ownedBusinesses.map(async (b) => {
      const events = await prisma.businessAnalyticsEvent.groupBy({
        by: ["eventType"],
        where: {
          businessId: b.id,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        _count: true,
      });
      return { businessId: b.id, events };
    })
  );

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    businesses: user.ownedBusinesses,
    analytics,
  });
}
