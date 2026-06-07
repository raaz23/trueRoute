import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessReviewSchema } from "@/lib/validations/business";
import { refreshBusinessTrustScores } from "@/lib/business/queries";
import { rateLimit, clientIp, rateLimitResponse } from "@/lib/security/rate-limit";
import { detectSuspiciousReview } from "@/lib/business/scam-detection";
import { createHash } from "crypto";

type RouteCtx = { params: Promise<{ slug: string }> };

function reviewFingerprint(request: Request, authorName?: string): string {
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent") ?? "";
  return createHash("sha256").update(`${ip}:${ua}:${authorName ?? ""}`).digest("hex").slice(0, 32);
}

export async function GET(_req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reviews = await prisma.businessReview.findMany({
    where: { businessId: business.id, approved: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const ip = clientIp(request);
  const rl = rateLimit(`review:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  const { slug } = await ctx.params;
  const business = await prisma.business.findUnique({ where: { slug, status: "APPROVED" } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const data = businessReviewSchema.parse(body);
    const fp = reviewFingerprint(request, data.authorName);

    const recentSameFp = await prisma.businessReview.count({
      where: {
        businessId: business.id,
        reviewFingerprint: fp,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });
    if (recentSameFp > 0) {
      return NextResponse.json(
        { error: "You already reviewed this business recently." },
        { status: 429 }
      );
    }

    const recentReviews = await prisma.businessReview.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { text: true, authorName: true, overallRating: true },
    });

    const suspicion = detectSuspiciousReview(data.text, recentReviews);
    const autoApprove = !suspicion.suspicious && data.overallRating >= 2 && data.overallRating <= 5;

    const review = await prisma.businessReview.create({
      data: {
        businessId: business.id,
        overallRating: data.overallRating,
        serviceQuality: data.serviceQuality,
        fairPricing: data.fairPricing,
        cleanliness: data.cleanliness,
        safety: data.safety,
        authenticity: data.authenticity,
        staffBehavior: data.staffBehavior,
        text: data.text,
        authorName: data.authorName,
        nationality: data.nationality,
        reviewFingerprint: fp,
        approved: autoApprove,
      },
    });

    if (autoApprove) await refreshBusinessTrustScores(business.id);

    return NextResponse.json({
      ...review,
      message: autoApprove
        ? "Review published. Thank you for helping travelers!"
        : "Review submitted for moderation. It will appear after TrueRoute verification.",
      pending: !autoApprove,
      suspicion: suspicion.suspicious ? suspicion.reasons : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
