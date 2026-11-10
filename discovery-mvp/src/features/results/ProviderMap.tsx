import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import type { ProviderResult } from "../../lib/search";
import type { Origin } from "../../lib/geo";
import { formatDistance } from "../../lib/geo";

const pinColors: Record<string, string> = {
  clinic: "#0f6b63",
  hospital: "#0f6b63",
  boarding: "#b47a1f",
  diagnostics: "#3b3fd9",
  ambulance: "#d64545",
  ngo: "#2e8b57",
};

function pinIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:32px;height:40px;">
      <div style="position:absolute;left:4px;top:0;width:24px;height:24px;border-radius:999px 999px 999px 4px;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(29,43,42,.35)"></div>
      <span style="position:absolute;left:9px;top:5px;color:#fff;font:700 11px/14px 'Plus Jakarta Sans',sans-serif">${label}</span>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 38],
    popupAnchor: [0, -34],
  });
}

function FitBounds({
  points,
  fallback,
  showFallback,
}: {
  points: Array<[number, number]>;
  fallback: [number, number];
  showFallback: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 150);
    return () => window.clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    const all = showFallback ? [...points, fallback] : points;
    if (all.length === 0) {
      map.setView(fallback, 12);
      return;
    }
    if (all.length === 1) {
      map.setView(all[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(all), { padding: [36, 36], maxZoom: 14 });
  }, [map, points, fallback, showFallback]);

  return null;
}

export default function ProviderMap({
  results,
  origin,
  height = 420,
  showOrigin = true,
}: {
  results: ProviderResult[];
  origin?: Origin;
  height?: number;
  showOrigin?: boolean;
}) {
  const fallback: [number, number] = origin
    ? [origin.lat, origin.lng]
    : results[0]
      ? [results[0].provider.lat, results[0].provider.lng]
      : [9.97, 76.28];

  const points = useMemo(
    () =>
      results.map(
        (result) =>
          [result.provider.lat, result.provider.lng] as [number, number],
      ),
    [results],
  );

  return (
    <div
      className="relative z-0 overflow-hidden rounded-card border border-pfa-border"
      style={{ height }}
      role="region"
      aria-label={`Map showing ${results.length} provider${results.length === 1 ? "" : "s"}`}
    >
      <MapContainer
        center={fallback}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds
          points={points}
          fallback={fallback}
          showFallback={showOrigin && Boolean(origin)}
        />
        {showOrigin && origin && (
          <CircleMarker
            center={[origin.lat, origin.lng]}
            radius={8}
            pathOptions={{
              color: "#1d2b2a",
              weight: 2,
              fillColor: "#f2a33a",
              fillOpacity: 1,
            }}
          >
            <Popup>Approximate search location (demo)</Popup>
          </CircleMarker>
        )}
        {results.map(({ provider, distanceKm, openNow }) => (
          <Marker
            key={provider.id}
            position={[provider.lat, provider.lng]}
            icon={pinIcon(
              openNow ? pinColors[provider.type] : "#8a9a97",
              provider.name.slice(0, 2).toUpperCase(),
            )}
            title={provider.name}
          >
            <Popup>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <strong>{provider.name}</strong>
                <div style={{ fontSize: 12, color: "#5e6f6c" }}>
                  {provider.area}, {provider.city}
                  {typeof distanceKm === "number"
                    ? ` · ${formatDistance(distanceKm)}`
                    : ""}
                  {openNow ? " · Open now" : " · Closed"}
                </div>
                <Link
                  to={`/provider/${provider.id}`}
                  style={{ fontSize: 12, fontWeight: 700, color: "#0f6b63" }}
                >
                  View profile →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
