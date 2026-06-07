import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessRegisterSchema } from "@/lib/validations/business";
import { slugify, generateQrCode, toJsonArray } from "@/lib/business/serialize";
import { findDuplicateBusinesses } from "@/lib/business/duplicate-check";
import { rateLimit, clientIp, rateLimitResponse } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const rl = rateLimit(`register:${ip}`, 3, 24 * 60 * 60 * 1000);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  try {
    const body = await request.json();
    const data = businessRegisterSchema.parse(body);

    const duplicates = await findDuplicateBusinesses({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });
    if (duplicates.length > 0) {
      return NextResponse.json(
        {
          error: "A similar business is already registered.",
          duplicates: duplicates.map((d) => ({ name: d.name, slug: d.slug, status: d.status })),
        },
        { status: 409 }
      );
    }

    let slug = slugify(data.name);
    const existing = await prisma.business.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    let qrCode = generateQrCode();
    while (await prisma.business.findUnique({ where: { qrCode } })) {
      qrCode = generateQrCode();
    }

    let ownerId: string | undefined;
    if (data.ownerEmail) {
      const owner = await prisma.user.upsert({
        where: { email: data.ownerEmail.toLowerCase() },
        create: {
          email: data.ownerEmail.toLowerCase(),
          name: data.ownerName,
          role: "BUSINESS",
        },
        update: { role: "BUSINESS", name: data.ownerName ?? undefined },
      });
      ownerId = owner.id;
    }

    const business = await prisma.business.create({
      data: {
        slug,
        qrCode,
        accountType: data.accountType,
        category: data.category,
        status: "PENDING",
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        establishedYear: data.establishedYear,
        email: data.email.toLowerCase(),
        phone: data.phone,
        whatsapp: data.whatsapp,
        website: data.website || null,
        cityId: data.cityId,
        lat: data.lat,
        lng: data.lng,
        address: data.address,
        languagesJson: toJsonArray(data.languages),
        ownerId,
      },
      include: { city: { select: { name: true, slug: true } } },
    });

    return NextResponse.json({
      ok: true,
      business,
      message: "Registration submitted. TrueRoute will review and approve your profile.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
