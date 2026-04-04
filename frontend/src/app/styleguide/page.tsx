import {
  Badge,
  Button,
  Card,
  Gauge,
  Icon,
  Input,
  Label,
  Select,
  Sparkline,
  type IconName,
} from "@/components/ui";

const ICONS: IconName[] = [
  "logo",
  "alert",
  "map",
  "chart",
  "user",
  "settings",
  "search",
  "bell",
  "check",
  "x",
  "chevron",
  "plus",
  "logout",
  "shield",
  "database",
  "ranking",
  "wind",
  "thermometer",
  "droplet",
  "volume",
  "file",
  "clock",
  "edit",
  "trash",
  "archive",
];

const SPARK = [42, 45, 48, 51, 47, 42, 38, 41, 44, 42];

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">Styleguide</h1>
        <p className="mt-2 text-text-secondary">
          Design system primitives — visual QA against prototype.
        </p>
      </header>

      {/* ── Colors ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">
          Color Tokens
        </h2>
        <div className="grid grid-cols-6 gap-3">
          {[
            { name: "bg", className: "bg-bg" },
            { name: "bg-card", className: "bg-bg-card" },
            { name: "bg-hover", className: "bg-bg-hover" },
            { name: "border", className: "bg-border-default" },
            { name: "accent", className: "bg-accent" },
            { name: "success", className: "bg-success" },
            { name: "warning", className: "bg-warning" },
            { name: "error", className: "bg-error" },
            { name: "accent-bg", className: "bg-accent-bg" },
            { name: "success-bg", className: "bg-success-bg" },
            { name: "warning-bg", className: "bg-warning-bg" },
            { name: "error-bg", className: "bg-error-bg" },
          ].map((c) => (
            <div
              key={c.name}
              className="rounded-md border border-border-default p-3"
            >
              <div className={`h-12 rounded ${c.className}`} />
              <div className="mt-2 font-mono text-[11px] text-text-secondary">
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Typography ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">
          Typography
        </h2>
        <Card className="space-y-3">
          <div className="text-3xl font-bold tracking-[-0.04em]">
            H1 · text-3xl · 32px / 700
          </div>
          <div className="text-xl font-semibold tracking-[-0.02em]">
            H2 · text-xl · 20px / 600
          </div>
          <div className="text-base font-semibold tracking-[-0.01em]">
            H3 · text-base · 16px / 600
          </div>
          <div className="text-sm text-text">
            Body · text-sm · 14px — default paragraph text.
          </div>
          <div className="text-[13px] text-text-secondary">
            Label · 13px · secondary — form labels and helper text.
          </div>
          <div className="text-xs text-text-muted">
            Meta · text-xs · 12px · muted — timestamps and captions.
          </div>
          <div className="text-[11px] text-text-muted">
            Micro · 11px · muted — badge and legend copy.
          </div>
          <div className="font-mono text-[13px] text-text-secondary">
            Mono · Geist Mono · ALT-001 · AQI 105
          </div>
        </Card>
      </section>

      {/* ── Buttons ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">
          Buttons
        </h2>
        <Card className="flex flex-wrap items-center gap-3">
          <Button variant="primary">
            <Icon name="plus" size={14} /> Primary
          </Button>
          <Button>
            <Icon name="edit" size={14} /> Default
          </Button>
          <Button variant="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </Card>
      </section>

      {/* ── Badges ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">
          Badges
        </h2>
        <Card className="flex flex-wrap items-center gap-3">
          <Badge>default</Badge>
          <Badge variant="info">info</Badge>
          <Badge variant="success">success</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="error">error</Badge>
        </Card>
      </section>

      {/* ── Inputs ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">
          Inputs
        </h2>
        <Card className="grid grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="you@scemas.ca" />
          </div>
          <div>
            <Label>Role</Label>
            <Select defaultValue="operator">
              <option value="operator">Operator</option>
              <option value="admin">Administrator</option>
            </Select>
          </div>
        </Card>
      </section>

      {/* ── Sparkline & Gauge ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">
          Charts
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="mb-3 text-[13px] text-text-secondary">
              Sparkline (240×40)
            </div>
            <Sparkline
              data={SPARK}
              color="var(--warning)"
              width={240}
              height={40}
            />
          </Card>
          <Card>
            <div className="mb-3 text-[13px] text-text-secondary">
              Gauges
            </div>
            <div className="flex justify-around">
              <Gauge
                value={42}
                max={200}
                label="AQI"
                unit="AQI"
                color="var(--success)"
              />
              <Gauge
                value={18}
                max={45}
                label="Temp"
                unit="°C"
                color="var(--accent)"
              />
              <Gauge
                value={68}
                max={120}
                label="Noise"
                unit="dB"
                color="var(--warning)"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* ── Icons ── */}
      <section className="mb-16">
        <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">
          Icons
        </h2>
        <Card>
          <div className="grid grid-cols-8 gap-4">
            {ICONS.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-md border border-border-default p-3"
              >
                <Icon name={name} size={20} />
                <span className="font-mono text-[11px] text-text-muted">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
