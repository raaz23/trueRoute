"use client";

import { useCallback, useEffect, useState } from "react";
import type { LatLng } from "@/lib/maps/coords";

type MapGeolocationState = {
  position: LatLng | null;
  accuracy: number | null;
  locating: boolean;
  error: string | null;
  locate: () => void;
};

/**
 * Live GPS for the map — watchPosition with a pulsing user marker.
 */
export function useMapGeolocation(enabled = true): MapGeolocationState {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("GPS is not supported on this device.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude });
        setAccuracy(p.coords.accuracy);
        setLocating(false);
      },
      () => {
        setError("Allow location access to show your position on the map.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  }, []);

  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    setLocating(true);
    const watchId = navigator.geolocation.watchPosition(
      (p) => {
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude });
        setAccuracy(p.coords.accuracy);
        setLocating(false);
        setError(null);
      },
      (err) => {
        setError(err.message || "Location unavailable");
        setLocating(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  return { position, accuracy, locating, error, locate };
}
