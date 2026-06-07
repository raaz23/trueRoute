import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isFounderEmail, isEmailVerified } from "@/lib/auth/founder";
import { promoteFounderToAdmin } from "@/lib/auth/promote-admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error_description");

  if (errorParam) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent(errorParam)}`
    );
  }

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth_config`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent(error.message)}`
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isFounderEmail(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent("Only yadavraj1244@gmail.com can access admin.")}`
    );
  }

  if (!isEmailVerified(user)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=verify_email`);
  }

  await promoteFounderToAdmin(user.id, user.email);

  return NextResponse.redirect(`${origin}/admin`);
}
