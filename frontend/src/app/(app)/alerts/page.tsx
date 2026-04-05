"use client";

import { AlertsList } from "@/components/pages/AlertsList";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function Page() {
  return (
    <RoleGuard allow={["admin", "operator"]} fallback="/overview">
      <AlertsList />
    </RoleGuard>
  );
}
