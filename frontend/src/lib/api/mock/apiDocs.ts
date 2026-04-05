import type { ApiEndpoint } from "../types";
import { MOCK_API_ENDPOINTS } from "./data";
import { clone, mockLatency } from "./latency";

export async function listApiEndpoints(): Promise<ApiEndpoint[]> {
  await mockLatency();
  return clone(MOCK_API_ENDPOINTS);
}
