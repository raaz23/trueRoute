"use client";

import { useOfflineBundle } from "@/hooks/useOfflineBundle";

export default function OfflineBanner() {
  const { online, hasOfflineData, lastSync, syncing, refresh, recheckConnection } =
    useOfflineBundle();

  if (online) return null;

  const retry = async () => {
    const ok = await recheckConnection();
    if (ok) await refresh(true);
  };

  return (
    <div
      role="status"
      className="fixed left-0 right-0 top-0 z-[100] border-b border-[var(--gold)]/30 bg-[#0C1528]/98 px-4 py-2.5 text-center backdrop-blur-md"
    >
      <p className="text-[12px] font-semibold text-[var(--gold)]">
        Offline — can&apos;t reach TrueRoute server
      </p>
      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
        Wi‑Fi or mobile data may be on, but the app needs internet to our server.
        {hasOfflineData
          ? ` Using saved pack${lastSync ? ` from ${new Date(lastSync).toLocaleDateString()}` : ""}.`
          : ""}
      </p>
      {typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1") && (
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Local test: run <code className="text-[var(--teal)]">npm run dev</code> then Retry.
          </p>
        )}
      <button
        type="button"
        onClick={() => void retry()}
        disabled={syncing}
        className="mt-2 rounded-lg bg-[var(--gold-muted)] px-4 py-1.5 text-[12px] font-semibold text-[var(--gold)] disabled:opacity-50"
      >
        {syncing ? "Checking server…" : "Retry connection"}
      </button>
    </div>
  );
}
