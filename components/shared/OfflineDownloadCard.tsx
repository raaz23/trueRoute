"use client";

import { useOfflineBundle } from "@/hooks/useOfflineBundle";
import { flushAllOfflineQueues } from "@/lib/offline/sync";
import { getPendingSubmissions } from "@/lib/offline/local";
import { useState } from "react";

export default function OfflineDownloadCard() {
  const { bundle, syncing, online, lastSync, refresh, hasOfflineData } = useOfflineBundle();
  const [flushing, setFlushing] = useState(false);
  const pending = getPendingSubmissions().length;

  const download = () => refresh(true);

  const syncQueue = async () => {
    setFlushing(true);
    const r = await flushAllOfflineQueues();
    const sent = r.submissions;
    setFlushing(false);
    alert(sent > 0 ? `Sent ${sent} queued price submission(s).` : "No pending submissions to send.");
  };

  return (
    <div className="rounded-2xl border border-[var(--teal)]/30 bg-[var(--teal-muted)] p-6">
      <h2 className="font-display text-xl font-bold text-[var(--teal)]">Offline travel pack</h2>
      <p className="mt-2 text-[14px] text-[var(--text-mid)]">
        Download fair prices, places, emergency numbers & phrases to your phone. Works without
        internet in mountains and remote streets.
      </p>

      <div className="mt-4 grid gap-2 text-[13px] text-[var(--text-muted)]">
        <p>
          Status:{" "}
          <strong className={hasOfflineData ? "text-[var(--teal)]" : "text-[var(--red)]"}>
            {hasOfflineData ? "Ready offline" : "Not downloaded"}
          </strong>
        </p>
        {lastSync && (
          <p>Last sync: {new Date(lastSync).toLocaleString()}</p>
        )}
        {bundle && (
          <p>
            Pack: {bundle.prices.length} prices · {bundle.places.length} places ·{" "}
            {bundle.phrases.length} phrases
          </p>
        )}
        {pending > 0 && (
          <p className="text-[var(--gold)]">{pending} price submission(s) waiting to upload</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={download}
          disabled={syncing || !online}
          className="rounded-xl bg-[var(--teal)] px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50"
        >
          {syncing ? "Downloading…" : hasOfflineData ? "Update offline pack" : "Download for offline"}
        </button>
        {pending > 0 && online && (
          <button
            type="button"
            onClick={syncQueue}
            disabled={flushing}
            className="rounded-xl border border-white/15 px-4 py-2.5 text-[13px] font-semibold"
          >
            {flushing ? "Sending…" : "Upload queued submissions"}
          </button>
        )}
      </div>

      {!online && (
        <p className="mt-3 text-[12px] text-[var(--gold)]">
          You are offline — cached data is active. Reconnect to update the pack.
        </p>
      )}
    </div>
  );
}
