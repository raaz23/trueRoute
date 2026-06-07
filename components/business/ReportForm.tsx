"use client";

import { useState } from "react";

const REPORT_TYPES = [
  { value: "OVERCHARGING", label: "Overcharging" },
  { value: "SCAM", label: "Scam" },
  { value: "MISLEADING_AD", label: "Misleading advertising" },
  { value: "HIDDEN_FEES", label: "Hidden fees" },
  { value: "POOR_SERVICE", label: "Poor service" },
  { value: "SAFETY", label: "Safety concern" },
] as const;

export default function ReportForm({ slug }: { slug: string }) {
  const [reportType, setReportType] = useState("OVERCHARGING");
  const [description, setDescription] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`/api/businesses/${slug}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType,
          description,
          amountPaid: amountPaid ? Number(amountPaid) : undefined,
          expectedPrice: expectedPrice ? Number(expectedPrice) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="rounded-xl bg-[var(--red-muted)] p-4 text-[14px] text-[var(--red)]">
        Report submitted. TrueRoute will investigate and hold businesses accountable.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-[var(--red)]/20 bg-[var(--bg-card)] p-5">
      <h3 className="font-display text-lg font-semibold text-[var(--red)]">
        Report a problem
      </h3>
      <p className="text-[13px] text-[var(--text-muted)]">
        Truth & transparency — help protect other travelers from scams and unfair practices.
      </p>

      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
      >
        {REPORT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        minLength={10}
        placeholder="Describe what happened in detail..."
        rows={4}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px]"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          placeholder="Amount paid (NPR)"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
        />
        <input
          type="number"
          value={expectedPrice}
          onChange={(e) => setExpectedPrice(e.target.value)}
          placeholder="Expected fair price (NPR)"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl border border-[var(--red)]/40 bg-[var(--red-muted)] px-6 py-2.5 text-[14px] font-semibold text-[var(--red)] disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Submit report"}
      </button>
    </form>
  );
}
