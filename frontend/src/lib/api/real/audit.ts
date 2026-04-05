import type { AuditLogEntry } from "../types";
import { request } from "./client";

export async function listAuditLog(): Promise<AuditLogEntry[]> {
  return request<AuditLogEntry[]>("/api/v1/audit");
}
