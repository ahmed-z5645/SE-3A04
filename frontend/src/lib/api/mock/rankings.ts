import type { City } from "../types";
import { MOCK_CITIES } from "./data";
import { clone, mockLatency } from "./latency";

export type RankingSort = "aqi" | "temp" | "noise" | "humidity";

export async function listRankings(
  sort: RankingSort = "aqi",
  search = ""
): Promise<City[]> {
  await mockLatency();
  const query = search.trim().toLowerCase();
  return clone(MOCK_CITIES)
    .filter((c) => !query || c.name.toLowerCase().includes(query))
    .sort((a, b) => a[sort] - b[sort]);
}
