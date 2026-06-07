import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { waitlistSchema } from "@/lib/validations/common";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const { email, country } = parsed.data;

    const admin = createAdminClient();
    if (admin && isSupabaseConfigured()) {
      await admin.from("waitlist").upsert(
        { email, country, referral_source: "landing" },
        { onConflict: "email" }
      );
    } else {
      await prisma.waitlist.upsert({
        where: { email },
        create: { email, country },
        update: { country },
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not join waitlist" }, { status: 500 });
  }
}
