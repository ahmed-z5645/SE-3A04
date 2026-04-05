import type { Rule } from "../types";
import { MOCK_RULES } from "./data";
import { clone, mockLatency } from "./latency";

export async function listRules(): Promise<Rule[]> {
  await mockLatency();
  return clone(MOCK_RULES);
}

export async function createRule(
  input: Omit<Rule, "id" | "status">
): Promise<Rule> {
  await mockLatency();
  const nextId = `R-${String(MOCK_RULES.length + 1).padStart(3, "0")}`;
  const rule: Rule = { ...input, id: nextId, status: "active" };
  MOCK_RULES.push(rule);
  return clone(rule);
}

export async function deleteRule(id: string): Promise<boolean> {
  await mockLatency();
  const idx = MOCK_RULES.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  MOCK_RULES.splice(idx, 1);
  return true;
}
