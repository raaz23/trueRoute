import { createAdminClient } from "@/lib/supabase/admin";
import { getFounderEmail } from "./founder";

export async function promoteFounderToAdmin(userId: string, email: string) {
  const admin = createAdminClient();
  if (!admin) return;

  await admin.from("users").upsert(
    {
      id: userId,
      email,
      name: "TrueRoute Admin",
      role: "admin",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
}

export function assertFounderEmailForAdmin(email: string | undefined): boolean {
  return email?.trim().toLowerCase() === getFounderEmail();
}
