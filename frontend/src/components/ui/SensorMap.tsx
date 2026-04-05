"use client";

import { useMemo, useState } from "react";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import type { Zone } from "@/lib/api";

interface SensorMapProps {
  zones: Zone[];
  /** Pixel height — width always fills its parent. */
  height?: number;
  className?: string;
}

// Fallback center: Hamilton, ON (matches seed zone coordinates). Once live
// data flows in we recenter on the zone bounding box in the render.
const FALLBACK_CENTER = { lat: 43.2557, lng: -79.8711 };

// Dark grayscale styling so the map sits well inside the SCEMAS dark theme.
// Ported from Google's standard "Night Mode" snippet.
const DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0d1117" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d1117" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a93a1" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4d4d4" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6c7380" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1f2937" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#374151" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4b5563" }],
  },
];

function statusColor(status: Zone["status"]): string {
  switch (status) {
    case "good":
      return "#00a86b";
    case "moderate":
      return "#f5a623";
    case "warning":
      return "#f5a623";
    case "alert":
      return "#ee0000";
    default:
      return "#6b7280";
  }
}

export function SensorMap({ zones, height = 280, className }: SensorMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "scemas-google-map",
    googleMapsApiKey: apiKey,
  });

  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);

  const center = useMemo(() => {
    if (zones.length === 0) return FALLBACK_CENTER;
    const avgLat = zones.reduce((s, z) => s + z.lat, 0) / zones.length;
    const avgLng = zones.reduce((s, z) => s + z.lng, 0) / zones.length;
    return { lat: avgLat, lng: avgLng };
  }, [zones]);

  const containerStyle = { width: "100%", height: `${height}px` };

  if (!apiKey) {
    return (
      <div
        className={className}
        style={{
          height,
          background: "#0d1117",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          textAlign: "center",
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        Google Maps API key missing. Set{" "}
        <code className="mx-1 font-mono text-text">
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </code>{" "}
        in <code className="mx-1 font-mono text-text">.env.local</code>.
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={className}
        style={{
          height,
          background: "#0d1117",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "var(--error)",
        }}
      >
        Failed to load Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={className}
        style={{
          height,
          background: "#0d1117",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
      }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={{
          styles: DARK_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          backgroundColor: "#0d1117",
        }}
      >
        {zones.map((z) => {
          const color = statusColor(z.status);
          return (
            <MarkerF
              key={z.id}
              position={{ lat: z.lat, lng: z.lng }}
              onClick={() => setActiveZoneId(z.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: color,
                strokeOpacity: 0.25,
                strokeWeight: 8,
              }}
            />
          );
        })}
        {activeZoneId &&
          (() => {
            const z = zones.find((x) => x.id === activeZoneId);
            if (!z) return null;
            return (
              <InfoWindowF
                position={{ lat: z.lat, lng: z.lng }}
                onCloseClick={() => setActiveZoneId(null)}
              >
                <div style={{ color: "#111", fontSize: 12, minWidth: 140 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {z.name}
                  </div>
                  <div>AQI {z.aqi} · {z.temp}°C</div>
                  <div>Noise {z.noise} dB · Humidity {z.humidity}%</div>
                </div>
              </InfoWindowF>
            );
          })()}
      </GoogleMap>
    </div>
  );
}
