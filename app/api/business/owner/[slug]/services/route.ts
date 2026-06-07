import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/business/owner-auth";
import { toJsonArray } from "@/lib/business/serialize";
import { z } from "zod";

const serviceSchema = z.object({
  ownerEmail: z.string().email(),
  id: z.string().optional(),
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  priceMin: z.number().int().optional(),
  priceMax: z.number().int().optional(),
  currency: z.string().default("NPR"),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  hiddenFeeWarning: z.string().max(500).optional(),
  fairPriceNote: z.string().max(500).optional(),
  published: z.boolean().default(true),
});

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const email = new URL(request.url).searchParams.get("email");
  const denied = await requireOwner(slug, email);
  if (denied) return denied;

  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const services = await prisma.businessService.findMany({
    where: { businessId: business.id },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = serviceSchema.parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const service = await prisma.businessService.create({
      data: {
        businessId: business.id,
        name: data.name,
        description: data.description,
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        currency: data.currency,
        includesJson: toJsonArray(data.includes),
        excludesJson: toJsonArray(data.excludes),
        hiddenFeeWarning: data.hiddenFeeWarning,
        fairPriceNote: data.fairPriceNote,
        published: data.published,
      },
    });
    return NextResponse.json(service);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = serviceSchema.extend({ id: z.string() }).parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const service = await prisma.businessService.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        currency: data.currency,
        includesJson: toJsonArray(data.includes),
        excludesJson: toJsonArray(data.excludes),
        hiddenFeeWarning: data.hiddenFeeWarning,
        fairPriceNote: data.fairPriceNote,
        published: data.published,
      },
    });
    return NextResponse.json(service);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const { ownerEmail, id } = await request.json();
  const denied = await requireOwner(slug, ownerEmail);
  if (denied) return denied;
  await prisma.businessService.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
