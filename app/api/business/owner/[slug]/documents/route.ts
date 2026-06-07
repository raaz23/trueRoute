import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/business/owner-auth";
import { z } from "zod";
import type { DocumentType } from "@prisma/client";

const docSchema = z.object({
  ownerEmail: z.string().email(),
  docType: z.enum(["BUSINESS_LICENSE", "GOVERNMENT_APPROVAL", "TAX_REGISTRATION", "OTHER"]),
  fileUrl: z.string().url(),
  fileName: z.string().max(200).optional(),
});

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const email = new URL(request.url).searchParams.get("email");
  const denied = await requireOwner(slug, email);
  if (denied) return denied;

  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const documents = await prisma.businessDocument.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(documents);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = docSchema.parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const business = await prisma.business.findUnique({ where: { slug } });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const doc = await prisma.businessDocument.create({
      data: {
        businessId: business.id,
        docType: data.docType as DocumentType,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        verified: false,
      },
    });
    return NextResponse.json({
      ...doc,
      message: "Document submitted for TrueRoute verification.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
