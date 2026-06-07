"use client";

import Link from "next/link";
import type { BusinessCardData } from "@/components/business/BusinessCard";

export default function BusinessCompare({
  selected,
  onRemove,
  onClear,
}: {
  selected: BusinessCardData[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}) {
  if (!selected.length) return null;

  const rows = [
    { label: "Category", key: (b: BusinessCardData) => b.categoryLabel },
    { label: "City", key: (b: BusinessCardData) => b.city?.name ?? "—" },
    { label: "Rating", key: (b: BusinessCardData) => (b.avgRating > 0 ? `★ ${b.avgRating}` : "New") },
    { label: "Reviews", key: (b: BusinessCardData) => String(b.reviewCount) },
    { label: "Trust score", key: (b: BusinessCardData) => `${b.trustScore}%` },
    {
      label: "Safety score",
      key: (b: BusinessCardData) =>
        b.emergencyTrustScore != null ? `${b.emergencyTrustScore}%` : "—",
    },
    {
      label: "From (NPR)",
      key: (b: BusinessCardData) =>
        b.minPrice != null ? `NPR ${b.minPrice.toLocaleString()}` : "—",
    },
    { label: "Verified", key: (b: BusinessCardData) => (b.verified ? "Yes" : "No") },
    { label: "Badges", key: (b: BusinessCardData) => String(b.badges?.length ?? 0) },
  ];

  return (
    <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--bg-card)] p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">
          Compare ({selected.length}/3)
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-[12px] text-[var(--text-muted)] hover:text-[var(--red)]"
        >
          Clear all
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 pr-4 text-[var(--text-muted)]">Metric</th>
              {selected.map((b) => (
                <th key={b.slug} className="py-2 pr-4 font-semibold">
                  <Link href={`/business/${b.slug}`} className="hover:text-[var(--gold)]">
                    {b.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => onRemove(b.slug)}
                    className="ml-2 text-[var(--text-muted)] hover:text-[var(--red)]"
                  >
                    ×
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/5">
                <td className="py-2 pr-4 text-[var(--text-muted)]">{row.label}</td>
                {selected.map((b) => (
                  <td key={b.slug} className="py-2 pr-4">
                    {row.key(b)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
