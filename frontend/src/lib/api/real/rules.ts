import type { Rule } from "../types";
import { request } from "./client";

export async function listRules(): Promise<Rule[]> {
  return request<Rule[]>("/api/v1/rules");
}

export async function createRule(
  input: Omit<Rule, "id" | "status">
): Promise<Rule> {
  return request<Rule>("/api/v1/rules", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteRule(id: string): Promise<boolean> {
  await request<void>(`/api/v1/rules/${id}`, {
    method: "DELETE",
  });
  return true;
}
