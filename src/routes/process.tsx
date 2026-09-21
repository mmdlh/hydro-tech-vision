import { createFileRoute } from "@tanstack/react-router";
import { EChart } from "@/components/water/EChart";
import { DataTable, Meter, Panel, PageHeader, StatusDot, Tag } from "@/components/water/ui";
import { baseOption, wave } from "@/lib/chart-theme";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "制水工艺监控 · 智慧水厂综合管控平台" },
      { name: "description", content: "加药混合池、絮凝沉淀池、V型滤池、清水池工艺状态流转与阀门水泵运行监控。" },
      { property: "og:title", content: "制水工艺监控 · 智慧水厂" },
      { property: "og:description", content: "四段工艺流转、加药剂量与沉淀效率比对分析。" },
    ],
  }),
  component: Process,
});

const STAGES = [
  { name: "加药混合池", kpi: [["PAC 投加", "18.2 mg/L"], ["搅拌转速", "68 rpm"], ["混合时间", "42 s"]], tone: "ok" as const, load: 72 },
  { name: "絮凝沉淀池", kpi: [["出水浊度", "2.1 NTU"], ["排泥周期", "45 min"], ["表面负荷", "6.8 m/h"]], tone: "ok" as const, load: 64 },
  { name: "V型滤池", kpi: [["滤速", "7.4 m/h"], ["水头损失", "1.42 m"], ["反冲洗", "3# 进行中"]], tone: "warn" as const, load: 88 },
  { name: "清水池", kpi: [["液位", "4.12 m"], ["余氯", "0.62 mg/L"], ["停留时间", "96 min"]], tone: "ok" as const, load: 58 },
];

const DEVICES = [
  { n: "1# 进水阀", s: "开 92%", t: "ok" as const },
  { n: "2# 进水阀", s: "开 85%", t: "ok" as const },
  { n: "加药泵 A", s: "运行 1450 rpm", t: "ok" as const },
  { n: "加药泵 B", s: "备用", t: "idle" },
  { n: "排泥阀 3#", s: "定时开启", t: "ok" as const },
  { n: "反冲洗泵", s: "运行 78%", t: "warn" as const },
  { n: "鼓风机 2#", s: "运行 42 Hz", t: "ok" as const },
  { n: "送水泵 4#", s: "故障停机", t: "danger" as const },
];

function Process() {
  const b = baseOption();
  const dose = {
    ...b,
    legend: { ...(b.legend as object), top: 10 },
    grid: { top: 56, left: 40, right: 48, bottom: 28, containLabel: true },
    xAxis: { type: "category", boundaryGap: true, data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"], axisLabel: { color: "#9fc6e0" } },
    yAxis: [
      { type: "value", name: "mg/L", ...(b.yAxis as object) },
      { type: "value", name: "效率 %", min: 80, max: 100, ...(b.yAxis as object), splitLine: { show: false } },
    ],
    series: [
      { name: "PAC 投加量", type: "bar", barWidth: 16, data: [16.2, 17.1, 18.4, 19.2, 18.6, 17.4], itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "次氯酸钠投加", type: "bar", barWidth: 16, data: [1.2, 1.3, 1.5, 1.6, 1.5, 1.4], itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "沉淀去除率", type: "line", yAxisIndex: 1, smooth: true, symbol: "circle", symbolSize: 6, data: [92.4, 93.1, 94.6, 95.8, 95.1, 94.2], lineStyle: { width: 3, color: "#10b981" } },
    ],
  };

  const flow = baseOption();
  const flowOption = {
    ...flow,
    legend: { ...(flow.legend as object), top: 10 },
    grid: { top: 56, left: 40, right: 32, bottom: 28, containLabel: true },
    xAxis: { ...(flow.xAxis as object), data: Array.from({ length: 12 }, (_, i) => `T-${11 - i}h`) },
    series: [
      { name: "进水流量 m³/h", type: "line", smooth: true, symbol: "none", data: wave(12, 4200, 260, 2), lineStyle: { width: 2 } },
      { name: "滤后流量 m³/h", type: "line", smooth: true, symbol: "none", data: wave(12, 4050, 240, 4), lineStyle: { width: 2 } },
      { name: "出厂流量 m³/h", type: "line", smooth: true, symbol: "none", data: wave(12, 3980, 220, 6), lineStyle: { width: 2 } },
    ],
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="制水工艺监控"
        desc="四段工艺串级联动 · PLC 采集点 1264 个 · 自动加药闭环投运"
        right={
          <div className="flex gap-2">
            <Tag tone="info">工艺模式：自动闭环</Tag>
            <Tag tone="warn">反冲洗进行中</Tag>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((s, i) => (
          <Panel key={s.name} title={s.name} subtitle={`工序 ${i + 1} · 串级联动`} scan>
            <div className="space-y-2">
              {s.kpi.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-md border border-border/60 bg-white/3 px-2 py-1.5 text-[11px]">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="glow-text font-display text-cyan">{v}</span>
                </div>
              ))}
              <Meter label="负荷率" value={s.load} tone={s.tone === "warn" ? "warn" : "cyan"} />
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <StatusDot tone={s.tone} /> {s.tone === "warn" ? "需关注" : "运行正常"}
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="加药剂量与沉淀效率比对" className="xl:col-span-2" subtitle="柱线混合 · 图例置顶">
          <EChart option={dose} height={320} />
        </Panel>
        <Panel title="阀门 / 水泵运行状态">
          <div className="grid grid-cols-2 gap-2">
            {DEVICES.map((d) => (
              <div key={d.n} className="glass rounded-lg p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold">{d.n}</span>
                  <StatusDot tone={d.t === "idle" ? "info" : (d.t as "ok" | "warn" | "danger")} />
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">{d.s}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="各工段流量平衡趋势">
          <EChart option={flowOption} height={300} />
        </Panel>
        <Panel title="工艺操作日志">
          <DataTable
            maxHeight={300}
            columns={["时间", "工段", "操作", "执行方式", "结果"]}
            rows={[
              ["08:40", "V型滤池 3#", "启动反冲洗", "自动", <Tag tone="warn">执行中</Tag>],
              ["08:12", "加药间", "PAC 投加量 +1.2 mg/L", "闭环调节", <Tag tone="ok">完成</Tag>],
              ["07:45", "沉淀池 2#", "排泥阀开启 90s", "定时", <Tag tone="ok">完成</Tag>],
              ["06:58", "清水池", "加氯设定值 0.65", "人工", <Tag tone="ok">完成</Tag>],
              ["06:10", "送水泵 4#", "紧急停机", "保护动作", <Tag tone="danger">异常</Tag>],
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
