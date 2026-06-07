"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BusinessBadges from "@/components/business/BusinessBadges";
import ReviewForm from "@/components/business/ReviewForm";
import ReportForm from "@/components/business/ReportForm";
import InquiryForm from "@/components/business/InquiryForm";
import QrCodeDisplay from "@/components/business/QrCodeDisplay";
import { categoryIcon, categoryLabel } from "@/lib/business/constants";
import type { BadgeType, BusinessCategory } from "@prisma/client";

const BusinessMiniMap = dynamic(() => import("@/components/business/BusinessMiniMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-[var(--bg-card)] text-[var(--text-muted)]">
      Loading map...
    </div>
  ),
});

type BusinessProfile = {
  slug: string;
  qrCode: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  category: BusinessCategory;
  establishedYear?: number | null;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  coverImageUrl?: string | null;
  logoUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  nearbyLandmarks?: string | null;
  trustScore: number;
  emergencyTrustScore: number;
  avgRating: number;
  languages: string[];
  amenities: string[];
  certifications: string[];
  awards: string[];
  usps: string[];
  businessHours: Record<string, string> | null;
  city?: { name: string; slug: string } | null;
  badges: { badgeType: BadgeType }[];
  services: {
    id: string;
    name: string;
    description?: string | null;
    priceMin?: number | null;
    priceMax?: number | null;
    currency: string;
    includes: string[];
    excludes: string[];
    hiddenFeeWarning?: string | null;
    fairPriceNote?: string | null;
  }[];
  packages: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    duration?: string | null;
    includes: string[];
    excludes: string[];
  }[];
  offers: {
    id: string;
    title: string;
    code?: string | null;
    description?: string | null;
    discountPct?: number | null;
    discountAmount?: number | null;
  }[];
  events: {
    id: string;
    title: string;
    description?: string | null;
    startsAt: string;
    location?: string | null;
    ticketPrice?: number | null;
    ticketUrl?: string | null;
  }[];
  blogPosts: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    publishedAt?: string | null;
  }[];
  reviews: {
    id: string;
    overallRating: number;
    text?: string | null;
    authorName?: string | null;
    nationality?: string | null;
    businessReply?: string | null;
    createdAt: string;
  }[];
  reports: {
    id: string;
    reportType: string;
    title?: string | null;
    description: string;
    businessReply?: string | null;
    createdAt: string;
  }[];
  qas: {
    id: string;
    question: string;
    askerName?: string | null;
    answer?: string | null;
  }[];
  media: {
    id: string;
    album: string;
    url: string;
    caption?: string | null;
    isVideo: boolean;
  }[];
};

const TABS = ["Overview", "Services", "Reviews", "Q&A", "Events", "Blog"] as const;

