"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation } from "lucide-react";
import type { MapPlace } from "@/lib/services/mapService";
import { toLeafletPosition } from "@/lib/maps/coords";

const placeIcon = L.divIcon({
  className: "tr-place-marker",
  html: `<div class="tr-place-marker__pin" aria-hidden="true"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

type PlaceMarkerProps = {
  place: MapPlace;
  onGetDirections: (place: MapPlace) => void;
};

export default function PlaceMarker({ place, onGetDirections }: PlaceMarkerProps) {
  const fairLabel =
    place.fairPriceNpr != null
      ? `NPR ${place.fairPriceNpr.toLocaleString("en-NP")}`
      : "See details";

  return (
    <Marker position={toLeafletPosition(place)} icon={placeIcon}>
      <Popup className="tr-map-popup" minWidth={220}>
        <div className="tr-map-popup__inner">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" aria-hidden />
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)]">{place.name}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                {place.category.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[13px] text-[var(--text-mid)]">
            Fair price:{" "}
            <span className="font-semibold text-[var(--gold)]">{fairLabel}</span>
          </p>
          <button
            type="button"
            onClick={() => onGetDirections(place)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--teal)] px-3 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Navigation className="h-4 w-4" aria-hidden />
            Get directions
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
