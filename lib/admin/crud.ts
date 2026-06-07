import { prisma } from "@/lib/prisma";

export const adminModels = {
  cities: prisma.city,
  places: prisma.place,
  prices: prisma.price,
  faq: prisma.faq,
  testimonials: prisma.testimonial,
  photos: prisma.photo,
  emergency: prisma.emergencyNumber,
  phrases: prisma.translationPhrase,
  settings: prisma.siteSetting,
  waitlist: prisma.waitlist,
  submissions: prisma.priceSubmission,
  feedback: prisma.feedback,
  businesses: prisma.business,
} as const;

export type AdminModelKey = keyof typeof adminModels;
