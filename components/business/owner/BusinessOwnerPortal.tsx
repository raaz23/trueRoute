"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import FileUploader from "@/components/business/owner/FileUploader";
import QrCodeDisplay from "@/components/business/QrCodeDisplay";
import { categoryLabel } from "@/lib/business/constants";

type Tab = "profile" | "media" | "services" | "branches" | "blog" | "events" | "documents" | "inbox";

type BusinessData = {
  id: string;
  slug: string;
  qrCode: string;
  name: string;
  status: string;
  category: string;
  tagline?: string | null;
  description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  address?: string | null;
  coverImageUrl?: string | null;
  logoUrl?: string | null;
  services?: ServiceRow[];
  packages?: unknown[];
  offers?: unknown[];
  qas?: QaRow[];
  inquiries?: InquiryRow[];
  media?: MediaRow[];
  branches?: BranchRow[];
};

type ServiceRow = {
  id: string;
  name: string;
  description?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  fairPriceNote?: string | null;
  published: boolean;
};

type MediaRow = { id: string; url: string; album: string; caption?: string | null };
type BranchRow = { id: string; name: string; address?: string | null; isPrimary: boolean };
type BlogRow = { id: string; title: string; published: boolean; slug: string };
type EventRow = { id: string; title: string; startsAt: string; published: boolean };
type DocRow = { id: string; docType: string; fileName?: string | null; verified: boolean };
type QaRow = { id: string; question: string; answer?: string | null };
type InquiryRow = { id: string; name: string; message: string; createdAt: string };

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "media", label: "Media" },
  { id: "services", label: "Services" },
  { id: "branches", label: "Branches" },
  { id: "blog", label: "Blog" },
  { id: "events", label: "Events" },
  { id: "documents", label: "KYC Docs" },
  { id: "inbox", label: "Inbox" },
];

