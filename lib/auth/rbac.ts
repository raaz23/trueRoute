import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import { isFounderEmail } from "@/lib/auth/founder";
import type { User } from "@supabase/supabase-js";

const SUPER_ROLES: UserRole[] = ["SUPERADMIN", "ADMIN"];
const REGIONAL_ROLES: UserRole[] = ["SUB_ADMIN", "APPROVER"];

export async function getPrismaUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { regionAssignments: { include: { city: true } } },
  });
}

export function isFounderOrSuper(user: User | null, prismaRole?: UserRole): boolean {
  if (user && isFounderEmail(user.email)) return true;
  return prismaRole ? SUPER_ROLES.includes(prismaRole) : false;
}

export async function canModerateBusiness(
  email: string,
  businessCityId: string | null | undefined,
  supabaseUser?: User | null
): Promise<boolean> {
  const dbUser = await getPrismaUserByEmail(email);
  if (!dbUser) return supabaseUser ? isFounderEmail(supabaseUser.email) : false;

  if (isFounderOrSuper(supabaseUser ?? null, dbUser.role)) return true;
  if (!REGIONAL_ROLES.includes(dbUser.role)) return false;
  if (!businessCityId) return false;

  return dbUser.regionAssignments.some((a) => a.cityId === businessCityId);
}

export async function getAssignedCityIds(email: string): Promise<string[] | "all"> {
  const dbUser = await getPrismaUserByEmail(email);
  if (!dbUser) return "all";
  if (SUPER_ROLES.includes(dbUser.role) || dbUser.role === "SUPERADMIN") return "all";
  if (!REGIONAL_ROLES.includes(dbUser.role)) return [];
  return dbUser.regionAssignments.map((a) => a.cityId);
}

export async function verifyBusinessOwner(
  ownerEmail: string,
  businessId: string
): Promise<boolean> {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      owner: { email: ownerEmail.toLowerCase() },
    },
  });
  return !!business;
}

export async function verifyBusinessOwnerBySlug(
  ownerEmail: string,
  slug: string
): Promise<boolean> {
  const business = await prisma.business.findFirst({
    where: {
      slug,
      owner: { email: ownerEmail.toLowerCase() },
    },
  });
  return !!business;
}
