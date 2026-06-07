"use client";

import { useState } from "react";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    if (text.length < 3) {
      setError("Please write a short message.");
      return;
    }
    setError("");
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appRating: rating, text, authorName: name || undefined }),
    });
    if (res.ok) setDone(true);
    else setError("Could not send. Try again.");
  };

  return (
    <section className="border-t border-white/5 py-20 px-6">
      <div className="mx-auto max-w-[520px] rounded-2xl border border-white/8 bg-[var(--bg-card)] p-8">
        <h2 className="font-display text-2xl font-bold text-center">Share your feedback</h2>
        <p className="mt-2 text-center text-[14px] text-[var(--text-muted)]">
          Help us improve TrueRoute for every traveler after you.
        </p>
        {done ? (
          <p className="mt-6 text-center text-[var(--teal)]">Thank you! We review all feedback in admin.</p>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`text-2xl ${n <= rating ? "text-[var(--gold)]" : "text-[var(--text-muted)]"}`}
                  aria-label={`${n} stars`}
                >
                  ★
                </button>
              ))}
            </div>
            <input
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none"
            />
            <textarea
              placeholder="Your experience with TrueRoute…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none"
            />
            {error && <p className="text-[12px] text-[var(--red)]">{error}</p>}
            <button
              type="button"
              onClick={submit}
              className="w-full rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] py-3 font-semibold text-white"
            >
              Submit feedback
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
