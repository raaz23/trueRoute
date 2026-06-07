import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionIdFromRequest } from "@/lib/session";

const pointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
  speed: z.number().optional(),
  createdAt: z.string().optional(),
});

const schema = z.object({
  points: z.array(pointSchema).min(1).max(50),
  userId: z.string().uuid().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid GPS data" }, { status: 400 });
    }

    const sessionId = await getSessionIdFromRequest(request);
    const admin = createAdminClient();

    if (admin) {
      const rows = parsed.data.points.map((p) => ({
        user_id: parsed.data.userId ?? null,
        session_id: sessionId,
        latitude: p.latitude,
        longitude: p.longitude,
        accuracy: p.accuracy ?? null,
        speed: p.speed ?? null,
        created_at: p.createdAt ?? new Date().toISOString(),
      }));
      await admin.from("gps_tracking").insert(rows);
    }

    return NextResponse.json({ ok: true, saved: parsed.data.points.length });
  } catch (error) {
    console.error("GPS track:", error);
    return NextResponse.json({ error: "Failed to save GPS" }, { status: 500 });
  }
}
