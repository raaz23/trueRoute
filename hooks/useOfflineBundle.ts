"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OfflineBundle } from "@/lib/offline/types";
import { getOfflineBundle } from "@/lib/offline/db";
import { getLastSyncAt } from "@/lib/offline/local";
import { syncOfflineBundle } from "@/lib/offline/sync";
import { isAppOnline, watchConnectivity } from "@/lib/network/connectivity";

/**
 * `online` = app can reach TrueRoute server (Wi‑Fi or mobile data — does not matter).
 * NOT the same as “Wi‑Fi connected” on the phone.
 */
export function useOfflineBundle() {
  const [bundle, setBundle] = useState<OfflineBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [online, setOnline] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setAppOnline = useCallback((reachable: boolean) => {
    setOnline(reachable);
  }, []);

  const recheckConnection = useCallback(async () => {
    const reachable = await isAppOnline();
    setOnline(reachable);
    return reachable;
  }, []);

  const refresh = useCallback(
    async (forceNetwork = false) => {
      setSyncing(true);
      setError(null);

      const reachable = await isAppOnline();
      setOnline(reachable);

      if (!reachable && !forceNetwork) {
        setSyncing(false);
        const cached = await getOfflineBundle();
        if (cached) {
          setBundle(cached);
          setLastSync(cached.syncedAt);
        }
        setLoading(false);
        return;
      }

      const result = await syncOfflineBundle(true);
      setSyncing(false);
      if (result.ok) {
        setBundle(result.bundle);
        setLastSync(result.bundle.syncedAt);
        setOnline(true);
      } else {
        setError(result.error);
        const cached = await getOfflineBundle();
        if (cached) setBundle(cached);
        const ok = await isAppOnline();
        setOnline(ok);
      }
      setLoading(false);
    },
    []
  );

  const wasAppOnline = useRef(false);

  useEffect(() => {
    setLastSync(getLastSyncAt());

    const unwatch = watchConnectivity((appOnline) => {
      setAppOnline(appOnline);
      if (appOnline && !wasAppOnline.current) void refresh(true);
      wasAppOnline.current = appOnline;
    });

    void (async () => {
      const cached = await getOfflineBundle();
      if (cached) {
        setBundle(cached);
        setLastSync(cached.syncedAt);
      }
      const reachable = await isAppOnline();
      setOnline(reachable);
      setLoading(false);
      if (reachable) await refresh(true);
    })();

    return unwatch;
  }, [refresh, setAppOnline]);

  return {
    bundle,
    loading,
    syncing,
    /** App online = server reachable (Wi‑Fi or mobile, either is fine). */
    online,
    isAppOnline: online,
    lastSync,
    error,
    refresh,
    recheckConnection,
    hasOfflineData: Boolean(bundle),
  };
}
