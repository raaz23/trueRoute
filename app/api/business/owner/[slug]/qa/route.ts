import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyBusinessOwnerBySlug } from "@/lib/auth/rbac";
import { z } from "zod";

const answerSchema = z.object({
  ownerEmail: z.string().email(),
  qaId: z.string(),
  answer: z.string().min(5).max(2000),
});

type RouteCtx = { params: Promise<{ slug: string }> };

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = answerSchema.parse(await request.json());
    const allowed = await verifyBusinessOwnerBySlug(data.ownerEmail, slug);
    if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const qa = await prisma.businessQnA.update({
      where: { id: data.qaId },
      data: { answer: data.answer, answeredAt: new Date() },
    });

    return NextResponse.json(qa);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
