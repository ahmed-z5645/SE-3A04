"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Icon,
  Input,
  Label,
  Select,
} from "@/components/ui";
import { rulesApi, zonesApi, type Rule, type Zone } from "@/lib/api";

const METRICS = [
  { label: "Air Quality (AQI)", op: ">", unit: "" },
  { label: "Temperature (°C)", op: ">", unit: "°C" },
  { label: "Humidity (%)", op: "<", unit: "%" },
  { label: "Noise (dB)", op: ">", unit: " dB" },
] as const;

export function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [zone, setZone] = useState("All Zones");
  const [metricIdx, setMetricIdx] = useState(0);
  const [threshold, setThreshold] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([rulesApi.listRules(), zonesApi.listZones()]).then(
      ([r, z]) => {
        if (cancelled) return;
        setRules(r);
        setZones(z);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  function resetForm() {
    setName("");
    setZone("All Zones");
    setMetricIdx(0);
    setThreshold("");
  }

  async function handleCreate() {
    if (!name.trim() || !threshold.trim()) return;
    setSubmitting(true);
    const metric = METRICS[metricIdx];
    const condition = `${metric.label.split(" ")[0]} ${metric.op} ${threshold}${metric.unit}`;
    const created = await rulesApi.createRule({
      name: name.trim(),
      condition,
      zone,
    });
    setRules((prev) => [...prev, created]);
    resetForm();
    setShowCreate(false);
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    const ok = await rulesApi.deleteRule(id);
    if (ok) setRules((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="flex items-center justify-between py-8 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">Alert Rules</h1>
        <Button variant="primary" onClick={() => setShowCreate((v) => !v)}>
          <Icon name="plus" size={14} /> Create Rule
        </Button>
      </header>

      {showCreate && (
        <Card className="mb-4">
          <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
            New Alert Rule
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Rule Name</Label>
              <Input
                placeholder="e.g. High AQI Warning"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label>Zone</Label>
              <Select value={zone} onChange={(e) => setZone(e.target.value)}>
                <option>All Zones</option>
                {zones.map((z) => (
                  <option key={z.id}>{z.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Metric</Label>
              <Select
                value={metricIdx}
                onChange={(e) => setMetricIdx(Number(e.target.value))}
              >
                {METRICS.map((m, i) => (
                  <option key={m.label} value={i}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Threshold</Label>
              <Input
                type="number"
                placeholder="100"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => {
                setShowCreate(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create Rule"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ID", "Name", "Condition", "Zone", "Status", ""].map((h) => (
                <th
                  key={h || "actions"}
                  className="border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id}>
                <td className="border-b border-border-default px-4 py-3 font-mono text-xs">
                  {r.id}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px] font-medium">
                  {r.name}
                </td>
                <td className="border-b border-border-default px-4 py-3 font-mono text-xs">
                  {r.condition}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  {r.zone}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <Badge
                    variant={r.status === "active" ? "success" : "default"}
                  >
                    {r.status}
                  </Badge>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Edit rule"
                      className="text-text-muted hover:text-text"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete rule"
                      onClick={() => handleDelete(r.id)}
                      className="text-text-muted hover:text-error"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
