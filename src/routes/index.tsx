import { createFileRoute } from "@tanstack/react-router";
import { EChart } from "@/components/water/EChart";
import { DataTable, KpiCard, Meter, Panel, PageHeader, StatusDot, Tag } from "@/components/water/ui";
import { areaGradient, baseOption, hours24, roundBase, wave } from "@/lib/chart-theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "水厂综合大屏 · 智慧水厂综合管控平台" },
      { name: "description", content: "全厂供水量、水质达标率、吨水单耗与管网压力总览，含制水工艺流程与告警分布。" },
      { property: "og:title", content: "水厂综合大屏 · 智慧水厂" },
      { property: "og:description", content: "供水量、水质达标率、能耗单耗与告警分布一屏掌控。" },
    ],
  }),
  component: Overview,
});

const STAGES = [
  { name: "取水泵房", value: "12.4 万m³/h", tone: "ok" as const },
  { name: "加药混合", value: "PAC 18.2 mg/L", tone: "ok" as const },
  { name: "絮凝沉淀", value: "浊度 1.6 NTU", tone: "ok" as const },
  { name: "V型滤池", value: "滤速 7.4 m/h", tone: "warn" as const },
  { name: "清水池", value: "余氯 0.62 mg/L", tone: "ok" as const },
  { name: "二级泵房", value: "出厂压 0.42 MPa", tone: "ok" as const },
];

function Overview() {
  const supply = baseOption();
  const supplyOption = {
    ...supply,
    legend: { ...(supply.legend as object), top: 10 },
    grid: { top: 56, left: 40, right: 40, bottom: 28, containLabel: true },
    xAxis: { ...(supply.xAxis as object), data: hours24 },
    yAxis: [
      { type: "value", name: "万m³", ...(supply.yAxis as object) },
      { type: "value", name: "MPa", min: 0.2, max: 0.6, ...(supply.yAxis as object), splitLine: { show: false } },
    ],
    series: [
      {
        name: "供水量",
        type: "line",
        smooth: true,
        symbol: "none",
        data: wave(24, 9.6, 2.1, 2),
        lineStyle: { width: 3, color: "#00f2fe" },
        areaStyle: { color: areaGradient("rgba(0,242,254,0.35)") },
      },
      {
        name: "进水量",
        type: "line",
        smooth: true,
        symbol: "none",
        data: wave(24, 10.4, 2.3, 4),
        lineStyle: { width: 2, color: "#2563eb" },
        areaStyle: { color: areaGradient("rgba(37,99,235,0.28)") },
      },
      {
        name: "出厂压力",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        data: wave(24, 0.42, 0.04, 6),
        lineStyle: { width: 2, color: "#10b981", type: "dashed" },
      },
    ],
  };

  const radar = roundBase();
  const radarOption = {
    ...radar,
    legend: { ...(radar.legend as object), top: 10 },
    radar: {
      center: ["50%", "58%"],
      radius: "62%",
      indicator: [
        { name: "水质", max: 100 },
        { name: "工艺", max: 100 },
        { name: "设备", max: 100 },
        { name: "管网", max: 100 },
        { name: "能耗", max: 100 },
        { name: "安防", max: 100 },
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
          { name: "今日告警权重", value: [12, 8, 26, 18, 9, 4], areaStyle: { color: "rgba(244,63,94,0.28)" }, lineStyle: { color: "#f43f5e" }, itemStyle: { color: "#f43f5e" } },
          { name: "昨日告警权重", value: [18, 14, 20, 11, 15, 6], areaStyle: { color: "rgba(0,242,254,0.18)" }, lineStyle: { color: "#00f2fe" }, itemStyle: { color: "#00f2fe" } },
        ],
      },
    ],
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="水厂综合大屏"
        desc="全厂生产、水质、能耗与告警态势总览 · 数据刷新间隔 5s"
        right={
          <div className="flex gap-2 text-[11px]">
            <Tag tone="ok">
              <StatusDot tone="ok" /> 生产线 6/6 在线
            </Tag>
            <Tag tone="warn">滤池反冲洗中 1</Tag>
            <Tag tone="info">调度模式：自动</Tag>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="今日累计供水量 (万m³)" value={23.86} decimals={2} delta="+3.2%" spark={wave(20, 9.5, 1.6, 1)} />
        <KpiCard label="出厂水质达标率 (%)" value={99.6} decimals={1} tone="ok" delta="连续 128 天" spark={wave(20, 99.4, 0.3, 3)} />
        <KpiCard label="吨水综合电耗 (kWh/m³)" value={0.263} decimals={3} tone="techblue" delta="-1.8%" spark={wave(20, 0.26, 0.012, 5)} />
        <KpiCard label="出厂管网压力 (MPa)" value={0.42} decimals={2} tone="warn" delta="波动 ±0.03" spark={wave(20, 0.42, 0.03, 7)} />
      </div>

      <Panel title="制水工艺流程立体视图" subtitle="取水 → 加药混合 → 絮凝沉淀 → V型滤池 → 清水池 → 二级泵房出厂" scan>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {STAGES.map((s, i) => (
            <div
              key={s.name}
              className="glass relative rounded-lg border-cyan/25 p-3"
              style={{ transform: `perspective(700px) rotateX(6deg) translateY(${i % 2 ? 6 : 0}px)` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{s.name}</span>
                <StatusDot tone={s.tone} />
              </div>
              <div className="glow-text mt-2 font-display text-sm text-cyan">{s.value}</div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full animate-pulse bg-linear-to-r from-cyan via-techblue to-transparent" />
              </div>
              <span className="mt-2 block text-[10px] text-muted-foreground">工序 {i + 1} · 运行 {128 + i * 7} h</span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="供水量 / 进水量 / 出厂压力 多轴趋势" className="xl:col-span-2" subtitle="近 24 小时">
          <EChart option={supplyOption} height={320} />
        </Panel>
        <Panel title="全厂告警雷达分布" subtitle="按业务域加权统计">
          <EChart option={radarOption} height={320} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="关键指标达标进度">
          <div className="space-y-3">
            <Meter label="浊度合格率" value={99.8} tone="ok" right="99.8%" />
            <Meter label="余氯合格率" value={98.4} tone="cyan" right="98.4%" />
            <Meter label="供水计划完成度" value={87} tone="techblue" right="87%" />
            <Meter label="能耗预算使用" value={74} tone="warn" right="74%" />
            <Meter label="设备完好率" value={96.2} tone="ok" right="96.2%" />
          </div>
        </Panel>
        <Panel title="今日重点告警" className="xl:col-span-2">
          <DataTable
            columns={["时间", "区域", "内容", "等级", "状态"]}
            rows={[
              ["08:42:11", "V型滤池 3#", "滤后浊度上升至 0.32 NTU", <Tag tone="warn">橙色</Tag>, "处理中"],
              ["07:58:05", "二级泵房", "3# 泵电机轴承温度 78℃", <Tag tone="danger">红色</Tag>, "已派单"],
              ["06:31:47", "加药间", "PAC 储罐液位低于 20%", <Tag tone="warn">橙色</Tag>, "已补药"],
              ["05:12:03", "管网 DN800", "东区节点压力低于 0.26 MPa", <Tag tone="info">黄色</Tag>, "已恢复"],
              ["03:45:22", "配电室", "2# 进线功率因数 0.86", <Tag tone="info">黄色</Tag>, "观察中"],
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
