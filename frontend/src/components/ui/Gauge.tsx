interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
}

export function Gauge({
  value,
  max,
  label,
  unit,
  color = "var(--accent)",
}: GaugeProps) {
  const pct = Math.min(value / max, 1);
  return (
    <div className="text-center">
      {/* Arc baseline sits at y=70. The big number is anchored so its visual
          bottom lines up with y=70 — i.e. the number "rests" on the same line
          that closes the arc. The unit label lives below the arc in the
          extended viewBox (80 → 92). */}
      <svg width="100" height="92" viewBox="0 0 100 92">
        <path
          d="M 10 70 A 40 40 0 1 1 90 70"
          fill="none"
          stroke="var(--border)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 10 70 A 40 40 0 1 1 90 70"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${pct * 200} 300`}
        />
        <text
          x="50"
          y="70"
          textAnchor="middle"
          dominantBaseline="alphabetic"
          fill="var(--text)"
          fontSize="22"
          fontWeight="700"
          fontFamily="var(--font-sans)"
        >
          {value}
        </text>
        <text
          x="50"
          y="86"
          textAnchor="middle"
          dominantBaseline="alphabetic"
          fill="var(--text-muted)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          {unit}
        </text>
      </svg>
      <div className="mt-1 text-[11px] text-text-secondary">{label}</div>
    </div>
  );
}
