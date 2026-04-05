import type { Sensor } from "../types";
import { MOCK_SENSORS } from "./data";
import { clone, mockLatency } from "./latency";

export async function listSensors(): Promise<Sensor[]> {
  await mockLatency();
  return clone(MOCK_SENSORS);
}

export async function getSensor(id: string): Promise<Sensor | null> {
  await mockLatency();
  return clone(MOCK_SENSORS.find((s) => s.id === id) ?? null);
}
