import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email(),
  country: z.string().optional(),
});

export const feedbackSchema = z.object({
  appRating: z.number().int().min(1).max(5),
  text: z.string().min(3).max(2000),
  authorName: z.string().max(80).optional(),
  nationality: z.string().max(80).optional(),
});

export const priceSubmissionSchema = z.object({
  cityId: z.string().min(1),
  category: z.enum(["TRANSPORT", "FOOD", "ACCOMMODATION", "ATTRACTION", "SHOPPING"]),
  serviceName: z.string().min(2).max(120),
  routeFrom: z.string().max(80).optional(),
  routeTo: z.string().max(80).optional(),
  pricePaid: z.number().int().positive(),
  currency: z.string().max(8).default("NPR"),
  notes: z.string().max(500).optional(),
});

export const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1).max(4000),
    })
  ),
});

export const translateSchema = z.object({
  text: z.string().min(1).max(2000),
  source: z.string().default("en"),
  target: z.string().default("ne"),
});
