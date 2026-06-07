import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/business/owner-auth";
import { businessEventSchema } from "@/lib/validations/business";
import { z } from "zod";

const eventUpdateSchema = businessEventSchema.extend({
  ownerEmail: z.string().email(),
  id: z.string().optional(),
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

  const events = await prisma.businessEvent.findMany({
    where: { businessId: business.id },
    orderBy: { startsAt: "desc" },
  });
  return NextResponse.json(events);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = eventUpdateSchema.parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const event = await prisma.businessEvent.create({
      data: {
        businessId: business.id,
        title: data.title,
        description: data.description,
        startsAt: new Date(data.startsAt),
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        location: data.location,
        ticketPrice: data.ticketPrice,
        ticketUrl: data.ticketUrl || null,
        published: data.published,
      },
    });
    return NextResponse.json(event);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = eventUpdateSchema.extend({ id: z.string() }).parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const event = await prisma.businessEvent.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startsAt: new Date(data.startsAt),
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        location: data.location,
        ticketPrice: data.ticketPrice,
        ticketUrl: data.ticketUrl || null,
        published: data.published,
      },
    });
    return NextResponse.json(event);
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
  await prisma.businessEvent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
