import type { BusinessReview, BusinessReport } from "@prisma/client";

const SPAM_PHRASES = [
  "best ever",
  "100% legit",
  "click here",
  "free money",
  "guaranteed",
];

export function detectSuspiciousReview(
  text: string | null | undefined,
  recentReviews: Pick<BusinessReview, "text" | "authorName" | "overallRating">[]
): { suspicious: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!text || text.length < 15) reasons.push("Very short review");
  if (text && text.length > 2500) reasons.push("Unusually long review");

  const lower = (text ?? "").toLowerCase();
  for (const phrase of SPAM_PHRASES) {
    if (lower.includes(phrase)) reasons.push(`Contains spam phrase: "${phrase}"`);
  }

  const dup = recentReviews.find(
    (r) => r.text && text && r.text.trim().toLowerCase() === text.trim().toLowerCase()
  );
  if (dup) reasons.push("Duplicate review text detected");

  const allFives = recentReviews.filter((r) => r.overallRating === 5).length;
  if (recentReviews.length >= 5 && allFives === recentReviews.length) {
    reasons.push("All recent reviews are 5-star — possible manipulation");
  }

  return { suspicious: reasons.length > 0, reasons };
}

export function detectSuspiciousPricing(
  priceMin: number | null | undefined,
  fairMarketMin: number | null | undefined
): { flagged: boolean; reason?: string } {
  if (priceMin == null || fairMarketMin == null || fairMarketMin <= 0) {
    return { flagged: false };
  }
  const ratio = priceMin / fairMarketMin;
  if (ratio > 2.5) {
    return {
      flagged: true,
      reason: `Price NPR ${priceMin} is ${Math.round(ratio * 100)}% of fair market min NPR ${fairMarketMin}`,
    };
  }
  return { flagged: false };
}

export function detectReportPatterns(
  reports: Pick<BusinessReport, "reportType" | "createdAt">[]
): { riskLevel: "low" | "medium" | "high"; count: number } {
  const recent = reports.filter(
    (r) => r.createdAt > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  );
  const scamCount = recent.filter(
    (r) => r.reportType === "SCAM" || r.reportType === "OVERCHARGING"
  ).length;

  if (scamCount >= 3) return { riskLevel: "high", count: scamCount };
  if (scamCount >= 1) return { riskLevel: "medium", count: scamCount };
  return { riskLevel: "low", count: scamCount };
}
