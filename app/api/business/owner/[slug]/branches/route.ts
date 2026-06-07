import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/business/owner-auth";
import { z } from "zod";

const branchSchema = z.object({
  ownerEmail: z.string().email(),
  id: z.string().optional(),
  name: z.string().min(2).max(120),
  address: z.string().max(300).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().max(30).optional(),
  isPrimary: z.boolean().default(false),
});

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const email = new URL(request.url).searchParams.get("email");
  const denied = await requireOwner(slug, email);
  if (denied) return denied;

  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const branches = await prisma.businessBranch.findMany({
    where: { businessId: business.id },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(branches);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = branchSchema.parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (data.isPrimary) {
      await prisma.businessBranch.updateMany({
        where: { businessId: business.id },
        data: { isPrimary: false },
      });
    }

    const branch = await prisma.businessBranch.create({
      data: {
        businessId: business.id,
        name: data.name,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        phone: data.phone,
        isPrimary: data.isPrimary,
      },
    });
    return NextResponse.json(branch);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = branchSchema.extend({ id: z.string() }).parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (data.isPrimary) {
      await prisma.businessBranch.updateMany({
        where: { businessId: business.id },
        data: { isPrimary: false },
      });
    }

    const branch = await prisma.businessBranch.update({
      where: { id: data.id },
      data: {
        name: data.name,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        phone: data.phone,
        isPrimary: data.isPrimary,
      },
    });
    return NextResponse.json(branch);
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
  await prisma.businessBranch.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
