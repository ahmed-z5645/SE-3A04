import type { City } from "../types";
import { request } from "./client";

export type RankingSort = "aqi" | "temp" | "noise" | "humidity";

export async function listRankings(
  sort: RankingSort = "aqi",
  search = ""
): Promise<City[]> {
  const query = new URLSearchParams({ sortBy: sort, search });
  return request<City[]>(`/api/v1/rankings?${query.toString()}`);
}
