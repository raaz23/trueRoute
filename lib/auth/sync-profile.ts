import { createAdminClient } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

export async function syncUserProfile(
  user: User,
  extra?: { name?: string; nationality?: string }
) {
  const admin = createAdminClient();
  if (!admin) return;

  const meta = user.user_metadata ?? {};
  const name =
    extra?.name ||
    (meta.full_name as string) ||
    (meta.name as string) ||
    user.email?.split("@")[0] ||
    "Traveler";

  await admin.from("users").upsert(
    {
      id: user.id,
      email: user.email!,
      name,
      nationality: extra?.nationality || (meta.nationality as string) || null,
      avatar_url: (meta.avatar_url as string) || (meta.picture as string) || null,
      role: "tourist",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
}
