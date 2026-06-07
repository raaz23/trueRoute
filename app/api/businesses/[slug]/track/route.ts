import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackAnalytics } from "@/lib/business/queries";
import { z } from "zod";

const schema = z.object({
  eventType: z.enum([
    "PHONE_CLICK",
    "WHATSAPP_CLICK",
    "DIRECTION_CLICK",
  ]),
});

type RouteCtx = { params: Promise<{ slug: string }> };

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const business = await prisma.business.findUnique({
    where: { slug, status: "APPROVED" },
    select: { id: true },
  });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const { eventType } = schema.parse(await request.json());
    await trackAnalytics(business.id, eventType);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }
}
