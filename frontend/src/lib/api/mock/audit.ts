import type { AuditLogEntry } from "../types";
import { MOCK_AUDIT } from "./data";
import { clone, mockLatency } from "./latency";

export async function listAuditLog(): Promise<AuditLogEntry[]> {
  await mockLatency();
  return clone(MOCK_AUDIT);
}
