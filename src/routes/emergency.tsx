import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EChart } from "@/components/water/EChart";
import { DataTable, Panel, PageHeader, StatusDot, Tag } from "@/components/water/ui";
import { baseOption, hours24, wave } from "@/lib/chart-theme";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "预警与应急指挥 · 智慧水厂综合管控平台" },
      { name: "description", content: "红橙黄多级警报看板、实时告警流水、应急预案流转与值班人员通讯录。" },
      { property: "og:title", content: "预警与应急指挥 · 智慧水厂" },
      { property: "og:description", content: "多级警报、一键调度与应急预案闭环管理。" },
    ],
  }),
  component: Emergency,
});

type Level = "红色" | "橙色" | "黄色";

const ALARMS: { t: string; area: string; msg: string; lv: Level; st: string }[] = [
  { t: "08:52:14", area: "4# 送水泵", msg: "轴承温度 82℃ 超限停机", lv: "红色", st: "抢修中" },
  { t: "08:42:11", area: "V型滤池 3#", msg: "滤后浊度 0.32 NTU 超标", lv: "橙色", st: "处理中" },
  { t: "08:20:37", area: "西南末梢", msg: "节点压力 0.21 MPa 低于下限", lv: "红色", st: "调度中" },
  { t: "07:58:05", area: "二级泵房", msg: "3# 电机振动 7.8 mm/s", lv: "橙色", st: "已派单" },
  { t: "07:31:47", area: "加药间", msg: "PAC 储罐液位 18%", lv: "橙色", st: "已补药" },
  { t: "06:44:02", area: "配电室", msg: "2# 进线功率因数 0.86", lv: "黄色", st: "观察中" },
  { t: "05:12:03", area: "原水取水口", msg: "原水浊度突增至 12.8 NTU", lv: "黄色", st: "已恢复" },
  { t: "03:22:55", area: "污泥车间", msg: "脱水机电流波动", lv: "黄色", st: "已恢复" },
];

const PLAN = [
  { s: "告警确认", d: "中控值班员 60s 内确认", ok: true },
  { s: "分级响应", d: "红色告警启动 II 级响应", ok: true },
  { s: "现场处置", d: "抢修班组 15 分钟到位", ok: true },
  { s: "调度联动", d: "切换 2#/5# 泵组补压", ok: false },
  { s: "复盘归档", d: "生成事件报告并归档", ok: false },
];

const CONTACTS = [
  ["厂长值班", "陈厂长", "甲班", "13800000001"],
  ["中控调度", "张工", "甲班", "13800000002"],
  ["机电抢修", "李维修", "在岗", "13800000003"],
  ["水质化验", "王化验", "在岗", "13800000004"],
  ["管网巡检", "赵巡检", "外勤", "13800000005"],
];

