"use client";

import Link from "next/link";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { MapBusiness } from "@/lib/services/mapService";

const businessIcon = new L.DivIcon({
  className: "",
  html: `<span style="font-size:22px">🏪</span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

export default function BusinessMarker({ business }: { business: MapBusiness }) {
  return (
    <Marker position={[business.lat, business.lng]} icon={businessIcon}>
      <Popup className="business-popup" minWidth={220}>
        <div className="space-y-2 p-1 text-[13px] text-[#060A14]">
          <p className="font-semibold">{business.name}</p>
          <p className="text-[11px] opacity-70">{business.categoryLabel}</p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span>★ {business.avgRating || "—"}</span>
            <span>Trust {business.trustScore}%</span>
            {business.minPrice != null && <span>From NPR {business.minPrice}</span>}
          </div>
          <Link
            href={`/business/${business.slug}`}
            className="inline-block rounded-lg bg-[#D4A017] px-3 py-1.5 text-[12px] font-semibold text-white"
          >
            View profile →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
