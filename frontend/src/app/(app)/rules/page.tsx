"use client";

import { RulesPage } from "@/components/pages/RulesPage";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function Page() {
  return (
    <RoleGuard allow={["admin"]} fallback="/dashboard">
      <RulesPage />
    </RoleGuard>
  );
}
