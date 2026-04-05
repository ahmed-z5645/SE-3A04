"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Icon, Sparkline } from "@/components/ui";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  alertsApi,
  type Alert,
  type AlertSeverity,
  type AlertStatus,
} from "@/lib/api";

interface AlertDetailProps {
  alertId: string;
}

const SUGGESTED_ACTIONS = [
  "Issue public air quality advisory for West End zone",
  "Deploy mobile AQ monitoring unit to verify readings",
  "Notify public health department of threshold breach",
  "Check sensor SN-051 calibration status",
];

const HISTORICAL_TREND = [65, 72, 78, 85, 92, 98, 105, 102, 108, 105];

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

export function AlertDetail({ alertId }: AlertDetailProps) {
  return (
    <RoleGuard allow={["admin", "operator"]} fallback="/overview">
      <AlertDetailInner alertId={alertId} />
    </RoleGuard>
  );
}

function AlertDetailInner({ alertId }: AlertDetailProps) {
  const router = useRouter();
  const { role } = useAuth();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void alertsApi.getAlert(alertId).then((data) => {
      if (cancelled) return;
      setAlert(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [alertId]);

  async function handleAcknowledge() {
    if (!alert) return;
    setAcknowledging(true);
    await alertsApi.acknowledgeAlert(alert.id);
    router.push("/alerts");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-12 text-text-secondary">
        Loading…
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <Link
          href="/alerts"
          className="text-[13px] text-text-secondary hover:text-text"
        >
          ← Back to alerts
        </Link>
        <p className="mt-4 text-text">Alert not found.</p>
      </div>
    );
  }

  const details: [string, string][] = [
    ["Zone", alert.zone],
    ["Type", alert.type],
    ["Triggered Value", alert.value],
    ["Rule Violated", alert.rule],
    ["Triggered", alert.time],
    ["Sensor", "SN-051"],
    ["Status", alert.status],
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <div className="pt-8 pb-2">
        <Link
          href="/alerts"
          className="text-[13px] text-text-secondary hover:text-text"
        >
          ← Back to alerts
        </Link>
      </div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-[-0.04em]">
              {alert.id}
            </h1>
            <Badge variant={severityVariant(alert.severity)}>
              {alert.severity}
            </Badge>
            <Badge variant={statusVariant(alert.status)}>{alert.status}</Badge>
          </div>
          <p className="mt-1 text-text-secondary">
            {alert.type} violation in {alert.zone}
          </p>
        </div>
        <div className="flex gap-2">
          {role === "admin" && (
            <Button>
              <Icon name="edit" size={14} /> Edit
            </Button>
          )}
          {alert.status === "active" && (
            <Button
              variant="primary"
              onClick={handleAcknowledge}
              disabled={acknowledging}
            >
              <Icon name="check" size={14} />
              {acknowledging ? "Acknowledging…" : "Acknowledge"}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <Card>
          <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
            Alert Details
          </h3>
          {details.map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b border-border-default py-2 last:border-b-0"
            >
              <span className="text-[13px] text-text-secondary">{k}</span>
              <span className="text-[13px] font-medium">{v}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
            Suggested Actions
          </h3>
          <div className="flex flex-col gap-2">
            {SUGGESTED_ACTIONS.map((action) => (
              <div
                key={action}
                className="flex items-start gap-2 rounded-md border border-border-default bg-bg-hover px-3.5 py-2.5 text-[13px]"
              >
                <span className="mt-px text-accent">→</span>
                {action}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mb-12">
        <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
          Historical Trend — {alert.type}
        </h3>
        <Sparkline
          data={HISTORICAL_TREND}
          color="var(--error)"
          width={1000}
          height={80}
        />
        <div className="mt-1 flex justify-between text-[11px] text-text-muted">
          <span>6h ago</span>
          <span>Now</span>
        </div>
      </Card>
    </div>
  );
}
