"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { tileLayerOffline, type TileLayerOffline } from "leaflet.offline";

type OfflineTileLayerProps = {
  url: string;
  attribution: string;
  onLayerReady?: (layer: TileLayerOffline) => void;
};

/** Stadia (or other) tiles with IndexedDB caching via leaflet.offline. */
export default function OfflineTileLayer({
  url,
  attribution,
  onLayerReady,
}: OfflineTileLayerProps) {
  const map = useMap();
  const layerRef = useRef<TileLayerOffline | null>(null);
  const readyRef = useRef(onLayerReady);

  readyRef.current = onLayerReady;

  useEffect(() => {
    const layer = tileLayerOffline(url, {
      attribution,
      maxZoom: 19,
      crossOrigin: true,
    });
    layer.addTo(map);
    layerRef.current = layer;
    readyRef.current?.(layer);

    return () => {
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map, url, attribution]);

  return null;
}