function Emergency() {
  const [filter, setFilter] = useState<"全部" | Level>("全部");
  const [dispatched, setDispatched] = useState<string[]>([]);

  const rows = useMemo(
    () => ALARMS.filter((a) => filter === "全部" || a.lv === filter),
    [filter],
  );

  const b = baseOption();
  const trend = {
    ...b,
    legend: { ...(b.legend as object), top: 10 },
    grid: { top: 56, left: 44, right: 32, bottom: 28, containLabel: true },
    xAxis: { ...(b.xAxis as object), data: hours24 },
    yAxis: { type: "value", name: "条", ...(b.yAxis as object) },
    series: [
      { name: "红色告警", type: "bar", stack: "a", data: wave(24, 0.6, 0.5, 1).map((v) => Math.max(0, Math.round(v))), itemStyle: { color: "#f43f5e" } },
      { name: "橙色告警", type: "bar", stack: "a", data: wave(24, 1.6, 1.1, 3).map((v) => Math.max(0, Math.round(v))), itemStyle: { color: "#f59e0b" } },
      { name: "黄色告警", type: "bar", stack: "a", data: wave(24, 2.6, 1.6, 5).map((v) => Math.max(0, Math.round(v))), itemStyle: { color: "#00f2fe" } },
      { name: "告警总量趋势", type: "line", smooth: true, symbol: "none", data: wave(24, 5, 2.2, 7), lineStyle: { width: 2.5, color: "#2563eb" } },
    ],
  };

  const levelTone = (lv: Level) => (lv === "红色" ? "danger" : lv === "橙色" ? "warn" : "info");

  return (
    <div className="space-y-4">
      <PageHeader
        title="预警与应急指挥"
        desc="多级警报联动 · 应急预案 12 套 · 值班人员 24h 在线"
        right={
          <div className="flex gap-2">
            <Tag tone="danger">
              <StatusDot tone="danger" /> II 级响应中
            </Tag>
            <Tag tone="info">今日告警 34 条</Tag>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["红色警报", 2, "danger", "立即处置 · 已启动应急响应"],
          ["橙色警报", 3, "warn", "限时处置 · 30 分钟内闭环"],
          ["黄色警报", 2, "info", "跟踪观察 · 班中复核"],
        ].map(([n, c, tone, d]) => (
          <div key={n as string} className={`glass scan-line rounded-xl p-4 border-${tone as string}/40`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">{n as string}</span>
              <StatusDot tone={tone as "danger" | "warn" | "info"} />
            </div>
            <div
              className={`glow-text mt-2 font-display text-4xl font-bold ${
                tone === "danger" ? "text-danger" : tone === "warn" ? "text-warn" : "text-cyan"
              }`}
            >
              {c as number}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{d as string}</p>
          </div>
        ))}
      </div>

      <Panel title="24 小时告警强度分布" subtitle="分级堆叠 + 总量趋势 · 图例置顶">
        <EChart option={trend} height={300} />
      </Panel>

      <Panel
        title="实时告警流水"
        subtitle="支持等级筛选与一键调度"
        extra={
          <div className="flex gap-1">
            {(["全部", "红色", "橙色", "黄色"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                  filter === f ? "border-cyan/60 bg-cyan/15 text-cyan" : "border-border text-muted-foreground hover:text-cyan"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <DataTable
          maxHeight={320}
          columns={["时间", "区域", "告警内容", "等级", "状态", "操作"]}
          rows={rows.map((a) => [
            a.t,
            a.area,
            a.msg,
            <Tag tone={levelTone(a.lv)}>{a.lv}</Tag>,
            dispatched.includes(a.t) ? "已调度" : a.st,
            <button
              onClick={() => setDispatched((d) => (d.includes(a.t) ? d : [...d, a.t]))}
              className="rounded-md border border-cyan/40 bg-cyan/10 px-2 py-0.5 text-[11px] text-cyan transition-colors hover:bg-cyan/20"
            >
              {dispatched.includes(a.t) ? "已派单" : "一键调度"}
            </button>,
          ])}
        />
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="应急预案流转" subtitle="事件：4# 送水泵超温停机">
          <ol className="space-y-3">
            {PLAN.map((p, i) => (
              <li key={p.s} className="flex gap-3">
                <span
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border font-display text-[11px] ${
                    p.ok ? "border-ok/50 bg-ok/15 text-ok" : "border-border bg-white/5 text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="glass flex-1 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    {p.s}
                    <Tag tone={p.ok ? "ok" : "idle"}>{p.ok ? "已完成" : "进行中"}</Tag>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="排班人员通讯录" subtitle="2026-09-21 甲班">
          <DataTable
            maxHeight={320}
            columns={["岗位", "姓名", "状态", "联系电话", "呼叫"]}
            rows={CONTACTS.map((c) => [
              c[0],
              c[1],
              <Tag tone={c[2] === "外勤" ? "warn" : "ok"}>{c[2]}</Tag>,
              c[3],
              <a href={`tel:${c[3]}`} className="text-cyan underline-offset-2 hover:underline">
                拨号
              </a>,
            ])}
          />
        </Panel>
      </div>
    </div>
  );
}
