"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Gauge,
  Icon,
  SensorMap,
  Sparkline,
} from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  alertsApi,
  zonesApi,
  type Alert,
  type TrendSeries,
  type Zone,
} from "@/lib/api";

interface Stat {
  label: string;
  value: string;
  variant: "success" | "warning" | "error" | "info";
}

interface TrendSpec {
  label: string;
  data: keyof TrendSeries;
  color: string;
}

const TRENDS: TrendSpec[] = [
  { label: "Air Quality Index", data: "aqi", color: "var(--warning)" },
  { label: "Temperature (°C)", data: "temp", color: "var(--accent)" },
  { label: "Humidity (%)", data: "humidity", color: "var(--accent)" },
  { label: "Noise (dB)", data: "noise", color: "var(--warning)" },
];

const POLL_MS = 20_000;

export function Dashboard() {
  const { role } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [trends, setTrends] = useState<TrendSeries | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    let cancelled = false;

    function fetchAll() {
      void Promise.allSettled([
        alertsApi.listAlerts("active"),
        zonesApi.getTrends(),
        zonesApi.listZones(),
      ]).then(([a, t, z]) => {
        if (cancelled) return;
        if (a.status === "fulfilled") setAlerts(a.value);
        if (t.status === "fulfilled") setTrends(t.value);
        if (z.status === "fulfilled") setZones(z.value);
      });
    }

    fetchAll();
    const id = setInterval(fetchAll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const primary = zones.length > 0
    ? zones.reduce((worst, z) => z.aqi > worst.aqi ? z : worst)
    : null;
  const avgAqi =
    zones.length > 0
      ? Math.round(zones.reduce((s, z) => s + z.aqi, 0) / zones.length)
      : null;

  const stats: Stat[] = [
    { label: "Active Alerts", value: String(alerts.length), variant: alerts.length > 0 ? "error" : "success" },
    { label: "Zones Monitored", value: String(zones.length), variant: "info" },
    { label: "Avg. AQI", value: avgAqi !== null ? String(avgAqi) : "—", variant: "warning" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="flex items-center justify-between py-8 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.04em]">Dashboard</h1>
          <p className="mt-1 text-text-secondary">
            System overview and real-time monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/sensors">
            <Button>
              <Icon name="database" size={14} /> Sensors
            </Button>
          </Link>
          {role === "admin" && (
            <Link href="/rules">
              <Button variant="primary">
                <Icon name="plus" size={14} /> New Rule
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* ── Stat Row ── */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="mb-1.5 text-xs text-text-secondary">{s.label}</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-[-0.03em]">
                {s.value}
              </span>
              <Badge variant={s.variant}>●</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Gauges ── */}
      <Card className="mb-4">
        <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
          Current Readings — {primary ? primary.name : "Loading…"}
        </h3>
        <div className="flex justify-around py-2">
          <Gauge
            value={primary?.aqi ?? 0}
            max={200}
            label="Air Quality"
            unit="AQI"
            color="var(--success)"
          />
          <Gauge
            value={primary?.temp ?? 0}
            max={45}
            label="Temperature"
            unit="°C"
            color="var(--accent)"
          />
          <Gauge
            value={primary?.humidity ?? 0}
            max={100}
            label="Humidity"
            unit="%"
            color="var(--accent)"
          />
          <Gauge
            value={primary?.noise ?? 0}
            max={120}
            label="Noise Level"
            unit="dB"
            color="var(--warning)"
          />
        </div>
      </Card>

      {/* ── Sensor Map + Active Alerts ── */}
      <div className="mb-6 grid grid-cols-[1.4fr_1fr] gap-4">
        <Card className="min-h-[280px]">
          <h3 className="mb-3 text-base font-semibold tracking-[-0.01em]">
            Sensor Map
          </h3>
          <SensorMap zones={zones} height={240} />
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-[-0.01em]">
              Active Alerts
            </h3>
            <Link
              href="/alerts"
              className="text-xs text-accent hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {alerts.length === 0 && (
              <div className="text-[13px] text-text-muted">
                No active alerts.
              </div>
            )}
            {alerts.map((a) => {
              const critical = a.severity === "critical";
              return (
                <Link
                  key={a.id}
                  href={`/alerts/${a.id}`}
                  className={`block rounded-md border px-3 py-2.5 ${
                    critical
                      ? "border-error-border bg-error-bg"
                      : "border-warning-border bg-warning-bg"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        name="alert"
                        size={14}
                        color={
                          critical ? "var(--error)" : "var(--warning)"
                        }
                      />
                      <span className="text-[13px] font-medium">{a.id}</span>
                    </div>
                    <Badge variant={critical ? "error" : "warning"}>
                      {a.severity}
                    </Badge>
                  </div>
                  <div className="ml-[22px] mt-1 text-xs text-text-secondary">
                    {a.type} in {a.zone} · {a.value}
                  </div>
                  <div className="ml-[22px] mt-0.5 text-[11px] text-text-muted">
                    {a.time}
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Trend Overview ── */}
      <Card className="mb-12">
        <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
          Trend Overview (24h)
        </h3>
        <div className="grid grid-cols-4 gap-6">
          {TRENDS.map((t) => {
            const series = trends?.[t.data] ?? [];
            const latest = series.length > 0 ? series[series.length - 1] : null;
            return (
              <div key={t.label}>
                <div className="mb-2 flex justify-between">
                  <span className="text-xs text-text-secondary">{t.label}</span>
                  <span className="text-[13px] font-semibold">
                    {latest !== null ? latest : "—"}
                  </span>
                </div>
                {trends && (
                  <Sparkline
                    data={series}
                    color={t.color}
                    width={240}
                    height={40}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
