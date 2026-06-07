import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [
    pendingBusinesses,
    pendingReviews,
    pendingReports,
    openComplaints,
    totalBusinesses,
    approvedBusinesses,
    verifiedBusinesses,
    featuredBusinesses,
  ] = await Promise.all([
    prisma.business.count({ where: { status: "PENDING" } }),
    prisma.businessReview.count({ where: { approved: false } }),
    prisma.businessReport.count({ where: { status: "pending" } }),
    prisma.complaintCase.count({ where: { status: { in: ["OPEN", "UNDER_REVIEW"] } } }),
    prisma.business.count(),
    prisma.business.count({ where: { status: "APPROVED" } }),
    prisma.business.count({ where: { verifiedAt: { not: null } } }),
    prisma.business.count({ where: { featured: true } }),
  ]);

  const recentPending = await prisma.business.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { city: { select: { name: true } } },
  });

  const recentReports = await prisma.businessReport.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { business: { select: { name: true, slug: true } } },
  });

  return NextResponse.json({
    counts: {
      pendingBusinesses,
      pendingReviews,
      pendingReports,
      openComplaints,
      totalBusinesses,
      approvedBusinesses,
      verifiedBusinesses,
      featuredBusinesses,
    },
    recentPending,
    recentReports,
  });
}
