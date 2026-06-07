import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyBusinessOwnerBySlug } from "@/lib/auth/rbac";
import { z } from "zod";

const updateSchema = z.object({
  ownerEmail: z.string().email(),
  tagline: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().max(300).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const email = new URL(request.url).searchParams.get("email")?.toLowerCase();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const allowed = await verifyBusinessOwnerBySlug(email, slug);
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: true,
      packages: true,
      offers: true,
      qas: true,
      inquiries: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  return NextResponse.json(business);
}

export async function PATCH(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    const allowed = await verifyBusinessOwnerBySlug(data.ownerEmail, slug);
    if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const business = await prisma.business.update({
      where: { slug },
      data: {
        tagline: data.tagline,
        description: data.description,
        phone: data.phone,
        whatsapp: data.whatsapp,
        website: data.website || null,
        address: data.address,
        coverImageUrl: data.coverImageUrl || null,
        logoUrl: data.logoUrl || null,
      },
    });

    return NextResponse.json(business);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
