import type { BadgeType, BusinessCategory } from "@prisma/client";

export const BUSINESS_CATEGORIES: { value: BusinessCategory; label: string; icon: string }[] = [
  { value: "HOTEL", label: "Hotels", icon: "🏨" },
  { value: "RESORT", label: "Resorts", icon: "🌴" },
  { value: "RESTAURANT", label: "Restaurants", icon: "🍽️" },
  { value: "CAFE", label: "Cafes", icon: "☕" },
  { value: "TRAVEL_AGENCY", label: "Travel Agencies", icon: "✈️" },
  { value: "TOUR_OPERATOR", label: "Tour Operators", icon: "🗺️" },
  { value: "ADVENTURE", label: "Adventure", icon: "🧗" },
  { value: "TRANSPORT", label: "Transport", icon: "🚌" },
  { value: "TAXI", label: "Taxi", icon: "🚕" },
  { value: "CAR_RENTAL", label: "Car Rental", icon: "🚗" },
  { value: "BIKE_RENTAL", label: "Bike Rental", icon: "🚲" },
  { value: "SHOP", label: "Shopping", icon: "🛍️" },
  { value: "HANDICRAFT", label: "Handicrafts", icon: "🎨" },
  { value: "CULTURAL_CENTER", label: "Cultural Centers", icon: "🏛️" },
  { value: "MUSEUM", label: "Museums", icon: "🏺" },
  { value: "ATTRACTION", label: "Attractions", icon: "📸" },
  { value: "EMERGENCY_SERVICE", label: "Emergency Services", icon: "🚨" },
  { value: "NGO", label: "NGOs", icon: "🤝" },
  { value: "GOVERNMENT", label: "Government", icon: "🏛️" },
  { value: "OTHER", label: "Other", icon: "📋" },
];

export const BADGE_META: Record<
  BadgeType,
  { label: string; color: string; description: string }
> = {
  VERIFIED: {
    label: "Verified Business",
    color: "var(--teal)",
    description: "Identity and registration verified by TrueRoute",
  },
  GOVERNMENT_VERIFIED: {
    label: "Government Verified",
    color: "#6B8FD4",
    description: "Approved by a government tourism authority",
  },
  COMMUNITY_TRUSTED: {
    label: "Community Trusted",
    color: "var(--gold)",
    description: "Highly recommended by travelers",
  },
  FAIR_PRICING: {
    label: "Fair Pricing Certified",
    color: "#22c55e",
    description: "Prices align with local market averages",
  },
  TOP_RATED: {
    label: "Top Rated",
    color: "#f59e0b",
    description: "Consistently excellent reviews",
  },
  SCAM_FREE: {
    label: "Scam-Free Record",
    color: "#a855f7",
    description: "No verified scam reports on record",
  },
};

export const SUBSCRIPTION_LIMITS = {
  FREE: { maxMedia: 10, maxPosts: 3, analytics: false, featured: false },
  PREMIUM: { maxMedia: 100, maxPosts: 50, analytics: true, featured: true },
  ENTERPRISE: { maxMedia: 500, maxPosts: 200, analytics: true, featured: true },
} as const;

export function categoryLabel(cat: BusinessCategory): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
}

export function categoryIcon(cat: BusinessCategory): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === cat)?.icon ?? "📋";
}
