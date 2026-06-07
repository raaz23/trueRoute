import { NextResponse } from "next/server";
import { verifyBusinessOwnerBySlug } from "@/lib/auth/rbac";

export async function requireOwner(
  slug: string,
  ownerEmail: string | null | undefined
): Promise<NextResponse | null> {
  if (!ownerEmail?.trim()) {
    return NextResponse.json({ error: "ownerEmail required" }, { status: 400 });
  }
  const ok = await verifyBusinessOwnerBySlug(ownerEmail.toLowerCase().trim(), slug);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized — not business owner" }, { status: 403 });
  }
  return null;
}
