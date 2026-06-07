import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const documents = await prisma.businessDocument.findMany({
    where: { verified: false },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      business: { select: { name: true, slug: true, city: { select: { name: true } } } },
    },
  });
  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const { id, action } = await request.json();
  if (!id || !["verify", "reject"].includes(action)) {
    return NextResponse.json({ error: "id and action (verify|reject) required" }, { status: 400 });
  }

  const doc = await prisma.businessDocument.findUnique({
    where: { id },
    include: { business: true },
  });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "verify") {
    await prisma.businessDocument.update({
      where: { id },
      data: { verified: true, verifiedAt: new Date() },
    });

    await prisma.businessBadge.upsert({
      where: {
        businessId_badgeType: { businessId: doc.businessId, badgeType: "VERIFIED" },
      },
      create: { businessId: doc.businessId, badgeType: "VERIFIED" },
      update: {},
    });

    if (doc.docType === "GOVERNMENT_APPROVAL") {
      await prisma.businessBadge.upsert({
        where: {
          businessId_badgeType: { businessId: doc.businessId, badgeType: "GOVERNMENT_VERIFIED" },
        },
        create: { businessId: doc.businessId, badgeType: "GOVERNMENT_VERIFIED" },
        update: {},
      });
    }

    return NextResponse.json({ ok: true, message: "Document verified" });
  }

  await prisma.businessDocument.delete({ where: { id } });
  return NextResponse.json({ ok: true, message: "Document rejected and removed" });
}
