import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { priceSubmissionSchema } from "@/lib/validations/common";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = priceSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    const data = parsed.data;
    const submission = await prisma.priceSubmission.create({
      data: {
        cityId: data.cityId,
        category: data.category,
        serviceName: data.serviceName,
        routeFrom: data.routeFrom,
        routeTo: data.routeTo,
        pricePaid: data.pricePaid,
        currency: data.currency,
        notes: data.notes,
        status: "PENDING",
      },
    });
    return NextResponse.json({ ok: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: "Could not save submission" }, { status: 500 });
  }
}
