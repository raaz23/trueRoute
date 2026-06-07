"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLocalProfile } from "@/lib/offline/local";
import BusinessOwnerPortal from "@/components/business/owner/BusinessOwnerPortal";
import type { BadgeType, BusinessCategory, BusinessStatus } from "@prisma/client";

type DashboardBusiness = {
  id: string;
  slug: string;
  qrCode: string;
  name: string;
  status: BusinessStatus;
  category: BusinessCategory;
  trustScore: number;
  profileViews: number;
  qrScans: number;
  leadCount: number;
  city?: { name: string } | null;
  badges: { badgeType: BadgeType }[];
  _count: { reviews: number; inquiries: number; reports: number; follows: number };
};

type AnalyticsBucket = {
  businessId: string;
  events: { eventType: string; _count: number }[];
};

export default function BusinessDashboardPage() {
  const [email, setEmail] = useState("");
  const [businesses, setBusinesses] = useState<DashboardBusiness[]>([]);
  const [, setAnalytics] = useState<AnalyticsBucket[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string>("");
  const [supabaseDetail, setSupabaseDetail] = useState<string>("");

  useEffect(() => {
    const profile = getLocalProfile();
    if (profile?.email) setEmail(profile.email);
    fetch("/api/health/supabase")
      .then((r) => r.json())
      .then((d) => {
        setSupabaseStatus(d.message ?? (d.ok ? "Supabase OK" : "Local mode"));
        const buckets = d.checks?.storageBuckets;
        if (buckets) {
          const b = Object.entries(buckets)
            .filter(([, v]) => v)
            .map(([k]) => k)
            .join(", ");
          setSupabaseDetail(b ? `Storage: ${b}` : "");
        }
        if (d.checks?.marketplaceReady === false) {
          setSupabaseDetail((prev) =>
            `${prev ? prev + " · " : ""}Run supabase/marketplace.sql in Supabase SQL Editor`
          );
        }
      })
      .catch(() => setSupabaseStatus("Could not check Supabase"));
  }, []);

  const load = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const res = await fetch(`/api/business/dashboard?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!res.ok) {
      setBusinesses([]);
      setLoaded(true);
      return;
    }
    setBusinesses(data.businesses ?? []);
    setAnalytics(data.analytics ?? []);
    if (data.businesses?.length === 1) setActiveSlug(data.businesses[0].slug);
    setLoaded(true);
  };

  const active = businesses.find((b) => b.slug === activeSlug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Business Owner Portal</h1>
        <p className="mt-2 text-[15px] text-[var(--text-muted)]">
          Manage profile, media, services, branches, blog, events, and KYC documents.
        </p>
        <p className="mt-1 text-[12px] text-[var(--teal)]">{supabaseStatus}</p>
        {supabaseDetail && (
          <p className="text-[11px] text-[var(--text-muted)]">{supabaseDetail}</p>
        )}
      </div>

      <form onSubmit={load} className="flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Owner email (e.g. owner@himalayanguesthouse.demo)"
          className="flex-1 rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3 text-[14px]"
        />
        <button type="submit" className="rounded-xl bg-[var(--teal)] px-6 py-3 text-[14px] font-semibold text-white">
          Load
        </button>
      </form>

      {loaded && businesses.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-muted)]">No businesses found for this email.</p>
          <Link href="/business/register" className="mt-4 inline-block text-[var(--gold)] hover:underline">
            Register a business →
          </Link>
        </div>
      )}

      {businesses.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {businesses.map((b) => (
            <button
              key={b.slug}
              type="button"
              onClick={() => setActiveSlug(b.slug)}
              className={`rounded-xl px-4 py-2 text-[13px] font-medium ${
                activeSlug === b.slug
                  ? "bg-[var(--gold-muted)] text-[var(--gold)]"
                  : "border border-white/10 text-[var(--text-muted)]"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}

      {active && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Views", value: active.profileViews },
              { label: "QR scans", value: active.qrScans },
              { label: "Leads", value: active.leadCount },
              { label: "Trust", value: `${active.trustScore}%` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/8 p-3 text-center">
                <p className="font-display text-xl font-bold text-[var(--gold)]">{s.value}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>

          {active.status === "APPROVED" && (
            <BusinessOwnerPortal
              slug={active.slug}
              ownerEmail={email}
              businessName={active.name}
              status={active.status}
            />
          )}

          {active.status === "PENDING" && (
            <div className="space-y-4">
              <p className="rounded-xl bg-[var(--gold-muted)] p-4 text-[14px] text-[var(--gold)]">
                Awaiting TrueRoute approval. You can still edit your profile below — it goes live after approval.
              </p>
              <BusinessOwnerPortal
                slug={active.slug}
                ownerEmail={email}
                businessName={active.name}
                status={active.status}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
