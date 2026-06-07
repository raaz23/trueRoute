import type { BusinessReport } from "@prisma/client";

type ReviewInput = {
  overallRating: number;
  fairPricing?: number | null;
  safety?: number | null;
  approved: boolean;
};

type ReportInput = Pick<BusinessReport, "reportType" | "status">;

export function computeTrustScore(
  reviews: ReviewInput[],
  reports: ReportInput[]
): { trustScore: number; emergencyTrustScore: number } {
  const approved = reviews.filter((r) => r.approved);
  const avgRating =
    approved.length > 0
      ? approved.reduce((s, r) => s + r.overallRating, 0) / approved.length
      : 0;

  const fairPricingAvg =
    approved.filter((r) => r.fairPricing != null).length > 0
      ? approved.reduce((s, r) => s + (r.fairPricing ?? 0), 0) /
        approved.filter((r) => r.fairPricing != null).length
      : 0;

  const safetyAvg =
    approved.filter((r) => r.safety != null).length > 0
      ? approved.reduce((s, r) => s + (r.safety ?? 0), 0) /
        approved.filter((r) => r.safety != null).length
      : 0;

  const verifiedReports = reports.filter(
    (r) => r.status === "verified" || r.status === "resolved"
  );
  const scamReports = verifiedReports.filter(
    (r) => r.reportType === "SCAM" || r.reportType === "OVERCHARGING"
  );
  const safetyReports = verifiedReports.filter((r) => r.reportType === "SAFETY");

  const reportPenalty = Math.min(40, verifiedReports.length * 5 + scamReports.length * 8);
  const safetyPenalty = Math.min(50, safetyReports.length * 12);

  const reviewBoost = avgRating * 12;
  const fairPricingBoost = fairPricingAvg * 4;
  const safetyBoost = safetyAvg * 3;

  const trustScore = Math.max(
    0,
    Math.min(100, Math.round(reviewBoost + fairPricingBoost + 20 - reportPenalty))
  );

  const emergencyTrustScore = Math.max(
    0,
    Math.min(100, Math.round(80 + safetyBoost - safetyPenalty - scamReports.length * 10))
  );

  return { trustScore, emergencyTrustScore };
}

export function averageRating(reviews: ReviewInput[]): number {
  const approved = reviews.filter((r) => r.approved);
  if (!approved.length) return 0;
  return Math.round((approved.reduce((s, r) => s + r.overallRating, 0) / approved.length) * 10) / 10;
}
