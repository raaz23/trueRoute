"use client";

import { useEffect, useRef, useState } from "react";
import { flushAllOfflineQueues } from "@/lib/offline/sync";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";

/**
 * When SIM/WiFi returns: refresh travel pack (prices, places, danger zones, weather)
 * and upload anything queued while offline.
 */
export default function BackOnlineSync() {
  const { refresh, online, syncing } = useOfflineBundle();
  const wasOffline = useRef(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return;
    }

    if (!wasOffline.current) return;
    wasOffline.current = false;

    setNotice("Back online — syncing latest prices, weather & safety data…");

    void (async () => {
      await flushAllOfflineQueues();
      await refresh(true);
      setNotice("Updated — live weather, danger alerts & map tiles active.");
      window.setTimeout(() => setNotice(null), 6000);
    })();
  }, [online, refresh]);

  if (!notice) return null;

  return (
    <div
      role="status"
      className="fixed bottom-24 left-4 right-4 z-[95] mx-auto max-w-md rounded-xl border border-[var(--teal)]/40 bg-[#0C1528]/98 px-4 py-3 text-center shadow-lg backdrop-blur-md md:bottom-6"
    >
      <p className="text-[13px] font-semibold text-[var(--teal)]">
        {syncing ? "⟳ " : "✓ "}
        {notice}
      </p>
    </div>
  );
}
