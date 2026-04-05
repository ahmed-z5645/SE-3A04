"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Icon } from "@/components/ui";
import {
  alertsApi,
  type Alert,
  type AlertSeverity,
  type AlertStatus,
} from "@/lib/api";

type FilterKey = "all" | AlertStatus;

const FILTERS: FilterKey[] = ["all", "active", "acknowledged", "resolved"];

function severityVariant(s: AlertSeverity) {
  if (s === "critical") return "error" as const;
  if (s === "warning") return "warning" as const;
  return "info" as const;
}

function statusVariant(s: AlertStatus) {
  if (s === "active") return "error" as const;
  if (s === "acknowledged") return "warning" as const;
  return "success" as const;
}

export function AlertsList() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let cancelled = false;
    const arg = filter === "all" ? undefined : filter;
    void alertsApi.listAlerts(arg).then((data) => {
      if (!cancelled) setAlerts(data);
    });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="flex items-center justify-between py-8 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">Alerts</h1>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "primary" : "default"}
              onClick={() => setFilter(f)}
              className="text-xs capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </header>

      <Card className="mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ID", "Zone", "Type", "Value", "Rule", "Severity", "Status", "Time", ""].map(
                (h) => (
                  <th
                    key={h || "chev"}
                    className="border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr
                key={a.id}
                className="cursor-pointer hover:bg-bg-hover"
                onClick={() => router.push(`/alerts/${a.id}`)}
              >
                <td className="border-b border-border-default px-4 py-3 font-mono text-xs">
                  {a.id}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] font-medium">
                  {a.zone}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  {a.type}
                </td>
                <td className="border-b border-border-default px-4 py-3 font-mono text-[13px]">
                  {a.value}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-xs text-text-secondary">
                  {a.rule}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <Badge variant={severityVariant(a.severity)}>
                    {a.severity}
                  </Badge>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-xs text-text-muted">
                  {a.time}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <Icon name="chevron" size={14} color="var(--text-muted)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