function trackClick(slug: string, eventType: "PHONE_CLICK" | "WHATSAPP_CLICK" | "DIRECTION_CLICK") {
  fetch(`/api/businesses/${slug}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType }),
  }).catch(() => {});
}

export default function BusinessProfileView({ business }: { business: BusinessProfile }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [benchmark, setBenchmark] = useState<{
    summary: { fair: number; aboveMarket: number };
    flagged: { serviceName: string; deviationPct: number | null }[];
  } | null>(null);

  useEffect(() => {
    fetch(`/api/businesses/${business.slug}/benchmark`)
      .then((r) => r.json())
      .then(setBenchmark)
      .catch(() => {});
  }, [business.slug]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-card)]">
        <div className="relative h-48 md:h-64">
          {business.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.coverImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--gold-muted)] to-transparent text-7xl opacity-30">
              {categoryIcon(business.category)}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-start gap-4">
            {business.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logoUrl}
                alt=""
                className="-mt-14 h-20 w-20 rounded-2xl border-4 border-[var(--bg-card)] object-cover shadow-lg"
              />
            ) : (
              <span className="-mt-14 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[var(--bg-card)] bg-white/10 text-4xl shadow-lg">
                {categoryIcon(business.category)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--gold)]">
                {categoryLabel(business.category)}
                {business.city ? ` · ${business.city.name}` : ""}
              </p>
              <h1 className="font-display text-3xl font-bold md:text-4xl">{business.name}</h1>
              {business.tagline && (
                <p className="mt-1 text-[15px] text-[var(--text-mid)]">{business.tagline}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-[13px]">
            <span className="font-semibold text-[var(--gold)]">
              ★ {business.avgRating || "—"} avg rating
            </span>
            <span className="text-[var(--teal)]">Trust Score {business.trustScore}%</span>
            <span className="text-[var(--text-muted)]">
              Safety Score {business.emergencyTrustScore}%
            </span>
            {business.establishedYear && (
              <span className="text-[var(--text-muted)]">Est. {business.establishedYear}</span>
            )}
          </div>

          <div className="mt-4">
            <BusinessBadges badges={business.badges} size="md" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                onClick={() => trackClick(business.slug, "PHONE_CLICK")}
                className="rounded-xl bg-white/5 px-4 py-2 text-[13px] font-medium hover:bg-white/10"
              >
                📞 Call
              </a>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick(business.slug, "WHATSAPP_CLICK")}
                className="rounded-xl bg-[#25D366]/20 px-4 py-2 text-[13px] font-medium text-[#25D366]"
              >
                WhatsApp
              </a>
            )}
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 px-4 py-2 text-[13px] font-medium hover:bg-white/5"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/8 bg-[var(--bg-card)] p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-lg px-4 py-2 text-[13px] font-medium transition ${
              tab === t
                ? "bg-[var(--gold-muted)] text-[var(--gold)]"
                : "text-[var(--text-muted)] hover:bg-white/5"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {tab === "Overview" && (
            <>
              {business.description && (
                <section className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
                  <h2 className="font-display text-xl font-semibold">About</h2>
                  <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-mid)]">
                    {business.description}
                  </p>
                </section>
              )}

              {business.usps.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
                  <h2 className="font-display text-xl font-semibold">Why choose us</h2>
                  <ul className="mt-3 space-y-2">
                    {business.usps.map((u) => (
                      <li key={u} className="flex items-start gap-2 text-[14px] text-[var(--text-mid)]">
                        <span className="text-[var(--gold)]">✓</span> {u}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {business.amenities.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
                  <h2 className="font-display text-xl font-semibold">Amenities & facilities</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {business.amenities.map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {business.media.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
                  <h2 className="font-display text-xl font-semibold">Gallery</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {business.media.slice(0, 12).map((m) => (
                      <div key={m.id} className="overflow-hidden rounded-xl border border-white/8">
                        {m.isVideo ? (
                          <a href={m.url} target="_blank" rel="noopener noreferrer" className="block p-8 text-center text-[var(--gold)]">
                            ▶ Video
                          </a>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.url} alt={m.caption ?? ""} className="aspect-square w-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {business.lat != null && business.lng != null && (
                <section>
                  <h2 className="mb-3 font-display text-xl font-semibold">Location</h2>
                  {business.address && (
                    <p className="mb-2 text-[14px] text-[var(--text-muted)]">{business.address}</p>
                  )}
                  {business.nearbyLandmarks && (
                    <p className="mb-3 text-[13px] text-[var(--text-muted)]">
                      Near: {business.nearbyLandmarks}
                    </p>
                  )}
                  <BusinessMiniMap
                    lat={business.lat}
                    lng={business.lng}
                    name={business.name}
                    address={business.address}
                  />
                </section>
              )}
            </>
          )}

          {tab === "Services" && (
            <div className="space-y-4">
              {benchmark && benchmark.summary.aboveMarket > 0 && (
                <div className="rounded-2xl border border-[var(--red)]/30 bg-[var(--red-muted)] p-4">
                  <p className="font-semibold text-[var(--red)]">Fair price alert</p>
                  <p className="mt-1 text-[13px]">
                    {benchmark.summary.aboveMarket} service(s) priced above local market averages.
                  </p>
                  {benchmark.flagged.map((f) => (
                    <p key={f.serviceName} className="mt-1 text-[12px]">
                      {f.serviceName}: +{f.deviationPct ?? "?"}% vs market
                    </p>
                  ))}
                </div>
              )}
              {benchmark && benchmark.summary.fair > 0 && benchmark.summary.aboveMarket === 0 && (
                <p className="rounded-xl bg-[var(--teal)]/15 p-3 text-[13px] text-[var(--teal)]">
                  ✓ Prices align with TrueRoute fair market data
                </p>
              )}
              {business.services.map((s) => (
                <div key={s.id} className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-[var(--teal)]">{s.name}</h3>
                    {(s.priceMin != null || s.priceMax != null) && (
                      <p className="font-display text-lg font-bold text-[var(--gold)]">
                        {s.currency} {s.priceMin}
                        {s.priceMax && s.priceMax !== s.priceMin ? `–${s.priceMax}` : ""}
                      </p>
                    )}
                  </div>
                  {s.description && (
                    <p className="mt-2 text-[14px] text-[var(--text-muted)]">{s.description}</p>
                  )}
                  {s.includes.length > 0 && (
                    <p className="mt-2 text-[13px] text-green-400/80">
                      ✓ Included: {s.includes.join(", ")}
                    </p>
                  )}
                  {s.excludes.length > 0 && (
                    <p className="mt-1 text-[13px] text-[var(--text-muted)]">
                      ✗ Not included: {s.excludes.join(", ")}
                    </p>
                  )}
                  {s.hiddenFeeWarning && (
                    <p className="mt-2 rounded-lg bg-[var(--red-muted)] p-2 text-[12px] text-[var(--red)]">
                      ⚠️ {s.hiddenFeeWarning}
                    </p>
                  )}
                  {s.fairPriceNote && (
                    <p className="mt-2 rounded-lg bg-[var(--gold-muted)] p-2 text-[12px] text-[var(--gold)]">
                      💡 Fair price: {s.fairPriceNote}
                    </p>
                  )}
                </div>
              ))}

              {business.packages.map((p) => (
                <div key={p.id} className="rounded-2xl border border-[var(--gold)]/20 bg-[var(--bg-card)] p-5">
                  <div className="flex justify-between gap-2">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="font-display text-xl font-bold text-[var(--gold)]">
                      {p.currency} {p.price}
                    </p>
                  </div>
                  {p.duration && (
                    <p className="text-[12px] text-[var(--text-muted)]">{p.duration}</p>
                  )}
                  {p.description && (
                    <p className="mt-2 text-[14px] text-[var(--text-muted)]">{p.description}</p>
                  )}
                </div>
              ))}

              {business.offers.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
                  <h3 className="font-semibold text-[var(--gold)]">Active offers</h3>
                  <div className="mt-3 space-y-2">
                    {business.offers.map((o) => (
                      <div key={o.id} className="rounded-xl border border-white/8 p-3">
                        <p className="font-medium">{o.title}</p>
                        {o.code && (
                          <p className="text-[12px] text-[var(--teal)]">Code: {o.code}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {business.services.length === 0 && business.packages.length === 0 && (
                <p className="text-[var(--text-muted)]">No services listed yet.</p>
              )}
            </div>
          )}

          {tab === "Reviews" && (
            <div className="space-y-6">
              {business.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--gold)]">{"★".repeat(r.overallRating)}</span>
                    <span className="text-[13px] text-[var(--text-muted)]">
                      {r.authorName ?? "Traveler"}
                      {r.nationality ? ` · ${r.nationality}` : ""}
                    </span>
                  </div>
                  {r.text && <p className="mt-2 text-[14px] text-[var(--text-mid)]">{r.text}</p>}
                  {r.businessReply && (
                    <div className="mt-3 rounded-xl bg-white/5 p-3 text-[13px]">
                      <p className="font-semibold text-[var(--teal)]">Business reply</p>
                      <p className="mt-1 text-[var(--text-muted)]">{r.businessReply}</p>
                    </div>
                  )}
                </div>
              ))}
              <ReviewForm slug={business.slug} />
              <ReportForm slug={business.slug} />

              {business.reports.length > 0 && (
                <section className="rounded-2xl border border-[var(--red)]/20 bg-[var(--bg-card)] p-5">
                  <h3 className="font-semibold text-[var(--red)]">Verified reports</h3>
                  <p className="mt-1 text-[12px] text-[var(--text-muted)]">
                    Transparency layer — verified traveler reports
                  </p>
                  {business.reports.map((rep) => (
                    <div key={rep.id} className="mt-3 rounded-xl border border-white/8 p-3">
                      <p className="text-[12px] font-semibold uppercase text-[var(--red)]">
                        {rep.reportType.replace(/_/g, " ")}
                      </p>
                      <p className="mt-1 text-[13px]">{rep.description}</p>
                      {rep.businessReply && (
                        <p className="mt-2 text-[12px] text-[var(--teal)]">
                          Reply: {rep.businessReply}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </div>
          )}

          {tab === "Q&A" && (
            <div className="space-y-4">
              {business.qas.map((qa) => (
                <div key={qa.id} className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
                  <p className="font-medium">Q: {qa.question}</p>
                  {qa.answer ? (
                    <p className="mt-2 text-[14px] text-[var(--text-mid)]">A: {qa.answer}</p>
                  ) : (
                    <p className="mt-2 text-[13px] italic text-[var(--text-muted)]">
                      Awaiting business response
                    </p>
                  )}
                </div>
              ))}
              <QnAAskForm slug={business.slug} />
            </div>
          )}

          {tab === "Events" && (
            <div className="space-y-4">
              {business.events.length === 0 ? (
                <p className="text-[var(--text-muted)]">No upcoming events.</p>
              ) : (
                business.events.map((ev) => (
                  <div key={ev.id} className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
                    <h3 className="font-semibold">{ev.title}</h3>
                    <p className="mt-1 text-[13px] text-[var(--gold)]">
                      {new Date(ev.startsAt).toLocaleString()}
                    </p>
                    {ev.location && (
                      <p className="text-[13px] text-[var(--text-muted)]">{ev.location}</p>
                    )}
                    {ev.ticketUrl && (
                      <a
                        href={ev.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-[13px] text-[var(--teal)] hover:underline"
                      >
                        Register / Tickets →
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "Blog" && (
            <div className="space-y-4">
              {business.blogPosts.length === 0 ? (
                <p className="text-[var(--text-muted)]">No blog posts yet.</p>
              ) : (
                business.blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5"
                  >
                    <h3 className="font-semibold">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mt-2 text-[14px] text-[var(--text-muted)]">{post.excerpt}</p>
                    )}
                  </article>
                ))
              )}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <InquiryForm slug={business.slug} />
          <QrCodeDisplay qrCode={business.qrCode} businessName={business.name} />

          {business.businessHours && (
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
              <h3 className="font-semibold">Business hours</h3>
              <dl className="mt-3 space-y-1 text-[13px]">
                {Object.entries(business.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between gap-2">
                    <dt className="text-[var(--text-muted)]">{day}</dt>
                    <dd>{hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {business.languages.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
              <h3 className="font-semibold">Languages</h3>
              <p className="mt-2 text-[13px] text-[var(--text-muted)]">
                {business.languages.join(", ")}
              </p>
            </div>
          )}

          {business.certifications.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
              <h3 className="font-semibold">Certifications</h3>
              <ul className="mt-2 space-y-1 text-[13px] text-[var(--text-muted)]">
                {business.certifications.map((c) => (
                  <li key={c}>🏅 {c}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function QnAAskForm({ slug }: { slug: string }) {
  const [question, setQuestion] = useState("");
  const [askerName, setAskerName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await fetch(`/api/businesses/${slug}/qa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, askerName }),
    });
    setStatus("done");
    setQuestion("");
  };

  if (status === "done") {
    return <p className="text-[13px] text-[var(--teal)]">Question submitted!</p>;
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
      <h3 className="font-semibold">Ask a question</h3>
      <textarea
        required
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask the business anything..."
        rows={2}
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[14px]"
      />
      <input
        value={askerName}
        onChange={(e) => setAskerName(e.target.value)}
        placeholder="Your name (optional)"
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px]"
      />
      <button
        type="submit"
        className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-[13px] font-medium hover:bg-white/15"
      >
        Submit question
      </button>
    </form>
  );
}
