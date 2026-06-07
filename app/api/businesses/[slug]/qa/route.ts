import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessQnASchema } from "@/lib/validations/business";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const qas = await prisma.businessQnA.findMany({
    where: { businessId: business.id, published: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(qas);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const business = await prisma.business.findUnique({ where: { slug, status: "APPROVED" } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const data = businessQnASchema.parse(body);

    const qa = await prisma.businessQnA.create({
      data: {
        businessId: business.id,
        question: data.question,
        askerName: data.askerName,
      },
    });

    return NextResponse.json(qa);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
