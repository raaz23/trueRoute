"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  users: number;
  places: number;
  prices: number;
  pending: number;
  waitlist: number;
  feedback: number;
  cities: number;
  businesses?: number;
  pendingBusinesses?: number;
  pendingReports?: number;
  pendingReviews?: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const cards = stats
    ? [
        { label: "Waitlist emails", value: stats.waitlist, href: "/admin/waitlist", color: "var(--gold)" },
        { label: "Fair prices", value: stats.prices, href: "/admin/prices", color: "var(--teal)" },
        { label: "Places", value: stats.places, href: "/admin/places", color: "var(--teal)" },
        { label: "Pending submissions", value: stats.pending, href: "/admin/submissions", color: "var(--red)" },
        { label: "New feedback", value: stats.feedback, href: "/admin/feedback", color: "var(--gold)" },
        { label: "Active cities", value: stats.cities, href: "/admin/cities", color: "var(--text)" },
        { label: "Live businesses", value: stats.businesses ?? 0, href: "/admin/moderation", color: "var(--teal)" },
        { label: "Pending businesses", value: stats.pendingBusinesses ?? 0, href: "/admin/moderation", color: "var(--gold)" },
        { label: "Scam reports", value: stats.pendingReports ?? 0, href: "/admin/reports", color: "var(--red)" },
        { label: "Review queue", value: stats.pendingReviews ?? 0, href: "/admin/reviews", color: "var(--gold)" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Welcome back, founder</h1>
      <p className="mt-2 max-w-xl text-[15px] text-[var(--text-muted)]">
        Update everything visitors see on TrueRoute — prices, places, FAQ, testimonials, and site text.
        Changes go live immediately.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card-hover rounded-2xl border border-white/8 bg-[var(--bg-card)] p-6"
          >
            <div className="font-display text-4xl font-bold" style={{ color: c.color }}>
              {c.value}
            </div>
            <div className="mt-2 text-[14px] font-medium text-[var(--text-muted)]">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold-muted)] p-6">
        <h2 className="font-semibold text-[var(--gold)]">Quick start</h2>
        <ul className="mt-3 space-y-2 text-[14px] text-[var(--text-mid)]">
          <li>
            1. Edit{" "}
            <Link href="/admin/prices" className="text-[var(--gold)] hover:underline">
              Fair Prices
            </Link>{" "}
            — your #1 feature
          </li>
          <li>
            2. Add stories in{" "}
            <Link href="/admin/places" className="text-[var(--gold)] hover:underline">
              Places
            </Link>
          </li>
          <li>
            3. Approve{" "}
            <Link href="/admin/feedback" className="text-[var(--gold)] hover:underline">
              Feedback
            </Link>{" "}
            for testimonials
          </li>
          <li>
            4. Update hero text in{" "}
            <Link href="/admin/settings" className="text-[var(--gold)] hover:underline">
              Site Text
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

