"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.DivIcon({
  className: "",
  html: `<span style="font-size:28px">📍</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function BusinessMiniMap({
  lat,
  lng,
  name,
  address,
}: {
  lat: number;
  lng: number;
  name: string;
  address?: string | null;
}) {
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  const directionsUrl = `https://www.openstreetmap.org/directions?to=${lat},${lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="h-56 w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full">
        <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={pinIcon}>
            <Popup>
              <strong>{name}</strong>
              {address && <p className="mt-1 text-sm">{address}</p>}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="flex gap-2 border-t border-white/8 bg-[var(--bg-card)] p-3">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl bg-[var(--teal)] px-4 py-2 text-center text-[13px] font-semibold text-white"
        >
          Get directions
        </a>
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/10 px-4 py-2 text-[13px] font-medium text-[var(--text-muted)] hover:bg-white/5"
        >
          OpenStreetMap
        </a>
      </div>
    </div>
  );
}
