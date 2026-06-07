"use client";

import { useEffect, useState } from "react";

type Doc = {
  id: string;
  docType: string;
  fileUrl: string;
  fileName?: string | null;
  createdAt: string;
  business: { name: string; slug: string; city?: { name: string } | null };
};

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);

  const load = () =>
    fetch("/api/admin/documents")
      .then((r) => r.json())
      .then(setDocs);

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: "verify" | "reject") => {
    await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">KYC document verification</h1>
      <p className="mt-2 text-[14px] text-[var(--text-muted)]">
        Review business licenses and government approvals. Verifying grants badges.
      </p>
      <div className="mt-6 space-y-4">
        {docs.length === 0 ? (
          <p className="text-[var(--text-muted)]">No pending documents.</p>
        ) : (
          docs.map((d) => (
            <div key={d.id} className="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
              <p className="text-[12px] font-bold uppercase text-[var(--gold)]">
                {d.docType.replace(/_/g, " ")}
              </p>
              <p className="font-semibold">{d.business.name}</p>
              <p className="text-[12px] text-[var(--text-muted)]">
                {d.business.city?.name ?? "—"} · {new Date(d.createdAt).toLocaleString()}
              </p>
              <a
                href={d.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[13px] text-[var(--teal)] hover:underline"
              >
                View document ↗
              </a>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => act(d.id, "verify")}
                  className="rounded-lg bg-[var(--teal)] px-4 py-2 text-[12px] font-semibold text-white"
                >
                  Verify & grant badge
                </button>
                <button
                  type="button"
                  onClick={() => act(d.id, "reject")}
                  className="rounded-lg border border-[var(--red)]/40 px-4 py-2 text-[12px] text-[var(--red)]"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
