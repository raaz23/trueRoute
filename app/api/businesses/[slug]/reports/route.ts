import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessReportSchema } from "@/lib/validations/business";
import { refreshBusinessTrustScores } from "@/lib/business/queries";
import { rateLimit, clientIp, rateLimitResponse } from "@/lib/security/rate-limit";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function POST(request: Request, ctx: RouteCtx) {
  const ip = clientIp(request);
  const rl = rateLimit(`report:${ip}`, 5, 24 * 60 * 60 * 1000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  const { slug } = await ctx.params;
  const business = await prisma.business.findUnique({ where: { slug, status: "APPROVED" } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const data = businessReportSchema.parse(body);

    const report = await prisma.businessReport.create({
      data: {
        businessId: business.id,
        reportType: data.reportType,
        title: data.title,
        description: data.description,
        amountPaid: data.amountPaid,
        expectedPrice: data.expectedPrice,
        status: "pending",
      },
    });

    await refreshBusinessTrustScores(business.id);
    return NextResponse.json({
      ok: true,
      report,
      message: "Report submitted. TrueRoute will review for accountability.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
