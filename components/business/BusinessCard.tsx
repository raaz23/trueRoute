import Link from "next/link";
import type { BadgeType, BusinessCategory } from "@prisma/client";
import BusinessBadges from "@/components/business/BusinessBadges";
import { categoryIcon } from "@/lib/business/constants";

export type BusinessCardData = {
  slug: string;
  name: string;
  tagline?: string | null;
  category: BusinessCategory;
  categoryLabel: string;
  city?: { name: string; slug: string } | null;
  coverImageUrl?: string | null;
  logoUrl?: string | null;
  trustScore: number;
  emergencyTrustScore?: number;
  featured?: boolean;
  verified?: boolean;
  badges?: { badgeType: BadgeType }[];
  avgRating: number;
  reviewCount: number;
  distanceKm?: number;
  minPrice?: number | null;
};

export default function BusinessCard({ business }: { business: BusinessCardData }) {
  return (
    <Link
      href={`/business/${business.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-card)] transition hover:-translate-y-0.5 hover:border-[var(--gold)]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="relative h-36 bg-gradient-to-br from-[var(--gold-muted)] to-transparent">
        {business.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.coverImageUrl}
            alt=""
            className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl opacity-40">
            {categoryIcon(business.category)}
          </div>
        )}
        {business.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] font-bold uppercase text-black">
            Featured
          </span>
        )}
        {business.distanceKm != null && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
            {business.distanceKm.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          {business.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logoUrl}
              alt=""
              className="h-10 w-10 rounded-xl border border-white/10 object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xl">
              {categoryIcon(business.category)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-[17px] font-semibold group-hover:text-[var(--gold)]">
              {business.name}
            </h3>
            <p className="text-[12px] text-[var(--text-muted)]">
              {business.categoryLabel}
              {business.city ? ` · ${business.city.name}` : ""}
            </p>
          </div>
        </div>

        {business.tagline && (
          <p className="mt-2 line-clamp-2 text-[13px] text-[var(--text-mid)]">{business.tagline}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
          <span className="font-semibold text-[var(--gold)]">
            {business.avgRating > 0 ? `★ ${business.avgRating}` : "New"}
          </span>
          <span className="text-[var(--text-muted)]">
            {business.reviewCount} review{business.reviewCount !== 1 ? "s" : ""}
          </span>
          <span className="text-[var(--teal)]">Trust {business.trustScore}%</span>
          {business.minPrice != null && (
            <span className="text-[var(--text-mid)]">From NPR {business.minPrice.toLocaleString()}</span>
          )}
        </div>

        {business.badges && business.badges.length > 0 && (
          <div className="mt-3">
            <BusinessBadges badges={business.badges} />
          </div>
        )}
      </div>
    </Link>
  );
}
