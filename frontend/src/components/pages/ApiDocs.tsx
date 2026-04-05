"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { apiDocsApi, type ApiEndpoint } from "@/lib/api";

export function ApiDocs() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);

  useEffect(() => {
    let cancelled = false;
    void apiDocsApi.listApiEndpoints().then((data) => {
      if (!cancelled) setEndpoints(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="py-8 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">Public API</h1>
        <p className="mt-1 text-text-secondary">
          REST API documentation for third-party integrations
        </p>
      </header>

      <Card className="mb-4">
        <h3 className="mb-3 text-base font-semibold tracking-[-0.01em]">
          Base URL
        </h3>
        <div className="rounded-md border border-border-default bg-bg-hover px-3.5 py-2.5 font-mono text-[13px]">
          https://api.scemas.ca/v1
        </div>
        <div className="mt-3 text-[13px] text-text-secondary">
          All requests require an API key via the{" "}
          <code className="rounded-[3px] bg-bg-hover px-1 py-0.5 font-mono">
            X-API-Key
          </code>{" "}
          header. Rate limited to 100 requests per minute.
        </div>
      </Card>

      <Card className="mb-12">
        <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
          Endpoints
        </h3>
        <div className="flex flex-col gap-4">
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="rounded-md border border-border-default p-4"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-[4px] bg-success-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-success">
                  {ep.method}
                </span>
                <span className="font-mono text-[13px] font-medium">
                  {ep.path}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                {ep.desc}
              </p>

              <div className="mt-4">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  Example Request
                </div>
                <pre className="m-0 overflow-auto rounded-md border border-border-default bg-bg-hover p-3 font-mono text-xs leading-[1.6] text-text">
                  {ep.example}
                </pre>
              </div>

              <div className="mt-3">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  Example Response
                </div>
                <pre className="m-0 overflow-auto rounded-md border border-border-default bg-bg-hover p-3 font-mono text-xs leading-[1.6] text-text-secondary">
                  {ep.response}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
