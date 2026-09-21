import { createFileRoute } from "@tanstack/react-router";
import { EChart } from "@/components/water/EChart";
import { DataTable, Panel, PageHeader, Meter, StatusDot, Tag } from "@/components/water/ui";
import { baseOption, roundBase, wave } from "@/lib/chart-theme";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "机电设备资产 · 智慧水厂综合管控平台" },
      { name: "description", content: "水泵电机健康度评分、振动温度频谱趋势、维保周期倒计时与故障工单管理。" },
      { property: "og:title", content: "机电设备资产 · 智慧水厂" },
      { property: "og:description", content: "设备健康度、振动频谱、维保倒计时与工单闭环。" },
    ],
  }),
  component: Equipment,
});

const gauge = (name: string, value: number, color: string) => {
  const r = roundBase();
  return {
    ...r,
    legend: { show: false },
    tooltip: { show: false },
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        radius: "92%",
        progress: { show: true, width: 10, itemStyle: { color } },
        axisLine: { lineStyle: { width: 10, color: [[1, "rgba(125,211,252,0.15)"]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { width: 4, itemStyle: { color } },
        anchor: { show: true, size: 8, itemStyle: { color } },
        title: { show: true, offsetCenter: [0, "72%"], color: "#9fc6e0", fontSize: 11 },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, "34%"],
          formatter: "{value}",
          color,
          fontSize: 22,
          fontFamily: "Orbitron",
        },
        data: [{ value, name }],
      },
    ],
  };
};

function Equipment() {
  const b = baseOption();
  const vib = {
    ...b,
    legend: { ...(b.legend as object), top: 10 },
    grid: { top: 56, left: 44, right: 32, bottom: 28, containLabel: true },
    xAxis: { ...(b.xAxis as object), data: Array.from({ length: 16 }, (_, i) => `${(i + 1) * 50}Hz`) },
    series: [
      { name: "1# 泵振动幅值", type: "line", smooth: true, symbol: "none", data: wave(16, 3.2, 1.4, 2), lineStyle: { width: 2 } },
      { name: "3# 泵振动幅值", type: "line", smooth: true, symbol: "none", data: wave(16, 4.6, 2.1, 5), lineStyle: { width: 2 } },
      { name: "报警阈值", type: "line", symbol: "none", data: Array(16).fill(7.5), lineStyle: { width: 1.5, type: "dashed", color: "#f43f5e" } },
    ],
  };

  const temp = baseOption();
  const tempOption = {
    ...temp,
    legend: { ...(temp.legend as object), top: 10 },
    grid: { top: 56, left: 44, right: 32, bottom: 28, containLabel: true },
    xAxis: { ...(temp.xAxis as object), data: Array.from({ length: 12 }, (_, i) => `T-${11 - i}h`) },
    yAxis: { type: "value", name: "℃", ...(temp.yAxis as object) },
    series: [
      { name: "轴承温度", type: "line", smooth: true, symbol: "none", data: wave(12, 62, 5, 3, 8), lineStyle: { width: 2 } },
      { name: "绕组温度", type: "line", smooth: true, symbol: "none", data: wave(12, 74, 4, 6, 6), lineStyle: { width: 2 } },
      { name: "环境温度", type: "line", smooth: true, symbol: "none", data: wave(12, 28, 2, 9), lineStyle: { width: 2 } },
    ],
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="机电设备资产"
        desc="在册设备 486 台 · 智能监测点 212 个 · 预测性维护模型已投运"
        right={
          <div className="flex gap-2">
            <Tag tone="ok">
              <StatusDot tone="ok" /> 完好率 96.2%
            </Tag>
            <Tag tone="danger">故障工单 3</Tag>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["1# 送水泵机组", 94, "#10b981"],
          ["2# 送水泵机组", 88, "#00f2fe"],
          ["3# 送水泵机组", 71, "#f59e0b"],
          ["4# 送水泵机组", 46, "#f43f5e"],
        ].map(([n, v, c]) => (
          <Panel key={n as string} title={n as string} subtitle="综合健康度评分">
            <EChart option={gauge(n as string, v as number, c as string)} height={200} />
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="振动频谱实时分析" subtitle="1#/3# 泵机组 · 阈值 7.5 mm/s">
          <EChart option={vib} height={300} />
        </Panel>
        <Panel title="温度趋势监测" subtitle="近 12 小时">
          <EChart option={tempOption} height={300} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="维保周期倒计时看板" subtitle="按到期紧急度排序">
          <div className="space-y-3">
            {[
              ["4# 送水泵 大修", 6, "danger"],
              ["3# 鼓风机 换油", 12, "warn"],
              ["变频柜 除尘", 21, "cyan"],
              ["1# 加药泵 校准", 34, "ok"],
              ["清水池 检修", 58, "ok"],
            ].map(([n, d, t]) => (
              <div key={n as string} className="glass rounded-lg p-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold">{n as string}</span>
                  <span className="glow-text font-display text-cyan">剩余 {d as number} 天</span>
                </div>
                <div className="mt-2">
                  <Meter label="周期完成度" value={100 - (d as number) * 1.6} tone={t as string} right={`${Math.round(100 - (d as number) * 1.6)}%`} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="设备故障工单状态" className="xl:col-span-2">
          <DataTable
            maxHeight={330}
            columns={["工单号", "设备", "故障描述", "等级", "责任人", "状态"]}
            rows={[
              ["WO-20260921-07", "4# 送水泵", "轴承温度超限、振动异常", <Tag tone="danger">紧急</Tag>, "李维修", "抢修中"],
              ["WO-20260921-05", "反冲洗泵", "机封渗漏", <Tag tone="warn">重要</Tag>, "王工", "待备件"],
              ["WO-20260920-12", "2# 鼓风机", "皮带松动异响", <Tag tone="warn">重要</Tag>, "赵工", "处理中"],
              ["WO-20260920-08", "PAC 加药泵 B", "流量计示值漂移", <Tag tone="info">一般</Tag>, "陈工", "待验收"],
              ["WO-20260919-21", "1# 进水阀", "开度反馈偏差 3%", <Tag tone="info">一般</Tag>, "刘工", "已完成"],
              ["WO-20260919-16", "配电柜 2#", "接触器触点烧蚀", <Tag tone="warn">重要</Tag>, "孙工", "已完成"],
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
