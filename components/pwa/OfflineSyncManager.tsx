"use client";

import { useEffect } from "react";
import { flushAllOfflineQueues } from "@/lib/offline/sync";
import { isAppOnline, watchConnectivity } from "@/lib/network/connectivity";

/** When app is online (server reachable), upload queued offline actions. */
export default function OfflineSyncManager() {
  useEffect(() => {
    const syncQueues = () => {
      void isAppOnline().then((ok) => {
        if (ok) flushAllOfflineQueues().catch(() => {});
      });
    };

    syncQueues();
    return watchConnectivity((appOnline) => {
      if (appOnline) flushAllOfflineQueues().catch(() => {});
    });
  }, []);

  return null;
}
