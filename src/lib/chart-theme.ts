import type { EChartsOption } from "echarts";

export const palette = [
  "#00f2fe",
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#a855f7",
  "#38bdf8",
];

const axisCommon = {
  axisLine: { lineStyle: { color: "rgba(125,211,252,0.35)" } },
  axisLabel: { color: "#9fc6e0", fontSize: 11 },
  splitLine: { lineStyle: { color: "rgba(125,211,252,0.12)", type: "dashed" as const } },
  axisTick: { show: false },
};

/**
 * Base option for cartesian charts.
 * Legend is ALWAYS pinned to the top (top: 10) with grid.top: 56 so it can
 * never overlap the plotting area. Spread this FIRST and put overrides LAST.
 */
export function baseOption(): EChartsOption {
  return {
    color: palette,
    textStyle: { color: "#cfe8f7", fontFamily: "Rajdhani, sans-serif" },
    legend: {
      top: 10,
      left: "center",
      icon: "roundRect",
      itemWidth: 10,
      itemHeight: 6,
      itemGap: 16,
      textStyle: { color: "#9fc6e0", fontSize: 11 },
    },
    grid: { top: 56, left: 48, right: 48, bottom: 32, containLabel: true },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(6,16,30,0.92)",
      borderColor: "rgba(0,242,254,0.35)",
      textStyle: { color: "#dff3ff", fontSize: 12 },
      axisPointer: { type: "cross", crossStyle: { color: "rgba(0,242,254,0.4)" } },
    },
    xAxis: { type: "category", boundaryGap: false, ...axisCommon },
    yAxis: { type: "value", ...axisCommon },
  };
}

/** Base for non-cartesian charts (pie / radar / gauge): no grid or axes. */
export function roundBase(): EChartsOption {
  return {
    color: palette,
    textStyle: { color: "#cfe8f7", fontFamily: "Rajdhani, sans-serif" },
    legend: {
      top: 10,
      left: "center",
      icon: "roundRect",
      itemWidth: 10,
      itemHeight: 6,
      textStyle: { color: "#9fc6e0", fontSize: 11 },
    },
    tooltip: {
      backgroundColor: "rgba(6,16,30,0.92)",
      borderColor: "rgba(0,242,254,0.35)",
      textStyle: { color: "#dff3ff", fontSize: 12 },
    },
  };
}

export const areaGradient = (from: string, to = "rgba(0,0,0,0)") => ({
  type: "linear" as const,
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: from },
    { offset: 1, color: to },
  ],
});

export const axisStyle = axisCommon;

export const hours24 = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

/** Deterministic pseudo-random series so SSR and client render identically. */
export function wave(n: number, base: number, amp: number, seed = 1, drift = 0) {
  return Array.from({ length: n }, (_, i) => {
    const v =
      base +
      Math.sin((i + seed * 3) / 2.2) * amp +
      Math.cos((i + seed) / 1.4) * amp * 0.45 +
      (i / n) * drift;
    return Number(v.toFixed(2));
  });
}
