import { NextResponse } from "next/server";
import { getBusinessBySlug, trackAnalytics } from "@/lib/business/queries";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  if (business.status !== "APPROVED") {
    return NextResponse.json({ error: "Business not available" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get("track") !== "false") {
    await trackAnalytics(business.id, "PROFILE_VIEW");
  }

  return NextResponse.json(business);
}
