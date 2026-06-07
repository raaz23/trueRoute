import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isFounderEmail, isEmailVerified } from "./founder";

export async function getSupabaseUserFromRequest(
  request: NextRequest
): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          /* read-only in middleware guard */
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export function isFounderAdminUser(user: User | null): boolean {
  if (!user) return false;
  if (!isFounderEmail(user.email)) return false;
  return isEmailVerified(user);
}
