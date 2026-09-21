import { createFileRoute } from "@tanstack/react-router";
import { EChart } from "@/components/water/EChart";
import { DataTable, KpiCard, Meter, Panel, PageHeader, StatusDot, Tag } from "@/components/water/ui";
import { baseOption, hours24, wave } from "@/lib/chart-theme";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "管网输配调度 · 智慧水厂综合管控平台" },
      { name: "description", content: "城市供水管网分区压力监测、加压泵房流量扬程监控与重点节点压力预警。" },
      { property: "og:title", content: "管网输配调度 · 智慧水厂" },
      { property: "og:description", content: "管网拓扑、分区压力与泵房调度一体化监控。" },
    ],
  }),
  component: Pipeline,
});

const NODES = [
  { id: "出厂计量间", x: 8, y: 48, p: 0.42, tone: "ok" as const },
  { id: "北区加压站", x: 32, y: 18, p: 0.36, tone: "ok" as const },
  { id: "中心城区节点", x: 34, y: 62, p: 0.33, tone: "ok" as const },
  { id: "东区节点", x: 62, y: 34, p: 0.26, tone: "warn" as const },
  { id: "开发区高位池", x: 66, y: 78, p: 0.31, tone: "ok" as const },
  { id: "西南末梢", x: 88, y: 56, p: 0.21, tone: "danger" as const },
];

const LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
];

