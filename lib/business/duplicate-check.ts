import { prisma } from "@/lib/prisma";

export async function findDuplicateBusinesses(input: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}) {
  const nameNorm = input.name.trim().toLowerCase();
  const candidates = await prisma.business.findMany({
    where: {
      OR: [
        { email: input.email.toLowerCase() },
        { name: { contains: input.name.trim() } },
        ...(input.phone ? [{ phone: input.phone }] : []),
      ],
    },
    select: { id: true, name: true, slug: true, status: true, email: true },
    take: 10,
  });

  return candidates.filter((c) => c.name.trim().toLowerCase() === nameNorm || c.email === input.email.toLowerCase());
}
