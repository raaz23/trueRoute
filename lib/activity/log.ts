import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ActivityPayload = {
  userId?: string | null;
  sessionId: string;
  actionType: string;
  details?: Record<string, unknown>;
  userLocation?: { lat: number; lng: number };
};

export async function logActivity(payload: ActivityPayload): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const admin = createAdminClient();
  if (!admin) return;

  const loc = payload.userLocation
    ? `(${payload.userLocation.lat},${payload.userLocation.lng})`
    : null;

  await admin.from("activity_log").insert({
    user_id: payload.userId ?? null,
    session_id: payload.sessionId,
    action_type: payload.actionType,
    details: payload.details ?? {},
    user_location: loc,
  });
}
