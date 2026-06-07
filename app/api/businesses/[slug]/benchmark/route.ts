import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { benchmarkBusinessServices } from "@/lib/business/price-benchmark";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const business = await prisma.business.findUnique({
    where: { slug, status: "APPROVED" },
    select: { id: true },
  });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const benchmarks = await benchmarkBusinessServices(business.id);
  const flagged = benchmarks.filter((b) => b.status === "above_market");

  return NextResponse.json({
    benchmarks,
    summary: {
      total: benchmarks.length,
      fair: benchmarks.filter((b) => b.status === "fair").length,
      aboveMarket: flagged.length,
      unknown: benchmarks.filter((b) => b.status === "unknown").length,
    },
    flagged,
  });
}
