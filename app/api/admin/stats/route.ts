import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [users, places, prices, pending, waitlist, feedback, cities, businesses, pendingBusinesses, pendingReports, pendingReviews] =
    await Promise.all([
    prisma.user.count(),
    prisma.place.count(),
    prisma.price.count(),
    prisma.priceSubmission.count({ where: { status: "PENDING" } }),
    prisma.waitlist.count(),
    prisma.feedback.count({ where: { approved: false } }),
    prisma.city.count({ where: { isActive: true } }),
    prisma.business.count({ where: { status: "APPROVED" } }),
    prisma.business.count({ where: { status: "PENDING" } }),
    prisma.businessReport.count({ where: { status: "pending" } }),
    prisma.businessReview.count({ where: { approved: false } }),
  ]);
  return NextResponse.json({
    users,
    places,
    prices,
    pending,
    waitlist,
    feedback,
    cities,
    businesses,
    pendingBusinesses,
    pendingReports,
    pendingReviews,
  });
}
