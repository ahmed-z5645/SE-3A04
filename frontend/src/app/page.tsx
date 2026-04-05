"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Root landing: once the AuthContext finishes reading localStorage, route
 * the visitor to the right entry point for their role. Nothing is rendered
 * because the redirect fires immediately — keeping this page empty avoids a
 * flash of placeholder content during the client-side hydration round-trip.
 */
export default function Home() {
  const router = useRouter();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!role) {
      router.replace("/login");
    } else if (role === "public") {
      router.replace("/overview");
    } else {
      router.replace("/dashboard");
    }
  }, [loading, role, router]);

  return null;
}
