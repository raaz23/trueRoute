"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import type { LatLng } from "@/lib/maps/coords";
import { toLeafletPosition } from "@/lib/maps/coords";

const userIcon = L.divIcon({
  className: "tr-user-location",
  html: `<span class="tr-user-location__dot"></span><span class="tr-user-location__pulse"></span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function UserLocationMarker({ position }: { position: LatLng }) {
  return <Marker position={toLeafletPosition(position)} icon={userIcon} zIndexOffset={1000} />;
}
