"use client";

import { useState } from "react";

const RATING_FIELDS = [
  { key: "serviceQuality", label: "Service Quality" },
  { key: "fairPricing", label: "Fair Pricing" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "safety", label: "Safety" },
  { key: "authenticity", label: "Authenticity" },
  { key: "staffBehavior", label: "Staff Behavior" },
] as const;

export default function ReviewForm({ slug }: { slug: string }) {
  const [overallRating, setOverallRating] = useState(5);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`/api/businesses/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overallRating,
          ...ratings,
          text,
          authorName: authorName || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPending(!!data.pending);
      setStatus("done");
      setText("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className={`rounded-xl p-4 text-[14px] ${pending ? "bg-[var(--gold-muted)] text-[var(--gold)]" : "bg-[var(--teal)]/15 text-[var(--teal)]"}`}>
        {pending
          ? "Review submitted for moderation. It will appear after TrueRoute verification."
          : "Thank you! Your honest review helps other travelers."}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
      <h3 className="font-display text-lg font-semibold">Leave a review</h3>

      <div>
        <label className="text-[12px] font-medium text-[var(--text-muted)]">Overall rating</label>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setOverallRating(n)}
              className={`text-2xl ${n <= overallRating ? "text-[var(--gold)]" : "text-white/20"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {RATING_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-[11px] text-[var(--text-muted)]">{f.label}</label>
            <select
              value={ratings[f.key] ?? ""}
              onChange={(e) =>
                setRatings((r) => ({
                  ...r,
                  [f.key]: e.target.value ? Number(e.target.value) : undefined!,
                }))
              }
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px]"
            >
              <option value="">—</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your honest experience..."
        rows={4}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px]"
      />

      <input
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Your name (optional)"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-6 py-2.5 text-[14px] font-semibold text-white disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Submit review"}
      </button>
      {status === "error" && (
        <p className="text-[13px] text-[var(--red)]">Could not submit. Try again.</p>
      )}
    </form>
  );
}
