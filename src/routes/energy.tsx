import { createFileRoute } from "@tanstack/react-router";
import { EChart } from "@/components/water/EChart";
import { KpiCard, Meter, Panel, PageHeader, Tag, DataTable } from "@/components/water/ui";
import { baseOption, hours24, roundBase, wave } from "@/lib/chart-theme";

export const Route = createFileRoute("/energy")({
  head: () => ({
    meta: [
      { title: "能耗与碳排放 · 智慧水厂综合管控平台" },
      { name: "description", content: "全厂分区用电构成、吨水综合能耗、峰平谷时段优化与碳排放达标进度分析。" },
      { property: "og:title", content: "能耗与碳排放 · 智慧水厂" },
      { property: "og:description", content: "分区用电、吨水单耗、峰谷优化与碳排放指标追踪。" },
    ],
  }),
  component: Energy,
});

function Energy() {
  const r = roundBase();
  const pie = {
    ...r,
    legend: { ...(r.legend as object), top: 10, type: "scroll" },
    tooltip: { ...(r.tooltip as object), trigger: "item", formatter: "{b}: {c} kWh ({d}%)" },
    series: [
      {
        type: "pie",
        radius: ["44%", "70%"],
        center: ["50%", "60%"],
        itemStyle: { borderColor: "#06101e", borderWidth: 2 },
        label: { color: "#9fc6e0", fontSize: 11 },
        data: [
          { name: "二级泵房", value: 18420 },
          { name: "取水泵房", value: 9240 },
          { name: "加药与消毒", value: 2180 },
          { name: "反冲洗系统", value: 3160 },
          { name: "污泥处理", value: 2740 },
          { name: "照明与辅助", value: 1480 },
        ],
      },
    ],
  };

  const b = baseOption();
  const unit = {
    ...b,
    legend: { ...(b.legend as object), top: 10 },
    grid: { top: 56, left: 44, right: 48, bottom: 28, containLabel: true },
    xAxis: { type: "category", boundaryGap: true, data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月"], axisLabel: { color: "#9fc6e0" } },
    yAxis: [
      { type: "value", name: "kWh/m³", ...(b.yAxis as object) },
      { type: "value", name: "同比 %", min: -15, max: 15, ...(b.yAxis as object), splitLine: { show: false } },
    ],
    series: [
      { name: "吨水综合电耗", type: "bar", barWidth: 16, data: [0.282, 0.279, 0.274, 0.271, 0.268, 0.272, 0.276, 0.269, 0.263], itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "标杆值", type: "bar", barWidth: 16, data: Array(9).fill(0.27), itemStyle: { borderRadius: [4, 4, 0, 0], color: "rgba(37,99,235,0.5)" } },
      { name: "同比变化", type: "line", yAxisIndex: 1, smooth: true, symbol: "circle", symbolSize: 6, data: [2.1, 1.4, -0.6, -1.8, -2.6, -1.2, 0.4, -2.2, -3.1], lineStyle: { width: 3, color: "#10b981" } },
    ],
  };

  const p = baseOption();
  const peak = {
    ...p,
    legend: { ...(p.legend as object), top: 10 },
    grid: { top: 56, left: 44, right: 32, bottom: 28, containLabel: true },
    xAxis: { type: "category", boundaryGap: true, data: hours24, axisLabel: { color: "#9fc6e0", fontSize: 10 } },
    yAxis: { type: "value", name: "kW", ...(p.yAxis as object) },
    series: [
      { name: "实际负荷", type: "bar", data: wave(24, 1600, 380, 2), itemStyle: { borderRadius: [3, 3, 0, 0] } },
      { name: "优化后负荷", type: "line", smooth: true, symbol: "none", data: wave(24, 1520, 250, 5), lineStyle: { width: 2.5, color: "#10b981" } },
      { name: "电价系数", type: "line", smooth: true, symbol: "none", data: wave(24, 1.0, 0.35, 8).map((v) => v * 900), lineStyle: { width: 2, type: "dashed", color: "#f59e0b" } },
    ],
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="能耗与碳排放"
        desc="分项计量回路 64 条 · 峰平谷优化策略每 15 分钟滚动计算"
        right={
          <div className="flex gap-2">
            <Tag tone="ok">碳排强度同比 -6.4%</Tag>
            <Tag tone="info">今日已避峰 2.4 万 kWh</Tag>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="今日用电量 (万kWh)" value={3.72} decimals={2} spark={wave(20, 3.7, 0.22, 1)} />
        <KpiCard label="吨水综合电耗 (kWh/m³)" value={0.263} decimals={3} tone="ok" delta="优于标杆" spark={wave(20, 0.265, 0.008, 3)} />
        <KpiCard label="今日碳排放 (tCO₂e)" value={21.4} decimals={1} tone="techblue" spark={wave(20, 21.5, 1.1, 5)} />
        <KpiCard label="峰时用电占比 (%)" value={18.6} decimals={1} tone="warn" delta="目标 ≤20%" spark={wave(20, 19, 1.4, 7)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="全厂用电分区构成" subtitle="环形占比 · 今日累计">
          <EChart option={pie} height={320} />
        </Panel>
        <Panel title="吨水综合能耗与同比" className="xl:col-span-2" subtitle="柱线混合 · 图例置顶">
          <EChart option={unit} height={320} />
        </Panel>
      </div>

      <Panel title="峰平谷用电时段优化分析" subtitle="蓄水调度错峰策略模拟">
        <EChart option={peak} height={320} />
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="碳排放指标达标进度">
          <div className="space-y-3">
            <Meter label="年度碳排放配额使用" value={68} tone="ok" right="68%" />
            <Meter label="单位供水碳强度下降目标" value={82} tone="cyan" right="82%" />
            <Meter label="光伏绿电替代率" value={14.6} tone="techblue" right="14.6%" />
            <Meter label="变频节能改造覆盖" value={76} tone="ok" right="76%" />
            <Meter label="峰时负荷压降目标" value={58} tone="warn" right="58%" />
          </div>
        </Panel>
        <Panel title="分项能耗与节能潜力" className="xl:col-span-2">
          <DataTable
            maxHeight={300}
            columns={["分项", "今日用电", "占比", "吨水单耗", "同比", "节能潜力"]}
            rows={[
              ["二级泵房", "18,420 kWh", "49.5%", "0.132", "-2.8%", <Tag tone="ok">高</Tag>],
              ["取水泵房", "9,240 kWh", "24.8%", "0.066", "-1.2%", <Tag tone="ok">中</Tag>],
              ["反冲洗系统", "3,160 kWh", "8.5%", "0.022", "+3.4%", <Tag tone="warn">高</Tag>],
              ["污泥处理", "2,740 kWh", "7.4%", "0.019", "+0.8%", <Tag tone="info">中</Tag>],
              ["加药与消毒", "2,180 kWh", "5.9%", "0.015", "-0.4%", <Tag tone="info">低</Tag>],
              ["照明与辅助", "1,480 kWh", "3.9%", "0.010", "-5.1%", <Tag tone="ok">低</Tag>],
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
