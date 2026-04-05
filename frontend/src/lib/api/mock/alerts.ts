import type { Alert, AlertStatus } from "../types";
import { MOCK_ALERTS } from "./data";
import { clone, mockLatency } from "./latency";

export async function listAlerts(filter?: AlertStatus): Promise<Alert[]> {
  await mockLatency();
  const all = clone(MOCK_ALERTS);
  return filter ? all.filter((a) => a.status === filter) : all;
}

export async function getAlert(id: string): Promise<Alert | null> {
  await mockLatency();
  return clone(MOCK_ALERTS.find((a) => a.id === id) ?? null);
}

export async function acknowledgeAlert(id: string): Promise<Alert | null> {
  await mockLatency();
  const alert = MOCK_ALERTS.find((a) => a.id === id);
  if (!alert) return null;
  // NB: we intentionally mutate the shared seed here so repeat calls see the
  // updated status. Pages that need pristine data should clone on read.
  alert.status = "acknowledged";
  return clone(alert);
}

export async function archiveAlert(id: string): Promise<Alert | null> {
  await mockLatency();
  const alert = MOCK_ALERTS.find((a) => a.id === id);
  if (!alert) return null;
  alert.status = "resolved";
  return clone(alert);
}
