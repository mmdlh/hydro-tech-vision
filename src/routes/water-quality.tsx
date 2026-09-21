import { createFileRoute } from "@tanstack/react-router";
import { EChart } from "@/components/water/EChart";
import { DataTable, Panel, PageHeader, StatusDot, Tag } from "@/components/water/ui";
import { baseOption, hours24, roundBase, wave } from "@/lib/chart-theme";

export const Route = createFileRoute("/water-quality")({
  head: () => ({
    meta: [
      { title: "水质在线监测 · 智慧水厂综合管控平台" },
      { name: "description", content: "原水、沉淀池、滤后水、出厂水多点位浊度、余氯、pH、溶解氧在线监测与异常告警。" },
      { property: "og:title", content: "水质在线监测 · 智慧水厂" },
      { property: "og:description", content: "四大点位水质指标矩阵、24小时趋势与达标雷达分析。" },
    ],
  }),
  component: WaterQuality,
});

const POINTS = [
  { name: "原水取水口", ntu: 12.8, cl: 0.0, ph: 7.42, o2: 7.9, tone: "warn" as const },
  { name: "絮凝沉淀池", ntu: 2.1, cl: 0.18, ph: 7.28, o2: 7.4, tone: "ok" as const },
  { name: "V型滤池出水", ntu: 0.28, cl: 0.41, ph: 7.21, o2: 7.1, tone: "ok" as const },
  { name: "出厂水", ntu: 0.12, cl: 0.62, ph: 7.18, o2: 6.9, tone: "ok" as const },
];

function WaterQuality() {
  const b = baseOption();
  const trend = {
    ...b,
    legend: { ...(b.legend as object), top: 10 },
    grid: { top: 56, left: 40, right: 32, bottom: 28, containLabel: true },
    xAxis: { ...(b.xAxis as object), data: hours24 },
    series: [
      { name: "浊度 NTU", type: "line", smooth: true, symbol: "none", data: wave(24, 0.3, 0.08, 1), lineStyle: { width: 2 } },
      { name: "余氯 mg/L", type: "line", smooth: true, symbol: "none", data: wave(24, 0.62, 0.09, 3), lineStyle: { width: 2 } },
      { name: "pH", type: "line", smooth: true, symbol: "none", data: wave(24, 7.2, 0.14, 5), lineStyle: { width: 2 } },
      { name: "溶解氧 mg/L", type: "line", smooth: true, symbol: "none", data: wave(24, 7.0, 0.5, 7), lineStyle: { width: 2 } },
    ],
  };

  const bars = baseOption();
  const compare = {
    ...bars,
    legend: { ...(bars.legend as object), top: 10 },
    grid: { top: 56, left: 40, right: 32, bottom: 28, containLabel: true },
    xAxis: { type: "category", boundaryGap: true, data: POINTS.map((p) => p.name), axisLabel: { color: "#9fc6e0", fontSize: 10 } },
    series: [
      { name: "浊度 NTU", type: "bar", barWidth: 14, data: POINTS.map((p) => p.ntu), itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "余氯 mg/L", type: "bar", barWidth: 14, data: POINTS.map((p) => p.cl), itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "溶解氧 mg/L", type: "bar", barWidth: 14, data: POINTS.map((p) => p.o2), itemStyle: { borderRadius: [4, 4, 0, 0] } },
    ],
  };

  const r = roundBase();
  const radar = {
    ...r,
    legend: { ...(r.legend as object), top: 10 },
    radar: {
      center: ["50%", "58%"],
      radius: "62%",
      indicator: [
        { name: "浊度", max: 100 },
        { name: "余氯", max: 100 },
        { name: "pH", max: 100 },
        { name: "溶解氧", max: 100 },
        { name: "菌落总数", max: 100 },
        { name: "耗氧量", max: 100 },
      ],
      axisName: { color: "#9fc6e0", fontSize: 11 },
      splitLine: { lineStyle: { color: "rgba(125,211,252,0.18)" } },
      splitArea: { areaStyle: { color: ["rgba(0,242,254,0.04)", "rgba(37,99,235,0.05)"] } },
      axisLine: { lineStyle: { color: "rgba(125,211,252,0.25)" } },
    },
    series: [
      {
        type: "radar",
        data: [
          { name: "出厂水达标度", value: [99, 98, 97, 95, 99, 96], areaStyle: { color: "rgba(0,242,254,0.25)" }, lineStyle: { color: "#00f2fe" }, itemStyle: { color: "#00f2fe" } },
          { name: "国标限值基线", value: [90, 90, 90, 90, 90, 90], areaStyle: { color: "rgba(16,185,129,0.15)" }, lineStyle: { color: "#10b981", type: "dashed" }, itemStyle: { color: "#10b981" } },
        ],
      },
    ],
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="水质在线监测"
        desc="4 个关键点位 · 16 项在线仪表 · 数据采集周期 30s"
        right={
          <div className="flex gap-2">
            <Tag tone="ok">
              <StatusDot tone="ok" /> 仪表在线 16/16
            </Tag>
            <Tag tone="warn">异常指标 2</Tag>
          </div>
        }
      />

      <Panel title="多点位水质指标对比矩阵" subtitle="国标 GB 5749-2022 限值比对">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.name} className="glass rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{p.name}</span>
                <StatusDot tone={p.tone} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                {[
                  ["浊度", `${p.ntu} NTU`],
                  ["余氯", `${p.cl} mg/L`],
                  ["pH", `${p.ph}`],
                  ["溶解氧", `${p.o2} mg/L`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-md border border-border/60 bg-white/3 px-2 py-1.5">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="glow-text font-display text-sm text-cyan">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="出厂水 24 小时多指标波动趋势" className="xl:col-span-2">
          <EChart option={trend} height={320} />
        </Panel>
        <Panel title="水质综合达标雷达">
          <EChart option={radar} height={320} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="点位指标横向比对">
          <EChart option={compare} height={300} />
        </Panel>
        <Panel title="异常指标告警记录">
          <DataTable
            maxHeight={300}
            columns={["时间", "点位", "指标", "实测值", "限值", "等级"]}
            rows={[
              ["08:42", "V型滤池 3#", "浊度", "0.32 NTU", "0.30", <Tag tone="warn">橙色</Tag>],
              ["07:20", "原水取水口", "浊度", "12.8 NTU", "10.0", <Tag tone="info">黄色</Tag>],
              ["05:04", "沉淀池 2#", "余氯", "0.14 mg/L", "0.15", <Tag tone="info">黄色</Tag>],
              ["02:35", "出厂水", "pH", "7.18", "6.5~8.5", <Tag tone="ok">正常</Tag>],
              ["01:12", "滤后水", "溶解氧", "6.4 mg/L", "≥6.0", <Tag tone="ok">正常</Tag>],
              ["00:08", "原水取水口", "耗氧量", "3.6 mg/L", "3.0", <Tag tone="warn">橙色</Tag>],
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
