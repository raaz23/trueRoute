"use client";

import { useEffect, useRef, useState } from "react";
import { checkDangerZonesNearby } from "@/lib/geo";
import type { OfflineDangerZone } from "@/lib/offline/types";
import {
  getLastDangerAlertId,
  getSessionId,
  queueGpsPoint,
  setLastDangerAlertId,
} from "@/lib/offline/local";
import { useOfflineBundle } from "./useOfflineBundle";
import { sessionHeaders } from "./useSessionId";

type DangerAlert = {
  message: string;
  dangers: { zone_name: string; reason: string; severity: string }[];
};

export function useGPSTracking(enabled = true) {
  const { bundle, online } = useOfflineBundle();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dangerAlert, setDangerAlert] = useState<DangerAlert | null>(null);
  const lastSave = useRef(0);

  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const sessionId = getSessionId();

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        setPosition(pos);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const now = Date.now();

        const localDangers = bundle?.dangerZones?.length
          ? checkDangerZonesNearby(lat, lng, bundle.dangerZones)
          : [];

        if (localDangers.length) {
          const top = localDangers[0];
          const alertId = `${top.id}-${Math.floor(now / 600000)}`;
          if (getLastDangerAlertId() !== alertId) {
            setLastDangerAlertId(alertId);
            const msg = `⚠️ ${top.severity}: ${top.zone_name} — ${top.reason}`;
            setDangerAlert({
              message: msg,
              dangers: localDangers,
            });
            if (Notification.permission === "granted") {
              new Notification("TrueRoute Safety", { body: msg });
            }
          }
        }

        if (now - lastSave.current < 30000) return;
        lastSave.current = now;

        const point = {
          latitude: lat,
          longitude: lng,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed ?? undefined,
        };

        if (online) {
          try {
            await fetch("/api/gps/check-danger", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...sessionHeaders(),
              },
              body: JSON.stringify({
                ...point,
                sessionId,
              }),
            });
          } catch {
            queueGpsPoint(point);
          }
        } else {
          queueGpsPoint(point);
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled, bundle, online]);

  return { position, error, dangerAlert, clearDangerAlert: () => setDangerAlert(null) };
}
