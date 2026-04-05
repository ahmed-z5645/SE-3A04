"use client";

import { EditAccountPage } from "@/components/pages/EditAccountPage";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function Page() {
  return (
    <RoleGuard allow={["admin", "operator"]} fallback="/overview">
      <EditAccountPage />
    </RoleGuard>
  );
}
