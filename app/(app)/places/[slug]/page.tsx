"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = String(params.slug ?? "");
  const { bundle, hasOfflineData } = useOfflineBundle();

  const place = bundle?.places.find((p) => p.slug === slug);

  if (!place) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8 text-center">
        <p className="text-[var(--text-muted)]">
          {hasOfflineData
            ? "Place not found in your offline pack."
            : "Download the offline pack from Profile to view places without internet."}
        </p>
        <Link href="/places" className="mt-4 inline-block text-[var(--gold)] hover:underline">
          ← All places
        </Link>
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6 md:p-8">
      <Link href="/places" className="text-[13px] font-medium text-[var(--gold)] hover:underline">
        ← All places
      </Link>
      <div className="mt-4">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--gold)]">
          {place.city?.name} · {place.category}
        </p>
        <h1 className="font-display text-3xl font-bold">{place.name}</h1>
      </div>
      {place.history && (
        <div className="mt-6">
          <h2 className="font-semibold text-[var(--teal)]">History & story</h2>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-mid)]">
            {place.history}
          </p>
        </div>
      )}
      {place.description && (
        <p className="mt-4 text-[15px] text-[var(--text-muted)]">{place.description}</p>
      )}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {place.entryFeeTourist != null && (
          <div className="rounded-xl border border-white/8 p-4">
            <p className="text-[11px] uppercase text-[var(--text-muted)]">Tourist entry</p>
            <p className="font-display text-xl font-bold text-[var(--red)]">
              NPR {place.entryFeeTourist}
            </p>
          </div>
        )}
        {place.entryFeeLocal != null && (
          <div className="rounded-xl border border-white/8 p-4">
            <p className="text-[11px] uppercase text-[var(--text-muted)]">Local entry</p>
            <p className="font-display text-xl font-bold text-[var(--teal)]">
              NPR {place.entryFeeLocal}
            </p>
          </div>
        )}
      </div>
      {place.fairPriceTip && (
        <p className="mt-6 rounded-xl bg-[var(--gold-muted)] p-4 text-[14px] text-[var(--gold)]">
          💡 {place.fairPriceTip}
        </p>
      )}
    </article>
  );
}
