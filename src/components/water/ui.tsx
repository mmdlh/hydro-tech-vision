import { useEffect, useRef, useState, type ReactNode } from "react";
import { EChart } from "./EChart";
import { areaGradient } from "@/lib/chart-theme";

export function Panel({
  title,
  subtitle,
  extra,
  children,
  className = "",
  scan = false,
}: {
  title?: string;
  subtitle?: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  scan?: boolean;
}) {
  return (
    <section className={`glass rounded-xl p-4 ${scan ? "scan-line" : ""} ${className}`}>
      {title && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground">
              <span className="h-3 w-[3px] rounded-full bg-cyan" />
              {title}
            </h3>
            {subtitle && <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>}
          </div>
          {extra && <div className="text-[11px] text-muted-foreground">{extra}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, desc, right }: { title: string; desc: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="glow-text font-display text-2xl font-bold tracking-wider text-cyan">{title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
      {right}
    </div>
  );
}

export function useCountUp(target: number, decimals = 0, duration = 1100) {
  const [val, setVal] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val.toFixed(decimals);
}

export function GlowNumber({
  value,
  decimals = 0,
  unit,
  tone = "cyan",
}: {
  value: number;
  decimals?: number;
  unit?: string;
  tone?: "cyan" | "ok" | "warn" | "danger" | "techblue";
}) {
  const shown = useCountUp(value, decimals);
  const toneClass = {
    cyan: "text-cyan",
    ok: "text-ok",
    warn: "text-warn",
    danger: "text-danger",
    techblue: "text-techblue",
  }[tone];
  return (
    <div className={`font-display text-3xl font-bold tabular-nums ${toneClass} glow-text`}>
      {shown}
      {unit && <span className="ml-1 text-xs font-medium text-muted-foreground">{unit}</span>}
    </div>
  );
}

export function Sparkline({ data, color = "#00f2fe", height = 42 }: { data: number[]; color?: string; height?: number }) {
  return (
    <EChart
      height={height}
      option={{
        animationDuration: 900,
        grid: { top: 4, bottom: 4, left: 2, right: 2 },
        xAxis: { type: "category", show: false, boundaryGap: false, data: data.map((_, i) => i) },
        yAxis: { type: "value", show: false, min: Math.min(...data) * 0.92, max: Math.max(...data) * 1.05 },
        tooltip: { show: false },
        series: [
          {
            type: "line",
            data,
            smooth: true,
            symbol: "none",
            lineStyle: { width: 2, color },
            areaStyle: { color: areaGradient(`${color}66`) },
          },
        ],
      }}
    />
  );
}

export function KpiCard({
  label,
  value,
  unit,
  decimals = 0,
  delta,
  tone = "cyan",
  spark,
}: {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  delta?: string;
  tone?: "cyan" | "ok" | "warn" | "danger" | "techblue";
  spark: number[];
}) {
  const sparkColor = { cyan: "#00f2fe", ok: "#10b981", warn: "#f59e0b", danger: "#f43f5e", techblue: "#2563eb" }[tone];
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start justify-between">
        <span className="text-[11px] tracking-wide text-muted-foreground">{label}</span>
        {delta && (
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-cyan">{delta}</span>
        )}
      </div>
      <div className="mt-2">
        <GlowNumber value={value} decimals={decimals} unit={unit} tone={tone} />
      </div>
      <Sparkline data={spark} color={sparkColor} />
    </div>
  );
}

const toneMap: Record<string, string> = {
  ok: "text-ok border-ok/40 bg-ok/10",
  warn: "text-warn border-warn/40 bg-warn/10",
  danger: "text-danger border-danger/40 bg-danger/10",
  info: "text-cyan border-cyan/40 bg-cyan/10",
  idle: "text-muted-foreground border-border bg-white/5",
};

export function Tag({ tone = "info", children }: { tone?: keyof typeof toneMap | string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] ${toneMap[tone] ?? toneMap.info}`}>
      {children}
    </span>
  );
}

export function StatusDot({ tone = "ok" }: { tone?: "ok" | "warn" | "danger" | "info" }) {
  const c = { ok: "text-ok", warn: "text-warn", danger: "text-danger", info: "text-cyan" }[tone];
  return <span className={`status-dot ${c}`} />;
}

export function DataTable({
  columns,
  rows,
  maxHeight = 280,
}: {
  columns: string[];
  rows: ReactNode[][];
  maxHeight?: number;
}) {
  return (
    <div className="overflow-auto rounded-lg border border-border/60" style={{ maxHeight }}>
      <table className="w-full min-w-full text-left text-xs">
        <thead className="sticky top-0 bg-[#0a1a2e]/95 backdrop-blur">
          <tr>
            {columns.map((c) => (
              <th key={c} className="whitespace-nowrap px-3 py-2 font-semibold text-cyan/90">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border/40 transition-colors hover:bg-cyan/5">
              {r.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-3 py-2 text-foreground/85">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Meter({ label, value, tone = "cyan", right }: { label: string; value: number; tone?: string; right?: string }) {
  const bar = { cyan: "bg-cyan", ok: "bg-ok", warn: "bg-warn", danger: "bg-danger", techblue: "bg-techblue" }[tone] ?? "bg-cyan";
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums text-foreground">{right ?? `${value}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.min(100, value)}%`, boxShadow: "0 0 12px currentColor" }} />
      </div>
    </div>
  );
}
