"use client";

import { Dashboard } from "@/components/pages/Dashboard";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function Page() {
  return (
    <RoleGuard allow={["admin", "operator"]} fallback="/overview">
      <Dashboard />
    </RoleGuard>
  );
}
