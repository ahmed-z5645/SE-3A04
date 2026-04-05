import type { ApiEndpoint } from "../types";
import { request } from "./client";

export async function listApiEndpoints(): Promise<ApiEndpoint[]> {
  return request<ApiEndpoint[]>("/api/v1/meta/endpoints");
}
