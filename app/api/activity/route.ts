import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity/log";
import { getSessionIdFromRequest } from "@/lib/session";

const schema = z.object({
  action_type: z.string(),
  details: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid activity" }, { status: 400 });
  }

  const sessionId = await getSessionIdFromRequest(request);
  await logActivity({
    sessionId,
    actionType: parsed.data.action_type,
    details: parsed.data.details,
  });

  return NextResponse.json({ ok: true });
}
