"use client";

import { SensorsPage } from "@/components/pages/SensorsPage";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function Page() {
  return (
    <RoleGuard allow={["admin", "operator"]} fallback="/overview">
      <SensorsPage />
    </RoleGuard>
  );
}
