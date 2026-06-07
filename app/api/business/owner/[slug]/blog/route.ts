import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/business/owner-auth";
import { businessBlogSchema } from "@/lib/validations/business";
import { slugify } from "@/lib/business/serialize";
import { SUBSCRIPTION_LIMITS } from "@/lib/business/constants";
import { z } from "zod";

const blogUpdateSchema = businessBlogSchema.extend({
  ownerEmail: z.string().email(),
  id: z.string().optional(),
  slug: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const email = new URL(request.url).searchParams.get("email");
  const denied = await requireOwner(slug, email);
  if (denied) return denied;

  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const posts = await prisma.businessBlogPost.findMany({
    where: { businessId: business.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = blogUpdateSchema.parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const business = await prisma.business.findUnique({
      where: { slug },
      include: { _count: { select: { blogPosts: true } } },
    });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const limits = SUBSCRIPTION_LIMITS[business.subscriptionPlan];
    if (business._count.blogPosts >= limits.maxPosts) {
      return NextResponse.json({ error: `Blog post limit (${limits.maxPosts}) reached` }, { status: 403 });
    }

    const postSlug = data.slug ?? slugify(data.title);
    const post = await prisma.businessBlogPost.create({
      data: {
        businessId: business.id,
        slug: postSlug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImageUrl: data.coverImageUrl || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
    });
    return NextResponse.json(post);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  try {
    const data = blogUpdateSchema.extend({ id: z.string() }).parse(await request.json());
    const denied = await requireOwner(slug, data.ownerEmail);
    if (denied) return denied;

    const post = await prisma.businessBlogPost.update({
      where: { id: data.id },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImageUrl: data.coverImageUrl || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
    });
    return NextResponse.json(post);
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
  await prisma.businessBlogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
