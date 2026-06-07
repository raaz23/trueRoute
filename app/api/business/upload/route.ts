import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyBusinessOwnerBySlug } from "@/lib/auth/rbac";
import { uploadBusinessFile } from "@/lib/storage/business-upload";
import { SUBSCRIPTION_LIMITS } from "@/lib/business/constants";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const slug = String(form.get("slug") ?? "");
    const ownerEmail = String(form.get("ownerEmail") ?? "").toLowerCase().trim();
    const kind = (form.get("kind") as "media" | "document") ?? "media";
    const file = form.get("file");

    if (!slug || !ownerEmail || !(file instanceof File)) {
      return NextResponse.json({ error: "slug, ownerEmail, and file required" }, { status: 400 });
    }

    const allowed = await verifyBusinessOwnerBySlug(ownerEmail, slug);
    if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const business = await prisma.business.findUnique({
      where: { slug },
      include: { _count: { select: { media: true, documents: true } } },
    });
    if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const limits = SUBSCRIPTION_LIMITS[business.subscriptionPlan];
    if (kind === "media" && business._count.media >= limits.maxMedia) {
      return NextResponse.json(
        { error: `Media limit reached (${limits.maxMedia}). Upgrade plan for more.` },
        { status: 403 }
      );
    }

    const { url, storage } = await uploadBusinessFile(file, business.id, kind);
    return NextResponse.json({ ok: true, url, storage });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
