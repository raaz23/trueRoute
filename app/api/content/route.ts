import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const [emergency, phrases, photos] = await Promise.all([
    prisma.emergencyNumber.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.translationPhrase.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.photo.findMany({ where: { approved: true }, orderBy: { sortOrder: "asc" }, take: 12 }),
  ]);
  return NextResponse.json({ settings: map, emergency, phrases, photos });
}
