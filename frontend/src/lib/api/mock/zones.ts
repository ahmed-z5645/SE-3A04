import type { TrendSeries, Zone } from "../types";
import { MOCK_TRENDS, MOCK_ZONES } from "./data";
import { clone, mockLatency } from "./latency";

export async function listZones(): Promise<Zone[]> {
  await mockLatency();
  return clone(MOCK_ZONES);
}

export async function getZone(id: string): Promise<Zone | null> {
  await mockLatency();
  return clone(MOCK_ZONES.find((z) => z.id === id) ?? null);
}

export async function getTrends(): Promise<TrendSeries> {
  await mockLatency();
  return clone(MOCK_TRENDS);
}
