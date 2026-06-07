import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/business/owner-auth";
import { z } from "zod";
import type { MediaAlbum } from "@prisma/client";

const mediaSchema = z.object({
  ownerEmail: z.string().email(),
  url: z.string().url(),
  album: z.enum([
    "COVER", "LOGO", "INTERIOR", "EXTERIOR", "PRODUCTS", "SERVICES", "TEAM", "EVENTS", "VIDEOS",
  ]).default("INTERIOR"),
  caption: z.string().max(300).optional(),
  isVideo: z.boolean().default(false),
  videoProvider: z.string().optional(),
});

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const email = new URL(request.url).searchParams.get("email");
  const denied = await requireOwner(slug, email);
  if (denied) return denied;

  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const media = await prisma.businessMedia.findMany({
    where: { businessId: business.id },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(media);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = mediaSchema.parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const media = await prisma.businessMedia.create({
      data: {
        businessId: business.id,
        url: data.url,
        album: data.album as MediaAlbum,
        caption: data.caption,
        isVideo: data.isVideo,
        videoProvider: data.videoProvider,
      },
    });

    if (data.album === "COVER") {
      await prisma.business.update({ where: { id: business.id }, data: { coverImageUrl: data.url } });
    }
    if (data.album === "LOGO") {
      await prisma.business.update({ where: { id: business.id }, data: { logoUrl: data.url } });
    }

    return NextResponse.json(media);
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
  await prisma.businessMedia.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
