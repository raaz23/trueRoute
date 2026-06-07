"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  reportType: string;
  title?: string | null;
  description: string;
  amountPaid?: number | null;
  expectedPrice?: number | null;
  createdAt: string;
  business: { name: string; slug: string };
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const load = () =>
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then(setReports);

  useEffect(() => {
    load();
  }, []);

  const action = async (id: string, act: "verify" | "resolve" | "dismiss") => {
    await fetch("/api/admin/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: act }),
    });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Scam & transparency reports</h1>
      <p className="mt-2 text-[14px] text-[var(--text-muted)]">
        Verify reports to update trust scores and open complaint cases.
      </p>
      <div className="mt-6 space-y-4">
        {reports.length === 0 ? (
          <p className="text-[var(--text-muted)]">No pending reports.</p>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="rounded-xl border border-[var(--red)]/20 bg-[var(--bg-card)] p-4">
              <p className="text-[12px] font-bold uppercase text-[var(--red)]">
                {r.reportType.replace(/_/g, " ")}
              </p>
              <p className="font-semibold">{r.business.name}</p>
              <p className="mt-2 text-[14px]">{r.description}</p>
              {(r.amountPaid != null || r.expectedPrice != null) && (
                <p className="mt-2 text-[13px] text-[var(--gold)]">
                  Paid NPR {r.amountPaid ?? "?"} · Expected NPR {r.expectedPrice ?? "?"}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => action(r.id, "verify")}
                  className="rounded-lg bg-[var(--red)] px-4 py-2 text-[12px] font-semibold text-white"
                >
                  Verify & open case
                </button>
                <button
                  type="button"
                  onClick={() => action(r.id, "resolve")}
                  className="rounded-lg bg-[var(--teal)] px-4 py-2 text-[12px] font-semibold text-white"
                >
                  Resolve
                </button>
                <button
                  type="button"
                  onClick={() => action(r.id, "dismiss")}
                  className="rounded-lg border border-white/10 px-4 py-2 text-[12px]"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
