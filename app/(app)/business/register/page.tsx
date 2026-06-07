"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BUSINESS_CATEGORIES } from "@/lib/business/constants";

type City = { id: string; name: string; slug: string };

export default function BusinessRegisterPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    accountType: "BUSINESS",
    category: "HOTEL",
    name: "",
    tagline: "",
    description: "",
    email: "",
    phone: "",
    whatsapp: "",
    website: "",
    cityId: "",
    address: "",
    ownerEmail: "",
    ownerName: "",
  });

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then(setCities)
      .catch(() => {});
  }, []);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/businesses/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: form.website || undefined,
          cityId: form.cityId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Registration failed");
    }
  };

  if (status === "done") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--teal)]/30 bg-[var(--bg-card)] p-8 text-center">
        <p className="text-4xl">✅</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Registration submitted!</h1>
        <p className="mt-2 text-[15px] text-[var(--text-muted)]">
          TrueRoute will review your business. Once approved, your public profile and QR code
          will go live.
        </p>
        <Link href="/business/dashboard" className="mt-6 inline-block text-[var(--gold)] hover:underline">
          Go to dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/business" className="text-[13px] text-[var(--gold)] hover:underline">
          ← Marketplace
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold">Register your business</h1>
        <p className="mt-2 text-[15px] text-[var(--text-muted)]">
          Join Nepal&apos;s trusted tourism marketplace. Free basic profile — premium plans
          available after approval.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[12px] font-medium text-[var(--text-muted)]">Account type</label>
            <select
              value={form.accountType}
              onChange={(e) => update("accountType", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
            >
              <option value="BUSINESS">Business</option>
              <option value="ORGANIZATION">Organization / NGO</option>
              <option value="GOVERNMENT">Government Entity</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[var(--text-muted)]">Category</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
            >
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Business name *"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
        />
        <input
          value={form.tagline}
          onChange={(e) => update("tagline", e.target.value)}
          placeholder="Short tagline"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
        />
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Description"
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px]"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Business email *"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
          />
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Phone"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="WhatsApp number"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
          />
          <input
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="Website URL"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
          />
        </div>

        <select
          value={form.cityId}
          onChange={(e) => update("cityId", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
        >
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Address"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
        />

        <div className="border-t border-white/8 pt-4">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Owner account
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <input
              type="email"
              value={form.ownerEmail}
              onChange={(e) => update("ownerEmail", e.target.value)}
              placeholder="Owner email (for dashboard)"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
            />
            <input
              value={form.ownerName}
              onChange={(e) => update("ownerName", e.target.value)}
              placeholder="Owner name"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] py-3 text-[15px] font-semibold text-white disabled:opacity-50"
        >
          {status === "loading" ? "Submitting..." : "Submit for approval"}
        </button>

        {status === "error" && (
          <p className="text-center text-[13px] text-[var(--red)]">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}
