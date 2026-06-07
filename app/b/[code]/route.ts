import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackAnalytics } from "@/lib/business/queries";

type RouteCtx = { params: Promise<{ code: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const { code } = await ctx.params;

  const business = await prisma.business.findUnique({
    where: { qrCode: code },
    select: { slug: true, id: true, status: true },
  });

  if (!business || business.status !== "APPROVED") {
    return NextResponse.redirect(new URL("/business", request.url));
  }

  await trackAnalytics(business.id, "QR_SCAN");
  return NextResponse.redirect(new URL(`/business/${business.slug}`, request.url));
}
