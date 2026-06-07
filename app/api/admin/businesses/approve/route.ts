import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { id, action, rejectionNote } = await request.json();
  if (!id || !action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({ where: { id } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    const updated = await prisma.business.update({
      where: { id },
      data: {
        status: "APPROVED",
        verifiedAt: new Date(),
        rejectionNote: null,
      },
    });

    await prisma.businessBadge.upsert({
      where: { businessId_badgeType: { businessId: id, badgeType: "VERIFIED" } },
      create: { businessId: id, badgeType: "VERIFIED" },
      update: {},
    });

    return NextResponse.json(updated);
  }

  if (action === "reject") {
    const updated = await prisma.business.update({
      where: { id },
      data: { status: "REJECTED", rejectionNote: rejectionNote ?? "Not approved" },
    });
    return NextResponse.json(updated);
  }

  if (action === "suspend") {
    const updated = await prisma.business.update({
      where: { id },
      data: { status: "SUSPENDED" },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
