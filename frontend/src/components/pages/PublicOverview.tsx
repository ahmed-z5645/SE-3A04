"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  Icon,
  Sparkline,
  type IconName,
} from "@/components/ui";
import {
  alertsApi,
  zonesApi,
  type Alert,
  type TrendSeries,
  type Zone,
} from "@/lib/api";

interface MetricSpec {
  icon: IconName;
  label: string;
  value: string;
  sub: string;
  color: string;
  series: keyof TrendSeries;
}

const METRICS: MetricSpec[] = [
  { icon: "wind", label: "Avg. AQI", value: "47", sub: "Moderate", color: "var(--warning)", series: "aqi" },
  { icon: "thermometer", label: "Avg. Temp", value: "18°C", sub: "Normal", color: "var(--accent)", series: "temp" },
  { icon: "droplet", label: "Avg. Humidity", value: "62%", sub: "Normal", color: "var(--accent)", series: "humidity" },
  { icon: "volume", label: "Avg. Noise", value: "61 dB", sub: "Moderate", color: "var(--warning)", series: "noise" },
];

// Zone pins on the sensor map — matches the prototype's hand-placed layout.
const MAP_PINS = [
  { x: 200, y: 80, color: "var(--success)" },
  { x: 120, y: 140, color: "var(--success)" },
  { x: 310, y: 110, color: "var(--warning)" },
  { x: 80, y: 200, color: "var(--success)" },
  { x: 260, y: 180, color: "var(--error)" },
  { x: 340, y: 200, color: "var(--success)" },
  { x: 160, y: 60, color: "var(--success)" },
  { x: 300, y: 230, color: "var(--text-muted)" },
];

const LEGEND = [
  { color: "var(--success)", label: "Good" },
  { color: "var(--warning)", label: "Warning" },
  { color: "var(--error)", label: "Alert" },
  { color: "var(--text-muted)", label: "Offline" },
];

function statusVariant(status: Zone["status"]) {
  if (status === "good") return "success" as const;
  if (status === "alert") return "error" as const;
  return "warning" as const;
}

export function PublicOverview() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [trends, setTrends] = useState<TrendSeries | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      zonesApi.listZones(),
      alertsApi.listAlerts("active"),
      zonesApi.getTrends(),
    ]).then(([z, a, t]) => {
      if (cancelled) return;
      setZones(z);
      setAlerts(a);
      setTrends(t);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="py-12 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">
          Environmental Overview
        </h1>
        <p className="mt-2 text-[15px] text-text-secondary">
          Real-time environmental conditions across monitored city zones.
        </p>
      </header>

      {/* ── Metric Cards ── */}
      <div className="mb-8 grid grid-cols-4 gap-3">
        {METRICS.map((m) => (
          <Card key={m.label}>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs text-text-secondary">
                  <Icon name={m.icon} size={14} />
                  {m.label}
                </div>
                <div className="text-[28px] font-bold leading-none tracking-[-0.03em]">
                  {m.value}
                </div>
                <div
                  className="mt-0.5 text-xs"
                  style={{ color: m.color }}
                >
                  {m.sub}
                </div>
              </div>
              {trends && (
                <Sparkline
                  data={trends[m.series]}
                  color={m.color}
                  width={80}
                  height={28}
                />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Map + Zone Table ── */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <Card className="flex min-h-[320px] flex-col">
          <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
            Sensor Map
          </h3>
          <div className="relative flex-1 overflow-hidden rounded-md border border-border-default bg-[#0d1117]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 280"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={i * 14}
                  x2="400"
                  y2={i * 14}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                />
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 14}
                  y1="0"
                  x2={i * 14}
                  y2="280"
                  stroke="var(--border)"
                  strokeWidth="0.5"
                />
              ))}
              {MAP_PINS.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    fill={p.color}
                    opacity="0.15"
                  />
                  <circle cx={p.x} cy={p.y} r="4" fill={p.color} />
                </g>
              ))}
            </svg>
            <div className="absolute bottom-3 left-3 flex gap-3 text-[10px]">
              {LEGEND.map((l) => (
                <span
                  key={l.label}
                  className="flex items-center gap-1 text-text-secondary"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: l.color }}
                  />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
            Zone Conditions
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Zone", "AQI", "Temp", "Noise", "Status"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id}>
                  <td className="border-b border-border-default px-4 py-3 text-[13px] font-medium">
                    {z.name}
                  </td>
                  <td className="border-b border-border-default px-4 py-3 text-[13px]">
                    {z.aqi}
                  </td>
                  <td className="border-b border-border-default px-4 py-3 text-[13px]">
                    {z.temp}°C
                  </td>
                  <td className="border-b border-border-default px-4 py-3 text-[13px]">
                    {z.noise} dB
                  </td>
                  <td className="border-b border-border-default px-4 py-3 text-[13px]">
                    <Badge variant={statusVariant(z.status)}>{z.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── Active Alerts ── */}
      <Card className="mb-12">
        <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
          Active Alerts
        </h3>
        <div className="flex flex-col gap-2">
          {alerts.length === 0 && (
            <div className="text-[13px] text-text-muted">
              No active alerts.
            </div>
          )}
          {alerts.map((a) => {
            const critical = a.severity === "critical";
            return (
              <div
                key={a.id}
                className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                  critical
                    ? "border-error-border bg-error-bg"
                    : "border-warning-border bg-warning-bg"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name="alert"
                    size={16}
                    color={critical ? "var(--error)" : "var(--warning)"}
                  />
                  <div>
                    <div className="text-[13px] font-medium">
                      {a.type} — {a.zone}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {a.value} · {a.rule}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-text-muted">{a.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
