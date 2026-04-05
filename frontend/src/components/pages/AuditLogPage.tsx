"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { auditApi, type AuditLogEntry } from "@/lib/api";

export function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    void auditApi.listAuditLog().then((data) => {
      if (!cancelled) setEntries(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="py-8 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">Audit Log</h1>
        <p className="mt-1 text-text-secondary">
          System activity and change history
        </p>
      </header>

      <Card className="mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Time", "User", "Action", "Detail"].map((h) => (
                <th
                  key={h}
                  className="border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap border-b border-border-default px-4 py-3 font-mono text-xs text-text-secondary">
                  {e.time}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-xs">
                  {e.user}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] font-medium">
                  {e.action}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] text-text-secondary">
                  {e.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
