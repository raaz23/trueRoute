/**
 * App online rules (do not confuse with phone settings):
 *
 *   Wi‑Fi ON  + server reachable     → APP ONLINE
 *   Mobile ON + server reachable     → APP ONLINE
 *   Wi‑Fi ON  + server NOT reachable → NOT app online (offline pack)
 *   Mobile ON + server NOT reachable → NOT app online
 *
 * Wi‑Fi on ≠ app online. Mobile data on ≠ app online.
 * Only a successful ping to our server means app online.
 */

const PROBE_URL = "/api/health";
const PROBE_TIMEOUT_MS = 8000;

export async function isAppOnline(): Promise<boolean> {
  if (typeof window === "undefined") return true;

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

    const res = await fetch(`${PROBE_URL}?t=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    });

    window.clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

/** @deprecated Use isAppOnline */
export const probeServerReachable = isAppOnline;

/** Browser thinks there is a network interface — NOT used for “app online”. */
export function isNetworkInterfaceUp(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

export function watchConnectivity(onChange: (appOnline: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  let busy = false;
  const run = () => {
    if (busy) return;
    busy = true;
    void isAppOnline().then((ok) => {
      busy = false;
      onChange(ok);
    });
  };

  const onInterfaceEvent = () => run();
  window.addEventListener("online", onInterfaceEvent);
  window.addEventListener("offline", onInterfaceEvent);

  const conn = (
    navigator as Navigator & { connection?: { addEventListener?: (t: string, h: () => void) => void } }
  ).connection;
  conn?.addEventListener?.("change", onInterfaceEvent);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") run();
  });

  const interval = window.setInterval(() => {
    if (document.visibilityState === "visible") run();
  }, 25000);

  run();

  return () => {
    window.removeEventListener("online", onInterfaceEvent);
    window.removeEventListener("offline", onInterfaceEvent);
    window.clearInterval(interval);
  };
}
