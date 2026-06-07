"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ModerationData = {
  counts: {
    pendingBusinesses: number;
    pendingReviews: number;
    pendingReports: number;
    openComplaints: number;
    totalBusinesses: number;
    approvedBusinesses: number;
    verifiedBusinesses: number;
    featuredBusinesses: number;
  };
  recentPending: { id: string; name: string; email: string; category: string; city?: { name: string } }[];
  recentReports: {
    id: string;
    reportType: string;
    description: string;
    business: { name: string; slug: string };
  }[];
};

export default function AdminModerationPage() {
  const [data, setData] = useState<ModerationData | null>(null);

  useEffect(() => {
    fetch("/api/admin/moderation")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const approve = async (id: string, action: string) => {
    await fetch("/api/admin/businesses/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    const res = await fetch("/api/admin/moderation");
    setData(await res.json());
  };

  if (!data) return <p className="text-[var(--text-muted)]">Loading moderation queue...</p>;

  const c = data.counts;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Marketplace Moderation</h1>
        <p className="mt-2 text-[15px] text-[var(--text-muted)]">
          Super Admin & Regional Admin hub — approvals, fraud reports, trust enforcement.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending businesses", value: c.pendingBusinesses, href: "#pending", color: "var(--gold)" },
          { label: "Pending reviews", value: c.pendingReviews, href: "/admin/reviews", color: "var(--teal)" },
          { label: "Scam reports", value: c.pendingReports, href: "/admin/reports", color: "var(--red)" },
          { label: "Open complaints", value: c.openComplaints, color: "var(--red)" },
          { label: "Total businesses", value: c.totalBusinesses, href: "/admin/businesses" },
          { label: "Approved", value: c.approvedBusinesses },
          { label: "Verified", value: c.verifiedBusinesses },
          { label: "Featured", value: c.featuredBusinesses },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/8 bg-[var(--bg-card)] p-5"
          >
            <div
              className="font-display text-3xl font-bold"
              style={{ color: card.color ?? "var(--text)" }}
            >
              {card.value}
            </div>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">{card.label}</p>
            {card.href && (
              <Link href={card.href} className="mt-2 inline-block text-[12px] text-[var(--gold)]">
                Manage →
              </Link>
            )}
          </div>
        ))}
      </div>

      <section id="pending">
        <h2 className="font-display text-xl font-semibold">Pending approvals</h2>
        <div className="mt-4 space-y-3">
          {data.recentPending.length === 0 ? (
            <p className="text-[var(--text-muted)]">No pending businesses.</p>
          ) : (
            data.recentPending.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[var(--bg-card)] p-4"
              >
                <div>
                  <p className="font-semibold">{b.name}</p>
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {b.category} · {b.city?.name ?? "No city"} · {b.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => approve(b.id, "approve")}
                    className="rounded-lg bg-[var(--teal)] px-4 py-2 text-[12px] font-semibold text-white"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => approve(b.id, "reject")}
                    className="rounded-lg border border-[var(--red)]/40 px-4 py-2 text-[12px] text-[var(--red)]"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => approve(b.id, "suspend")}
                    className="rounded-lg border border-white/10 px-4 py-2 text-[12px]"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">Recent scam reports</h2>
        <div className="mt-4 space-y-3">
          {data.recentReports.map((r) => (
            <div key={r.id} className="rounded-xl border border-[var(--red)]/20 bg-[var(--bg-card)] p-4">
              <p className="text-[12px] font-bold uppercase text-[var(--red)]">{r.reportType}</p>
              <p className="font-medium">{r.business.name}</p>
              <p className="mt-1 text-[13px] text-[var(--text-muted)]">{r.description.slice(0, 200)}</p>
              <Link href="/admin/reports" className="mt-2 inline-block text-[12px] text-[var(--gold)]">
                Review queue →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
