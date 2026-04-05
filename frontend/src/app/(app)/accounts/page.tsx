"use client";

import { AccountsPage } from "@/components/pages/AccountsPage";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function Page() {
  return (
    <RoleGuard allow={["admin"]} fallback="/dashboard">
      <AccountsPage />
    </RoleGuard>
  );
}
