import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AdminModelKey } from "@/lib/admin/crud";

const ALLOWED: AdminModelKey[] = [
  "cities",
  "places",
  "prices",
  "faq",
  "testimonials",
  "photos",
  "emergency",
  "phrases",
  "settings",
  "waitlist",
  "submissions",
  "feedback",
  "businesses",
];

type RouteCtx = { params: Promise<{ model: string }> };

function getDelegate(model: string) {
  if (!ALLOWED.includes(model as AdminModelKey)) return null;
  const map: Record<string, keyof typeof prisma> = {
    cities: "city",
    places: "place",
    prices: "price",
    faq: "faq",
    testimonials: "testimonial",
    photos: "photo",
    emergency: "emergencyNumber",
    phrases: "translationPhrase",
    settings: "siteSetting",
    waitlist: "waitlist",
    submissions: "priceSubmission",
    feedback: "feedback",
    businesses: "business",
  };
  const key = map[model];
  type Delegate = {
    findMany: (args?: object) => Promise<unknown[]>;
    create: (args: { data: object }) => Promise<unknown>;
    update: (args: { where: { id: string }; data: object }) => Promise<unknown>;
    delete: (args: { where: { id: string } }) => Promise<unknown>;
  };
  return key ? (prisma[key as keyof typeof prisma] as unknown as Delegate) : null;
}

export async function GET(_req: Request, ctx: RouteCtx) {
  const { model } = await ctx.params;
  const delegate = getDelegate(model);
  if (!delegate) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const include =
    model === "places"
      ? { city: { select: { name: true } } }
      : model === "prices" || model === "submissions" || model === "businesses"
        ? { city: { select: { name: true } } }
        : undefined;

  const orderBy =
    model === "settings"
      ? { key: "asc" as const }
      : model === "cities"
        ? { sortOrder: "asc" as const }
        : { createdAt: "desc" as const };

  const items = await delegate.findMany({
    ...(include ? { include } : {}),
    orderBy,
    take: 200,
  });
  return NextResponse.json(items);
}

export async function POST(request: Request, ctx: RouteCtx) {
  const { model } = await ctx.params;
  const delegate = getDelegate(model);
  if (!delegate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = await request.json();
  const item = await delegate.create({ data });
  return NextResponse.json(item);
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const { model } = await ctx.params;
  const delegate = getDelegate(model);
  if (!delegate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { id, ...data } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const item = await delegate.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(request: Request, ctx: RouteCtx) {
  const { model } = await ctx.params;
  const delegate = getDelegate(model);
  if (!delegate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await delegate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
