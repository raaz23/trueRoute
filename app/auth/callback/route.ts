import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserProfile } from "@/lib/auth/sync-profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isEmailVerified } from "@/lib/auth/founder";
import { validateTouristEmail } from "@/lib/auth/email-validation";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/map";
  const errorParam = searchParams.get("error_description");

  if (errorParam) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorParam)}`
    );
  }

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(`${origin}/login?error=auth_config`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const check = validateTouristEmail(user.email);
    if (!check.ok) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(check.message)}`
      );
    }
  }

  if (user && isEmailVerified(user)) {
    await syncUserProfile(user);
  }

  if (user && !isEmailVerified(user)) {
    const pending = new URL("/auth/verify-pending", origin);
    pending.searchParams.set("email", user.email ?? "");
    return NextResponse.redirect(pending);
  }

  if (next.startsWith("/admin") && user) {
    next = "/admin";
  }

  return NextResponse.redirect(`${origin}${next}`);
}
