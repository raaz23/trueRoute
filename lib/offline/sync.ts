import type { OfflineBundle } from "./types";
import { saveOfflineBundle } from "./db";
import {
  clearActivityQueue,
  clearGpsQueue,
  clearTranslateQueue,
  clearWaitlistQueue,
  getActivityQueue,
  getGpsQueue,
  getPendingSubmissions,
  getSessionId,
  getTranslateQueue,
  getWaitlistQueue,
  removePendingSubmission,
  setLastSyncAt,
} from "./local";

export type SyncResult =
  | { ok: true; bundle: OfflineBundle; fromCache: false }
  | { ok: true; bundle: OfflineBundle; fromCache: true }
  | { ok: false; error: string };

export async function syncOfflineBundle(forceNetwork = true): Promise<SyncResult> {
  const { getOfflineBundle } = await import("./db");

  if (!forceNetwork && typeof window !== "undefined") {
    const { isAppOnline } = await import("@/lib/network/connectivity");
    if (!(await isAppOnline())) {
      const cached = await getOfflineBundle();
      if (cached) return { ok: true, bundle: cached, fromCache: true };
      return { ok: false, error: "No offline data. Connect once to download." };
    }
  }

  try {
    const res = await fetch("/api/offline-bundle", { cache: "no-store" });
    if (!res.ok) throw new Error(`Sync failed (${res.status})`);
    const bundle = (await res.json()) as OfflineBundle;
    await saveOfflineBundle(bundle);
    setLastSyncAt(bundle.syncedAt);
    return { ok: true, bundle, fromCache: false };
  } catch (e) {
    const cached = await getOfflineBundle();
    if (cached) return { ok: true, bundle: cached, fromCache: true };
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not sync offline data",
    };
  }
}

/** Flush all offline queues when back online */
export async function flushAllOfflineQueues(): Promise<{
  submissions: number;
  gps: number;
  waitlist: number;
}> {
  const sessionId = getSessionId();
  let submissions = 0;
  let gps = 0;
  let waitlist = 0;

  for (const sub of getPendingSubmissions()) {
    try {
      const res = await fetch("/api/prices/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify(sub),
      });
      if (res.ok) {
        removePendingSubmission(sub.id);
        submissions++;
      }
    } catch {
      /* keep */
    }
  }

  const gpsBatch = getGpsQueue();
  if (gpsBatch.length) {
    try {
      const res = await fetch("/api/gps/track", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ points: gpsBatch }),
      });
      if (res.ok) {
        clearGpsQueue();
        gps = gpsBatch.length;
      }
    } catch {
      /* keep */
    }
  }

  for (const email of getWaitlistQueue()) {
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) waitlist++;
    } catch {
      /* keep */
    }
  }
  if (waitlist > 0) clearWaitlistQueue();

  for (const act of getActivityQueue()) {
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify(act),
      });
    } catch {
      /* ignore */
    }
  }
  clearActivityQueue();

  for (const t of getTranslateQueue()) {
    try {
      await fetch("/api/translate/log", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify(t),
      });
    } catch {
      /* ignore */
    }
  }
  clearTranslateQueue();

  return { submissions, gps, waitlist };
}

export async function flushPendingSubmissions(): Promise<number> {
  const r = await flushAllOfflineQueues();
  return r.submissions;
}
