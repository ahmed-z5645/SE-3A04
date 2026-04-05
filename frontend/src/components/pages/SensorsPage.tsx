"use client";

import { useEffect, useState } from "react";
import { Badge, Card } from "@/components/ui";
import { sensorsApi, type Sensor } from "@/lib/api";

function batteryColor(battery: string) {
  const pct = parseInt(battery, 10);
  if (pct > 50) return "var(--success)";
  if (pct > 20) return "var(--warning)";
  return "var(--error)";
}

export function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    let cancelled = false;
    void sensorsApi.listSensors().then((data) => {
      if (!cancelled) setSensors(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="py-8 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">Sensors</h1>
        <p className="mt-1 text-text-secondary">
          IoT device status and management
        </p>
      </header>

      <Card className="mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Sensor ID", "Zone", "Type", "Status", "Last Ping", "Battery"].map(
                (h) => (
                  <th
                    key={h}
                    className="border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sensors.map((s) => (
              <tr key={s.id}>
                <td className="border-b border-border-default px-4 py-3 font-mono text-[13px] font-medium">
                  {s.id}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  {s.zone}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  {s.type}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <Badge
                    variant={s.status === "online" ? "success" : "error"}
                  >
                    {s.status}
                  </Badge>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-xs text-text-secondary">
                  {s.lastPing}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 overflow-hidden rounded-[2px] bg-border-default">
                      <div
                        className="h-full rounded-[2px]"
                        style={{
                          width: s.battery,
                          background: batteryColor(s.battery),
                        }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary">
                      {s.battery}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
