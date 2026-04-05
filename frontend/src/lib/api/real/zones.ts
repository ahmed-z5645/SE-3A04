import type { TrendSeries, Zone } from "../types";
import { request } from "./client";

export async function listZones(): Promise<Zone[]> {
  return request<Zone[]>("/api/v1/zones");
}

export async function getZone(id: string): Promise<Zone | null> {
  try {
    return await request<Zone>(`/api/v1/zones/${id}`);
  } catch {
    return null;
  }
}

export async function getTrends(): Promise<TrendSeries> {
  return request<TrendSeries>("/api/v1/zones/trends");
}
