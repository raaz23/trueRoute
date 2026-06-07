import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClientSafe } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity/log";
import { getSessionIdFromRequest } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const schema = z.object({
  feedbackType: z.string().optional(),
  appRating: z.number().int().min(1).max(5).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  text: z.string().optional(),
  placeId: z.string().uuid().optional(),
  categoryTags: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    }

    const d = parsed.data;
    const message = d.message ?? d.text ?? "";
    const rating = d.rating ?? d.appRating;
    if (!message && !rating) {
      return NextResponse.json({ error: "Message or rating required" }, { status: 400 });
    }

    const sessionId = await getSessionIdFromRequest(request);
    let userId: string | null = null;

    const supabase = await createClientSafe();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }

    const admin = createAdminClient();
    if (admin && isSupabaseConfigured()) {
      await admin.from("feedback").insert({
        user_id: userId,
        place_id: d.placeId ?? null,
        feedback_type: d.feedbackType ?? "app_rating",
        rating: rating ?? null,
        title: d.title ?? null,
        message,
        category_tags: d.categoryTags ?? [],
        status: "pending",
      });
    } else {
      await prisma.feedback.create({
        data: {
          appRating: rating,
          text: message,
          authorName: body.authorName,
          nationality: body.nationality,
          approved: false,
        },
      });
    }

    await logActivity({
      userId,
      sessionId,
      actionType: "feedback_submitted",
      details: { type: d.feedbackType, rating },
    });

    return NextResponse.json({
      success: true,
      ok: true,
      message: "Thank you for your feedback!",
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
