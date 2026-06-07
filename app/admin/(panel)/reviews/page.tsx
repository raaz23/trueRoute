"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  overallRating: number;
  text?: string | null;
  authorName?: string | null;
  createdAt: string;
  business: { name: string; slug: string };
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const load = () =>
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then(setReviews);

  useEffect(() => {
    load();
  }, []);

  const moderate = async (id: string, action: "approve" | "reject") => {
    await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Review moderation</h1>
      <p className="mt-2 text-[14px] text-[var(--text-muted)]">
        Approve authentic reviews. Reject spam and fake patterns.
      </p>
      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-[var(--text-muted)]">No reviews pending moderation.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
              <p className="font-semibold">
                {r.business.name} · {"★".repeat(r.overallRating)}
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">
                {r.authorName ?? "Anonymous"} · {new Date(r.createdAt).toLocaleString()}
              </p>
              {r.text && <p className="mt-2 text-[14px]">{r.text}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => moderate(r.id, "approve")}
                  className="rounded-lg bg-[var(--teal)] px-4 py-2 text-[12px] font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => moderate(r.id, "reject")}
                  className="rounded-lg border border-[var(--red)]/40 px-4 py-2 text-[12px] text-[var(--red)]"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
