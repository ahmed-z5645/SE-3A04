"use client";

import { AuditLogPage } from "@/components/pages/AuditLogPage";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function Page() {
  return (
    <RoleGuard allow={["admin"]} fallback="/dashboard">
      <AuditLogPage />
    </RoleGuard>
  );
}
