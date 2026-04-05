import type {
  Account,
  Alert,
  ApiEndpoint,
  AuditLogEntry,
  City,
  Rule,
  Sensor,
  TrendSeries,
  Zone,
} from "../types";

/**
 * MOCK data ported 1:1 from the prototype (scemas-prototype.jsx.reference,
 * lines 249–309). Do not mutate these at runtime — the mock service modules
 * clone before returning so pages that mutate locally can't poison the seed.
 */

// Zone centroids are plausible Hamilton, ON neighborhood centers. These are
// seed values only; the real backend owns the authoritative coordinates.
export const MOCK_ZONES: Zone[] = [
  { id: "z1", name: "Downtown Core", aqi: 42, temp: 18, humidity: 62, noise: 68, status: "good", lat: 43.2557, lng: -79.8711 },
  { id: "z2", name: "Harbour District", aqi: 35, temp: 17, humidity: 71, noise: 55, status: "good", lat: 43.2710, lng: -79.8640 },
  { id: "z3", name: "Industrial Park", aqi: 89, temp: 21, humidity: 48, noise: 82, status: "warning", lat: 43.2490, lng: -79.8100 },
  { id: "z4", name: "Riverside", aqi: 28, temp: 16, humidity: 74, noise: 42, status: "good", lat: 43.2220, lng: -79.8850 },
  { id: "z5", name: "Uptown", aqi: 51, temp: 19, humidity: 58, noise: 61, status: "moderate", lat: 43.2480, lng: -79.8880 },
  { id: "z6", name: "West End", aqi: 105, temp: 22, humidity: 44, noise: 78, status: "alert", lat: 43.2630, lng: -79.9190 },
];

export const MOCK_ALERTS: Alert[] = [
  { id: "ALT-001", zone: "West End", type: "Air Quality", severity: "critical", value: "AQI 105", rule: "AQI > 100", time: "2 min ago", status: "active" },
  { id: "ALT-002", zone: "Industrial Park", type: "Noise", severity: "warning", value: "82 dB", rule: "Noise > 80 dB", time: "14 min ago", status: "active" },
  { id: "ALT-003", zone: "Downtown Core", type: "Temperature", severity: "info", value: "32°C", rule: "Temp > 30°C", time: "1 hr ago", status: "acknowledged" },
  { id: "ALT-004", zone: "Harbour District", type: "Air Quality", severity: "warning", value: "AQI 88", rule: "AQI > 85", time: "3 hr ago", status: "resolved" },
];

export const MOCK_CITIES: City[] = [
  { rank: 1, name: "Halifax", aqi: 18, temp: 14, noise: 42, humidity: 68 },
  { rank: 2, name: "Victoria", aqi: 22, temp: 16, noise: 45, humidity: 72 },
  { rank: 3, name: "Ottawa", aqi: 28, temp: 15, noise: 48, humidity: 65 },
  { rank: 4, name: "Calgary", aqi: 31, temp: 12, noise: 52, humidity: 55 },
  { rank: 5, name: "Toronto", aqi: 42, temp: 18, noise: 68, humidity: 62 },
  { rank: 6, name: "Vancouver", aqi: 35, temp: 17, noise: 58, humidity: 70 },
  { rank: 7, name: "Montreal", aqi: 48, temp: 16, noise: 65, humidity: 67 },
  { rank: 8, name: "Winnipeg", aqi: 55, temp: 10, noise: 50, humidity: 58 },
  { rank: 9, name: "Edmonton", aqi: 61, temp: 11, noise: 54, humidity: 52 },
  { rank: 10, name: "Hamilton", aqi: 58, temp: 17, noise: 62, humidity: 64 },
];

export const MOCK_TRENDS: TrendSeries = {
  aqi: [45, 42, 48, 51, 47, 42, 38, 41, 44, 42],
  temp: [16, 17, 18, 19, 18, 17, 18, 19, 20, 18],
  humidity: [65, 62, 58, 60, 63, 67, 64, 62, 60, 62],
  noise: [55, 58, 62, 68, 72, 65, 60, 58, 55, 68],
};

export const MOCK_AUDIT: AuditLogEntry[] = [
  { time: "10:42 AM", user: "admin@scemas.ca", action: "Created alert rule", detail: "AQI > 100 for West End" },
  { time: "10:15 AM", user: "operator1@scemas.ca", action: "Acknowledged alert", detail: "ALT-003 — Temperature" },
  { time: "09:58 AM", user: "admin@scemas.ca", action: "Updated account", detail: "operator2@scemas.ca role changed" },
  { time: "09:30 AM", user: "system", action: "Sensor offline", detail: "Sensor SN-042 in Industrial Park" },
  { time: "09:12 AM", user: "operator1@scemas.ca", action: "Resolved alert", detail: "ALT-004 — Air Quality" },
];

