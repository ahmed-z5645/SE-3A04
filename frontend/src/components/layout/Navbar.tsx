"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Badge, Button, Icon, cn } from "@/components/ui";
import type { Role } from "@/lib/api";

interface NavLink {
  href: string;
  label: string;
}

const LINKS_BY_ROLE: Record<Role, NavLink[]> = {
  admin: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/alerts", label: "Alerts" },
    { href: "/rules", label: "Rules" },
    { href: "/sensors", label: "Sensors" },
    { href: "/rankings", label: "Rankings" },
    { href: "/accounts", label: "Accounts" },
    { href: "/audit", label: "Audit Log" },
  ],
  operator: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/alerts", label: "Alerts" },
    { href: "/sensors", label: "Sensors" },
    { href: "/rankings", label: "Rankings" },
    { href: "/account/edit", label: "Account" },
  ],
  public: [
    { href: "/overview", label: "Overview" },
    { href: "/rankings", label: "Rankings" },
    { href: "/api-docs", label: "API" },
  ],
};

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, signOut } = useAuth();

  // If the context hasn't finished loading, the layout guard renders nothing
  // above us so we should only reach here with a real role.
  if (!role) return null;

  const links = LINKS_BY_ROLE[role];
  const isAuthed = role !== "public";
  const homeHref = role === "public" ? "/overview" : "/dashboard";

  function handleLogout() {
    signOut();
    router.replace("/login");
  }

  return (
    <nav
      className="sticky top-0 z-[100] flex items-center justify-between border-b border-border-default px-6 py-4 backdrop-blur-xl"
      // Prototype uses rgba(0,0,0,0.8); keeping it inline here because it's a
      // one-off translucent override we don't want to pollute the token set.
      style={{ background: "rgba(0,0,0,0.8)" }}
    >
      <div className="flex items-center gap-6">
        <Link
          href={homeHref}
          className="flex cursor-pointer items-center gap-2 text-base font-bold tracking-[-0.02em]"
        >
          <Icon name="logo" size={20} />
          <span>SCEMAS</span>
          {isAuthed && (
            <Badge
              variant={role === "admin" ? "info" : "default"}
              className="ml-1"
            >
              {role}
            </Badge>
          )}
        </Link>
        <div className="ml-4 flex gap-4">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "cursor-pointer border-b py-1 text-[13px] transition-all",
                  active
                    ? "border-text text-text"
                    : "border-transparent text-text-secondary hover:text-text"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isAuthed && (
          <>
            <Link
              href="/alerts"
              className="relative cursor-pointer text-text-secondary hover:text-text"
              aria-label="Alerts"
            >
              <Icon name="bell" size={16} />
              {/* Unread indicator — once we're polling /alerts/active this
                  will become conditional on the live count. */}
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-error" />
            </Link>
            <Link
              href="/account/edit"
              className="text-text-secondary hover:text-text"
              aria-label="Account"
            >
              <Icon name="user" size={16} />
            </Link>
          </>
        )}
        <Button onClick={handleLogout}>
          <Icon name="logout" size={14} />
          {isAuthed ? "Logout" : "Sign In"}
        </Button>
      </div>
    </nav>
  );
}
