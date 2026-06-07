import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { refreshBusinessTrustScores } from "@/lib/business/queries";

export async function GET() {
  const reports = await prisma.businessReport.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      business: { select: { name: true, slug: true, cityId: true } },
    },
  });
  return NextResponse.json(reports);
}

export async function POST(request: Request) {
  const { id, action, businessReply } = await request.json();
  if (!id || !["verify", "resolve", "dismiss"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const report = await prisma.businessReport.findUnique({
    where: { id },
    include: { business: true },
  });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const statusMap = {
    verify: "verified",
    resolve: "resolved",
    dismiss: "dismissed",
  } as const;

  await prisma.businessReport.update({
    where: { id },
    data: {
      status: statusMap[action as keyof typeof statusMap],
      resolvedAt: action !== "dismiss" ? new Date() : undefined,
    },
  });

  if (action === "verify") {
    await prisma.complaintCase.create({
      data: {
        businessId: report.businessId,
        reportId: report.id,
        title: report.title ?? `Report: ${report.reportType}`,
        description: report.description,
        status: "OPEN",
      },
    });
  }

  await refreshBusinessTrustScores(report.businessId);
  return NextResponse.json({ ok: true });
}