function Pipeline() {
  const b = baseOption();
  const pump = {
    ...b,
    legend: { ...(b.legend as object), top: 10 },
    grid: { top: 56, left: 44, right: 48, bottom: 28, containLabel: true },
    xAxis: { type: "category", boundaryGap: true, data: ["1#泵房", "2#泵房", "3#泵房", "4#泵房", "5#泵房"], axisLabel: { color: "#9fc6e0" } },
    yAxis: [
      { type: "value", name: "m³/h", ...(b.yAxis as object) },
      { type: "value", name: "扬程 m", min: 0, max: 60, ...(b.yAxis as object), splitLine: { show: false } },
    ],
    series: [
      { name: "瞬时流量", type: "bar", barWidth: 18, data: [1820, 1460, 980, 1240, 720], itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "额定流量", type: "bar", barWidth: 18, data: [2000, 1600, 1200, 1400, 900], itemStyle: { borderRadius: [4, 4, 0, 0], color: "rgba(37,99,235,0.55)" } },
      { name: "运行扬程", type: "line", yAxisIndex: 1, smooth: true, symbol: "circle", symbolSize: 7, data: [42, 38, 34, 36, 28], lineStyle: { width: 3, color: "#00f2fe" } },
    ],
  };

  const pressure = baseOption();
  const pressureOption = {
    ...pressure,
    legend: { ...(pressure.legend as object), top: 10 },
    grid: { top: 56, left: 44, right: 32, bottom: 28, containLabel: true },
    xAxis: { ...(pressure.xAxis as object), data: hours24 },
    yAxis: { type: "value", name: "MPa", min: 0.15, max: 0.5, ...(pressure.yAxis as object) },
    series: [
      { name: "北区", type: "line", smooth: true, symbol: "none", data: wave(24, 0.36, 0.03, 1), lineStyle: { width: 2 } },
      { name: "中心城区", type: "line", smooth: true, symbol: "none", data: wave(24, 0.33, 0.035, 3), lineStyle: { width: 2 } },
      { name: "东区", type: "line", smooth: true, symbol: "none", data: wave(24, 0.27, 0.04, 5), lineStyle: { width: 2 } },
      { name: "西南末梢", type: "line", smooth: true, symbol: "none", data: wave(24, 0.22, 0.03, 7), lineStyle: { width: 2 } },
    ],
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="管网输配调度"
        desc="6 座加压泵房 · 128 个压力监测点 · 分区计量 DMA 42 个"
        right={
          <div className="flex gap-2">
            <Tag tone="danger">
              <StatusDot tone="danger" /> 末梢压力偏低
            </Tag>
            <Tag tone="info">调度策略：夜间降压</Tag>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="管网瞬时总流量 (m³/h)" value={6240} delta="+2.4%" spark={wave(20, 6200, 180, 2)} />
        <KpiCard label="平均供水压力 (MPa)" value={0.31} decimals={2} tone="techblue" spark={wave(20, 0.31, 0.02, 4)} />
        <KpiCard label="夜间最小流量 (m³/h)" value={1180} tone="ok" delta="漏损可控" spark={wave(20, 1180, 90, 6)} />
        <KpiCard label="压力达标率 (%)" value={96.1} decimals={1} tone="warn" spark={wave(20, 96, 1.2, 8)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="城市供水管网拓扑与分区压力" className="xl:col-span-2" subtitle="节点颜色表示压力状态" scan>
          <div className="relative h-[330px] w-full overflow-hidden rounded-lg border border-border/60 bg-[#071626]">
            <svg className="absolute inset-0 h-full w-full">
              {LINKS.map(([a, b2], i) => {
                const n1 = NODES[a]!;
                const n2 = NODES[b2]!;
                return (
                  <line
                    key={i}
                    x1={`${n1.x}%`}
                    y1={`${n1.y}%`}
                    x2={`${n2.x}%`}
                    y2={`${n2.y}%`}
                    stroke="rgba(0,242,254,0.45)"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                  >
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.2s" repeatCount="indefinite" />
                  </line>
                );
              })}
            </svg>
            {NODES.map((n) => (
              <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                <div
                  className={`glass rounded-lg px-2.5 py-1.5 text-center ${
                    n.tone === "danger" ? "border-danger/50" : n.tone === "warn" ? "border-warn/50" : "border-cyan/40"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                    <StatusDot tone={n.tone} />
                    {n.id}
                  </div>
                  <div className="glow-text font-display text-sm text-cyan">{n.p} MPa</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="分区 DMA 漏损与供水指标">
          <div className="space-y-3">
            <Meter label="北区 漏损率" value={8.2} tone="ok" right="8.2%" />
            <Meter label="中心城区 漏损率" value={11.4} tone="cyan" right="11.4%" />
            <Meter label="东区 漏损率" value={16.8} tone="warn" right="16.8%" />
            <Meter label="开发区 漏损率" value={9.6} tone="ok" right="9.6%" />
            <Meter label="西南片区 漏损率" value={21.3} tone="danger" right="21.3%" />
            <Meter label="全网计量覆盖率" value={94} tone="techblue" right="94%" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="加压泵房流量与扬程监控" subtitle="柱线混合 · 图例置顶">
          <EChart option={pump} height={310} />
        </Panel>
        <Panel title="分区压力 24 小时波动">
          <EChart option={pressureOption} height={310} />
        </Panel>
      </div>

      <Panel title="重点节点压力波动预警">
        <DataTable
          maxHeight={260}
          columns={["节点", "管径", "当前压力", "阈值区间", "24h 波幅", "趋势", "状态"]}
          rows={[
            ["西南末梢 JD-31", "DN400", "0.21 MPa", "0.24 ~ 0.45", "±0.05", "下降", <Tag tone="danger">红色预警</Tag>],
            ["东区节点 JD-18", "DN800", "0.26 MPa", "0.26 ~ 0.48", "±0.04", "波动", <Tag tone="warn">橙色预警</Tag>],
            ["中心城区 JD-07", "DN1000", "0.33 MPa", "0.28 ~ 0.50", "±0.03", "平稳", <Tag tone="ok">正常</Tag>],
            ["北区加压站出口", "DN900", "0.36 MPa", "0.30 ~ 0.52", "±0.02", "平稳", <Tag tone="ok">正常</Tag>],
            ["开发区高位池进口", "DN600", "0.31 MPa", "0.28 ~ 0.46", "±0.03", "上升", <Tag tone="ok">正常</Tag>],
          ]}
        />
      </Panel>
    </div>
  );
}
