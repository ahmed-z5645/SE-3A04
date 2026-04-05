"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import type { Role } from "@/lib/api";

interface RoleGuardProps {
  allow: Role[];
  children: ReactNode;
  /** Where to send unauthorized visitors. Defaults to `/login`. */
  fallback?: string;
}

/**
 * Client-side gate for protected routes. While the auth context is still
 * reading localStorage it renders nothing to avoid a flash of protected UI.
 * Once loaded, unauthorized roles are redirected to `fallback`.
 *
 * This is defense in depth only — real authorization must also happen on
 * the backend. See SCEMAS-architecture.md §"RBAC" (SR-AC1).
 */
export function RoleGuard({
  allow,
  children,
  fallback = "/login",
}: RoleGuardProps) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!role || !allow.includes(role)) {
      router.replace(fallback);
    }
  }, [loading, role, allow, fallback, router]);

  if (loading) return null;
  if (!role || !allow.includes(role)) return null;
  return <>{children}</>;
}
