import { NextResponse } from "next/server";
import { z } from "zod";
import { checkDangerZonesNearby } from "@/lib/geo";
import { buildTravelPack } from "@/lib/data/travel-pack";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity/log";
import { getSessionIdFromRequest } from "@/lib/session";

const schema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  userId: z.string().uuid().nullable().optional(),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const { latitude, longitude, userId } = parsed.data;
    const sessionId =
      parsed.data.sessionId || (await getSessionIdFromRequest(request));

    const pack = await buildTravelPack();
    let dangers = checkDangerZonesNearby(
      latitude,
      longitude,
      pack.dangerZones.map((z) => ({
        id: z.id,
        zone_name: z.zone_name,
        reason: z.reason,
        severity: z.severity,
        latitude: z.latitude,
        longitude: z.longitude,
        radius_meters: z.radius_meters,
      }))
    );

    const admin = createAdminClient();
    if (admin) {
      const { data: zones } = await admin
        .from("danger_zones")
        .select("*")
        .eq("is_active", true);

      if (zones?.length) {
        dangers = checkDangerZonesNearby(
          latitude,
          longitude,
          zones.map((z) => ({
            id: z.id,
            zone_name: z.zone_name,
            reason: z.reason,
            severity: z.severity,
            latitude: Number(z.latitude),
            longitude: Number(z.longitude),
            radius_meters: z.radius_meters,
          }))
        );
      }

      await admin.from("gps_tracking").insert({
        user_id: userId ?? null,
        session_id: sessionId,
        latitude,
        longitude,
        is_danger_zone: dangers.length > 0,
      });
    }

    await logActivity({
      userId: userId ?? null,
      sessionId,
      actionType: "gps_check",
      details: { danger: dangers.length > 0 },
      userLocation: { lat: latitude, lng: longitude },
    });

    if (dangers.length > 0) {
      const d = dangers[0];
      return NextResponse.json({
        alert: true,
        dangers,
        message: `⚠️ ${d.severity} zone nearby: ${d.zone_name} — ${d.reason}`,
      });
    }

    return NextResponse.json({ alert: false, dangers: [] });
  } catch (error) {
    console.error("Danger check:", error);
    return NextResponse.json({ error: "Failed to check danger zones" }, { status: 500 });
  }
}
