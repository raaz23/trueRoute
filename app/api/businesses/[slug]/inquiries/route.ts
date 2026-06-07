import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessInquirySchema } from "@/lib/validations/business";
import { trackAnalytics } from "@/lib/business/queries";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const business = await prisma.business.findUnique({ where: { slug, status: "APPROVED" } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const data = businessInquirySchema.parse(body);

    const inquiry = await prisma.businessInquiry.create({
      data: {
        businessId: business.id,
        inquiryType: data.inquiryType,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        preferredDate: data.preferredDate,
        guestCount: data.guestCount,
      },
    });

    await trackAnalytics(business.id, "INQUIRY");
    return NextResponse.json({ ok: true, inquiry });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
