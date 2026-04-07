import type { Alert, AlertStatus } from "../types";
import { request } from "./client";

export async function listAlerts(filter?: AlertStatus): Promise<Alert[]> {
  const suffix = filter ? `?status=${filter}` : "";
  return request<Alert[]>(`/api/v1/alerts${suffix}`);
}

export async function getAlert(id: string): Promise<Alert | null> {
  try {
    return await request<Alert>(`/api/v1/alerts/${id}`);
  } catch {
    return null;
  }
}

export async function acknowledgeAlert(id: string): Promise<Alert | null> {
  try {
    return await request<Alert>(`/api/v1/alerts/${id}/acknowledge`, {
      method: "POST",
    });
  } catch {
    return null;
  }
}

export async function archiveAlert(id: string): Promise<Alert | null> {
  try {
    return await request<Alert>(`/api/v1/alerts/${id}/resolve`, {
      method: "POST",
    });
  } catch {
    return null;
  }
}