export const MOCK_SENSORS: Sensor[] = [
  { id: "SN-001", zone: "Downtown Core", type: "Multi", status: "online", lastPing: "12s ago", battery: "92%" },
  { id: "SN-012", zone: "Harbour District", type: "AQ+Temp", status: "online", lastPing: "8s ago", battery: "87%" },
  { id: "SN-023", zone: "Industrial Park", type: "Multi", status: "online", lastPing: "15s ago", battery: "78%" },
  { id: "SN-034", zone: "Riverside", type: "Noise", status: "online", lastPing: "5s ago", battery: "95%" },
  { id: "SN-042", zone: "Industrial Park", type: "AQ", status: "offline", lastPing: "47m ago", battery: "12%" },
  { id: "SN-051", zone: "West End", type: "Multi", status: "online", lastPing: "3s ago", battery: "81%" },
];

export const MOCK_ACCOUNTS: Account[] = [
  { email: "admin@scemas.ca", role: "Administrator", created: "Jan 15, 2026", lastLogin: "Today 10:42 AM" },
  { email: "operator1@scemas.ca", role: "Operator", created: "Jan 20, 2026", lastLogin: "Today 09:12 AM" },
  { email: "operator2@scemas.ca", role: "Operator", created: "Feb 01, 2026", lastLogin: "Yesterday 4:30 PM" },
];

export const MOCK_RULES: Rule[] = [
  { id: "R-001", name: "High AQI", condition: "AQI > 100", zone: "All Zones", status: "active" },
  { id: "R-002", name: "Noise Violation", condition: "Noise > 80 dB", zone: "All Zones", status: "active" },
  { id: "R-003", name: "Heat Warning", condition: "Temp > 30°C", zone: "All Zones", status: "active" },
  { id: "R-004", name: "Low Humidity", condition: "Humidity < 20%", zone: "Industrial Park", status: "paused" },
];

export const MOCK_API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/v1/sensors/{zoneID}",
    desc: "Returns the latest aggregated sensor reading for a single zone, including AQI, temperature, humidity, and noise levels.",
    example: `curl -H "X-API-Key: $SCEMAS_KEY" \\
  https://api.scemas.ca/v1/sensors/z1`,
    response: `{
  "zone_id": "z1",
  "zone_name": "Downtown Core",
  "timestamp": "2026-04-03T14:30:00Z",
  "metrics": {
    "aqi": 42,
    "temperature_c": 18,
    "humidity_pct": 62,
    "noise_db": 68
  },
  "status": "good"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/zones",
    desc: "Lists every monitored city zone along with its current status summary. Useful for populating maps and selectors.",
    example: `curl -H "X-API-Key: $SCEMAS_KEY" \\
  https://api.scemas.ca/v1/zones`,
    response: `{
  "zones": [
    { "id": "z1", "name": "Downtown Core", "status": "good" },
    { "id": "z2", "name": "Industrial Park", "status": "moderate" },
    { "id": "z3", "name": "Riverside", "status": "good" }
  ],
  "count": 3
}`,
  },
  {
    method: "GET",
    path: "/api/v1/alerts/active",
    desc: "Returns every alert currently in an active state across all zones, ordered by severity.",
    example: `curl -H "X-API-Key: $SCEMAS_KEY" \\
  https://api.scemas.ca/v1/alerts/active`,
    response: `{
  "alerts": [
    {
      "id": "A-1042",
      "zone_id": "z2",
      "severity": "high",
      "metric": "aqi",
      "value": 158,
      "threshold": 150,
      "started_at": "2026-04-03T13:12:00Z"
    }
  ],
  "count": 1
}`,
  },
  {
    method: "GET",
    path: "/api/v1/rankings",
    desc: "Returns environmental rankings for cities. Accepts an optional sortBy query parameter (aqi, temp, noise, humidity).",
    example: `curl -H "X-API-Key: $SCEMAS_KEY" \\
  "https://api.scemas.ca/v1/rankings?sortBy=aqi"`,
    response: `{
  "rankings": [
    { "rank": 1, "city": "Hamilton", "aqi": 38, "temp_c": 17, "humidity_pct": 60, "noise_db": 64 },
    { "rank": 2, "city": "Toronto",  "aqi": 44, "temp_c": 19, "humidity_pct": 58, "noise_db": 71 }
  ],
  "sorted_by": "aqi"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/historical/{zoneID}",
    desc: "Returns a 24-hour time series of readings for a given zone. Use range=7d or range=30d for longer windows.",
    example: `curl -H "X-API-Key: $SCEMAS_KEY" \\
  "https://api.scemas.ca/v1/historical/z1?range=24h"`,
    response: `{
  "zone_id": "z1",
  "range": "24h",
  "series": {
    "aqi":      [40, 42, 41, 43, 45, 44, 42],
    "temp_c":   [16, 17, 17, 18, 19, 18, 18],
    "humidity": [64, 63, 62, 62, 61, 62, 62],
    "noise_db": [62, 65, 68, 70, 69, 67, 66]
  }
}`,
  },
];
