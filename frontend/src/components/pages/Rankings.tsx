"use client";

import { useEffect, useState } from "react";
import { Button, Card, Icon, Input, cn } from "@/components/ui";
import { rankingsApi, type City, type RankingSort } from "@/lib/api";

const SORTS: { key: RankingSort; label: string }[] = [
  { key: "aqi", label: "AQI" },
  { key: "temp", label: "Temp" },
  { key: "noise", label: "Noise" },
  { key: "humidity", label: "Humidity" },
];

export function Rankings() {
  const [sortBy, setSortBy] = useState<RankingSort>("aqi");
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    let cancelled = false;
    void rankingsApi.listRankings(sortBy, search).then((data) => {
      if (!cancelled) setCities(data);
    });
    return () => {
      cancelled = true;
    };
  }, [sortBy, search]);

  function aqiColor(aqi: number) {
    if (aqi < 35) return "var(--success)";
    if (aqi < 55) return "var(--warning)";
    return "var(--error)";
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="py-8 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">
          City Rankings
        </h1>
        <p className="mt-1 text-text-secondary">
          Environmental quality rankings across Canadian cities
        </p>
      </header>

      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Icon
            name="search"
            size={14}
            color="var(--text-muted)"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          />
          <Input
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {SORTS.map((s) => (
            <Button
              key={s.key}
              variant={sortBy === s.key ? "primary" : "default"}
              onClick={() => setSortBy(s.key)}
              className="text-xs"
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted">
                #
              </th>
              <th className="border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted">
                City
              </th>
              {SORTS.map((s) => (
                <th
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className="cursor-pointer border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted"
                >
                  {s.label} {sortBy === s.key && "↑"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map((c, i) => (
              <tr key={c.name}>
                <td
                  className={cn(
                    "border-b border-border-default px-4 py-3 text-[13px] font-semibold",
                    i < 3 ? "text-accent" : "text-text-secondary"
                  )}
                >
                  {i + 1}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] font-medium">
                  {c.name}
                </td>
                <td className="border-b border-border-default px-4 py-3 font-mono text-[13px]">
                  <span style={{ color: aqiColor(c.aqi) }}>{c.aqi}</span>
                </td>
                <td className="border-b border-border-default px-4 py-3 font-mono text-[13px]">
                  {c.temp}°C
                </td>
                <td className="border-b border-border-default px-4 py-3 font-mono text-[13px]">
                  {c.noise} dB
                </td>
                <td className="border-b border-border-default px-4 py-3 font-mono text-[13px]">
                  {c.humidity}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="h-12" />
    </div>
  );
}
