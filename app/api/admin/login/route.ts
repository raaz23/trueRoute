import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getFounderEmail, isEmailVerified } from "@/lib/auth/founder";
import { promoteFounderToAdmin } from "@/lib/auth/promote-admin";
import {
  adminCookieOptions,
  checkAdminPassword,
  createAdminToken,
  clearAdminCookieOptions,
} from "@/lib/auth/admin";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const founder = getFounderEmail();

  if (email.trim().toLowerCase() !== founder) {
    return NextResponse.json(
      { error: "Only the founder Gmail account can access admin." },
      { status: 403 }
    );
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: founder,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!isEmailVerified(data.user)) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Verify your Gmail in Supabase before signing in to admin." },
        { status: 403 }
      );
    }

    await promoteFounderToAdmin(data.user.id, data.user.email!);
    return NextResponse.json({ ok: true });
  }

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = createAdminToken();
  const res = NextResponse.json({ ok: true, mode: "local" });
  res.cookies.set(adminCookieOptions(token));
  return res;
}

export async function DELETE() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearAdminCookieOptions());
  return res;
}
