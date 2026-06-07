import { NextResponse } from "next/server";
import { createClientSafe } from "@/lib/supabase/server";
import { syncUserProfile } from "@/lib/auth/sync-profile";
import { isEmailVerified } from "@/lib/auth/founder";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  nationality: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClientSafe();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    if (!isEmailVerified(user)) {
      return NextResponse.json({ error: "Email not verified" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = schema.safeParse(body);

    await syncUserProfile(user, parsed.success ? parsed.data : undefined);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name ?? user.email,
      },
    });
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
