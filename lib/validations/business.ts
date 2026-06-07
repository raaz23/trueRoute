import { z } from "zod";

const businessCategoryEnum = z.enum([
  "HOTEL", "RESORT", "RESTAURANT", "CAFE", "TRAVEL_AGENCY", "TOUR_OPERATOR",
  "ADVENTURE", "TRANSPORT", "TAXI", "CAR_RENTAL", "BIKE_RENTAL", "SHOP",
  "HANDICRAFT", "CULTURAL_CENTER", "MUSEUM", "ATTRACTION", "EMERGENCY_SERVICE",
  "NGO", "GOVERNMENT", "OTHER",
]);

const accountTypeEnum = z.enum(["BUSINESS", "ORGANIZATION", "GOVERNMENT"]);

export const businessRegisterSchema = z.object({
  accountType: accountTypeEnum.default("BUSINESS"),
  category: businessCategoryEnum,
  name: z.string().min(2).max(120),
  tagline: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  establishedYear: z.number().int().min(1800).max(2100).optional(),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal("")),
  cityId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().max(300).optional(),
  languages: z.array(z.string()).optional(),
  ownerEmail: z.string().email().optional(),
  ownerName: z.string().max(80).optional(),
});

export const businessReviewSchema = z.object({
  overallRating: z.number().int().min(1).max(5),
  serviceQuality: z.number().int().min(1).max(5).optional(),
  fairPricing: z.number().int().min(1).max(5).optional(),
  cleanliness: z.number().int().min(1).max(5).optional(),
  safety: z.number().int().min(1).max(5).optional(),
  authenticity: z.number().int().min(1).max(5).optional(),
  staffBehavior: z.number().int().min(1).max(5).optional(),
  text: z.string().max(3000).optional(),
  authorName: z.string().max(80).optional(),
  nationality: z.string().max(80).optional(),
});

export const businessReportSchema = z.object({
  reportType: z.enum([
    "OVERCHARGING", "SCAM", "MISLEADING_AD", "HIDDEN_FEES", "POOR_SERVICE", "SAFETY",
  ]),
  title: z.string().max(200).optional(),
  description: z.string().min(10).max(3000),
  amountPaid: z.number().int().positive().optional(),
  expectedPrice: z.number().int().positive().optional(),
});

export const businessInquirySchema = z.object({
  inquiryType: z.enum(["GENERAL", "BOOKING", "QUOTE"]).default("GENERAL"),
  name: z.string().min(2).max(80),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  message: z.string().min(5).max(2000),
  preferredDate: z.string().max(50).optional(),
  guestCount: z.number().int().positive().optional(),
});

export const businessQnASchema = z.object({
  question: z.string().min(5).max(500),
  askerName: z.string().max(80).optional(),
});

export const businessBlogSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(20000),
  excerpt: z.string().max(500).optional(),
  seoTitle: z.string().max(100).optional(),
  seoDescription: z.string().max(300).optional(),
  published: z.boolean().default(false),
});

export const businessEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(3000).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  location: z.string().max(300).optional(),
  ticketPrice: z.number().int().optional(),
  ticketUrl: z.string().url().optional().or(z.literal("")),
});
