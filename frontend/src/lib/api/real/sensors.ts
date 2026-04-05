import type { Sensor } from "../types";
import { request } from "./client";

export async function listSensors(): Promise<Sensor[]> {
  return request<Sensor[]>("/api/v1/sensors");
}

export async function getSensor(id: string): Promise<Sensor | null> {
  try {
    return await request<Sensor>(`/api/v1/sensors/${id}`);
  } catch {
    return null;
  }
}