export default function BusinessOwnerPortal({
  slug,
  ownerEmail,
  businessName,
  status,
}: {
  slug: string;
  ownerEmail: string;
  businessName: string;
  status: string;
}) {
  const [tab, setTab] = useState<Tab>("profile");
  const [data, setData] = useState<BusinessData | null>(null);
  const [blog, setBlog] = useState<BlogRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [biz, blogRes, evRes, docRes, mediaRes, branchRes] = await Promise.all([
      fetch(`/api/business/owner/${slug}?email=${encodeURIComponent(ownerEmail)}`).then((r) => r.json()),
      fetch(`/api/business/owner/${slug}/blog?email=${encodeURIComponent(ownerEmail)}`).then((r) => r.json()),
      fetch(`/api/business/owner/${slug}/events?email=${encodeURIComponent(ownerEmail)}`).then((r) => r.json()),
      fetch(`/api/business/owner/${slug}/documents?email=${encodeURIComponent(ownerEmail)}`).then((r) => r.json()),
      fetch(`/api/business/owner/${slug}/media?email=${encodeURIComponent(ownerEmail)}`).then((r) => r.json()),
      fetch(`/api/business/owner/${slug}/branches?email=${encodeURIComponent(ownerEmail)}`).then((r) => r.json()),
    ]);
    setData({ ...biz, media: mediaRes, branches: branchRes });
    setBlog(Array.isArray(blogRes) ? blogRes : []);
    setEvents(Array.isArray(evRes) ? evRes : []);
    setDocs(Array.isArray(docRes) ? docRes : []);
  }, [slug, ownerEmail]);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/business/owner/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerEmail,
        tagline: fd.get("tagline"),
        description: fd.get("description"),
        phone: fd.get("phone"),
        whatsapp: fd.get("whatsapp"),
        website: fd.get("website"),
        address: fd.get("address"),
      }),
    });
    if (res.ok) {
      setMsg("Profile saved");
      load();
    }
  };

  const addService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/business/owner/${slug}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerEmail,
        name: fd.get("name"),
        description: fd.get("description"),
        priceMin: fd.get("priceMin") ? Number(fd.get("priceMin")) : undefined,
        priceMax: fd.get("priceMax") ? Number(fd.get("priceMax")) : undefined,
        fairPriceNote: fd.get("fairPriceNote"),
      }),
    });
    e.currentTarget.reset();
    load();
  };

  const addBranch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/business/owner/${slug}/branches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerEmail,
        name: fd.get("name"),
        address: fd.get("address"),
        phone: fd.get("phone"),
        isPrimary: fd.get("isPrimary") === "on",
      }),
    });
    e.currentTarget.reset();
    load();
  };

  const addBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/business/owner/${slug}/blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerEmail,
        title: fd.get("title"),
        excerpt: fd.get("excerpt"),
        content: fd.get("content"),
        published: fd.get("published") === "on",
        seoTitle: fd.get("seoTitle"),
        seoDescription: fd.get("seoDescription"),
      }),
    });
    e.currentTarget.reset();
    load();
  };

  const addEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/business/owner/${slug}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerEmail,
        title: fd.get("title"),
        description: fd.get("description"),
        startsAt: new Date(String(fd.get("startsAt"))).toISOString(),
        location: fd.get("location"),
        ticketPrice: fd.get("ticketPrice") ? Number(fd.get("ticketPrice")) : undefined,
        ticketUrl: fd.get("ticketUrl"),
      }),
    });
    e.currentTarget.reset();
    load();
  };

  const submitDoc = async (url: string, docType: string, fileName: string) => {
    await fetch(`/api/business/owner/${slug}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerEmail, docType, fileUrl: url, fileName }),
    });
    load();
  };

  const answerQa = async (qaId: string, answer: string) => {
    await fetch(`/api/business/owner/${slug}/qa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerEmail, qaId, answer }),
    });
    load();
  };

  if (!data) return <p className="text-[var(--text-muted)]">Loading editor…</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">{businessName}</h2>
          <p className="text-[12px] text-[var(--text-muted)]">
            {categoryLabel(data.category as never)} · Status: {status}
          </p>
        </div>
        {status === "APPROVED" && (
          <Link href={`/business/${slug}`} className="text-[13px] text-[var(--gold)] hover:underline">
            View public profile →
          </Link>
        )}
      </div>

      {msg && <p className="text-[13px] text-[var(--teal)]">{msg}</p>}

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/8 bg-[var(--bg-card)] p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-lg px-3 py-2 text-[12px] font-medium ${
              tab === t.id ? "bg-[var(--gold-muted)] text-[var(--gold)]" : "text-[var(--text-muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form onSubmit={saveProfile} className="space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
          <input name="tagline" defaultValue={data.tagline ?? ""} placeholder="Tagline" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
          <textarea name="description" defaultValue={data.description ?? ""} rows={4} placeholder="Description" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px]" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="phone" defaultValue={data.phone ?? ""} placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="whatsapp" defaultValue={data.whatsapp ?? ""} placeholder="WhatsApp" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
          </div>
          <input name="website" defaultValue={data.website ?? ""} placeholder="Website" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
          <input name="address" defaultValue={data.address ?? ""} placeholder="Address" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
          <button type="submit" className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[14px] font-semibold text-white">Save profile</button>
        </form>
      )}

      {tab === "media" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
            <h3 className="font-semibold">Cover image</h3>
            <FileUploader slug={slug} ownerEmail={ownerEmail} kind="media" album="COVER" onUploaded={() => load()} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
            <h3 className="font-semibold">Logo</h3>
            <FileUploader slug={slug} ownerEmail={ownerEmail} kind="media" album="LOGO" onUploaded={() => load()} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5 md:col-span-2">
            <h3 className="font-semibold">Gallery</h3>
            <FileUploader slug={slug} ownerEmail={ownerEmail} kind="media" album="INTERIOR" onUploaded={() => load()} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {data.media?.map((m) => (
                <div key={m.id} className="overflow-hidden rounded-lg border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt="" className="aspect-square w-full object-cover" />
                  <p className="p-1 text-[10px] text-[var(--text-muted)]">{m.album}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "services" && (
        <div className="space-y-4">
          <form onSubmit={addService} className="space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
            <h3 className="font-semibold">Add service / pricing</h3>
            <input name="name" required placeholder="Service name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <textarea name="description" rows={2} placeholder="Description" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="priceMin" type="number" placeholder="Min price NPR" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
              <input name="priceMax" type="number" placeholder="Max price NPR" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            </div>
            <input name="fairPriceNote" placeholder="Fair price note for tourists" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <button type="submit" className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[14px] font-semibold text-white">Add service</button>
          </form>
          {data.services?.map((s) => (
            <div key={s.id} className="rounded-xl border border-white/10 p-4">
              <p className="font-medium">{s.name}</p>
              <p className="text-[13px] text-[var(--gold)]">
                NPR {s.priceMin ?? "?"}–{s.priceMax ?? "?"}
              </p>
              {s.fairPriceNote && <p className="text-[12px] text-[var(--teal)]">{s.fairPriceNote}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "branches" && (
        <div className="space-y-4">
          <form onSubmit={addBranch} className="space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
            <h3 className="font-semibold">Add branch location</h3>
            <input name="name" required placeholder="Branch name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="address" placeholder="Address" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="phone" placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <label className="flex items-center gap-2 text-[13px]">
              <input name="isPrimary" type="checkbox" /> Primary location
            </label>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[14px] font-semibold text-white">Add branch</button>
          </form>
          {data.branches?.map((b) => (
            <div key={b.id} className="rounded-xl border border-white/10 p-4">
              <p className="font-medium">{b.name} {b.isPrimary && <span className="text-[var(--gold)]">★ Primary</span>}</p>
              {b.address && <p className="text-[13px] text-[var(--text-muted)]">{b.address}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "blog" && (
        <div className="space-y-4">
          <form onSubmit={addBlog} className="space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
            <h3 className="font-semibold">New blog post</h3>
            <input name="title" required placeholder="Title" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="excerpt" placeholder="Excerpt" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <textarea name="content" required rows={6} placeholder="Content (markdown ok)" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px]" />
            <input name="seoTitle" placeholder="SEO title" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="seoDescription" placeholder="SEO description" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <label className="flex items-center gap-2 text-[13px]">
              <input name="published" type="checkbox" /> Publish immediately
            </label>
            <button type="submit" className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[14px] font-semibold text-white">Create post</button>
          </form>
          {blog.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/10 p-4">
              <p className="font-medium">{p.title}</p>
              <p className="text-[12px] text-[var(--text-muted)]">{p.published ? "Published" : "Draft"}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "events" && (
        <div className="space-y-4">
          <form onSubmit={addEvent} className="space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
            <h3 className="font-semibold">New event</h3>
            <input name="title" required placeholder="Event title" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <textarea name="description" rows={2} placeholder="Description" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="startsAt" type="datetime-local" required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="location" placeholder="Location" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="ticketPrice" type="number" placeholder="Ticket price NPR" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <input name="ticketUrl" placeholder="Registration URL" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
            <button type="submit" className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[14px] font-semibold text-white">Create event</button>
          </form>
          {events.map((ev) => (
            <div key={ev.id} className="rounded-xl border border-white/10 p-4">
              <p className="font-medium">{ev.title}</p>
              <p className="text-[12px] text-[var(--gold)]">{new Date(ev.startsAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "documents" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--bg-card)] p-5">
            <h3 className="font-semibold text-[var(--gold)]">KYC / Verification documents</h3>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">
              Upload business license, government approval, or tax registration for TrueRoute verification.
            </p>
            {(["BUSINESS_LICENSE", "GOVERNMENT_APPROVAL", "TAX_REGISTRATION"] as const).map((docType) => (
              <div key={docType} className="mt-4">
                <p className="mb-2 text-[12px] font-medium">{docType.replace(/_/g, " ")}</p>
                <FileUploader
                  slug={slug}
                  ownerEmail={ownerEmail}
                  kind="document"
                  onUploaded={(url) => submitDoc(url, docType, docType)}
                />
              </div>
            ))}
          </div>
          {docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-white/10 p-4">
              <div>
                <p className="font-medium">{d.docType.replace(/_/g, " ")}</p>
                <p className="text-[12px] text-[var(--text-muted)]">{d.fileName}</p>
              </div>
              <span className={`text-[11px] font-bold uppercase ${d.verified ? "text-[var(--teal)]" : "text-[var(--gold)]"}`}>
                {d.verified ? "Verified" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "inbox" && (
        <div className="space-y-4">
          <section>
            <h3 className="font-semibold">Inquiries & leads</h3>
            {data.inquiries?.length ? data.inquiries.map((inq) => (
              <div key={inq.id} className="mt-2 rounded-xl border border-white/10 p-4">
                <p className="font-medium">{inq.name}</p>
                <p className="text-[13px]">{inq.message}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{new Date(inq.createdAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-[var(--text-muted)]">No inquiries yet.</p>}
          </section>
          <section>
            <h3 className="font-semibold">Q&A</h3>
            {data.qas?.map((qa) => (
              <QaAnswer key={qa.id} qa={qa} onAnswer={(a) => answerQa(qa.id, a)} />
            ))}
          </section>
          {status === "APPROVED" && data.qrCode && (
            <QrCodeDisplay qrCode={data.qrCode} businessName={businessName} />
          )}
        </div>
      )}

    </div>
  );
}

function QaAnswer({ qa, onAnswer }: { qa: QaRow; onAnswer: (a: string) => void }) {
  const [answer, setAnswer] = useState(qa.answer ?? "");
  if (qa.answer) {
    return (
      <div className="mt-2 rounded-xl border border-white/10 p-4">
        <p className="font-medium">Q: {qa.question}</p>
        <p className="mt-1 text-[13px] text-[var(--teal)]">A: {qa.answer}</p>
      </div>
    );
  }
  return (
    <div className="mt-2 rounded-xl border border-white/10 p-4">
      <p className="font-medium">Q: {qa.question}</p>
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]" />
      <button type="button" onClick={() => onAnswer(answer)} className="mt-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[14px] font-semibold text-white">Post answer</button>
    </div>
  );
}
