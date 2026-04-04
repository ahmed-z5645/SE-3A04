"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Layout for every "inside the app" route — everything that should render
 * with the global Navbar and a valid session. Unauthenticated visitors are
 * redirected to /login. Login and create-account live outside this group
 * and keep their own standalone chrome.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (!loading && !role) router.replace("/login");
  }, [loading, role, router]);

  if (loading || !role) return null;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      {children}
    </div>
  );
}
