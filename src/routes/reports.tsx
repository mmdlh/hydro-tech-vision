import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EChart } from "@/components/water/EChart";
import { DataTable, KpiCard, Panel, PageHeader, Tag } from "@/components/water/ui";
import { baseOption, wave } from "@/lib/chart-theme";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "综合运营报表 · 智慧水厂综合管控平台" },
      { name: "description", content: "月度季度供水报表、产销差率统计、自定义日期筛选与 CSV/Excel 数据导出。" },
      { property: "og:title", content: "综合运营报表 · 智慧水厂" },
      { property: "og:description", content: "供水量、售水量、产销差率与能耗成本统计报表导出。" },
    ],
  }),
  component: Reports,
});

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月"];
const SUPPLY = [712, 668, 724, 736, 781, 812, 846, 838, 796];
const SOLD = [642, 604, 658, 669, 706, 731, 758, 752, 719];

function Reports() {
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-09-21");
  const [gran, setGran] = useState<"月度" | "季度">("月度");
  const [msg, setMsg] = useState("");

  const table = useMemo(
    () =>
      MONTHS.map((m, i) => {
        const loss = ((SUPPLY[i]! - SOLD[i]!) / SUPPLY[i]!) * 100;
        return {
          period: gran === "月度" ? `2026-${String(i + 1).padStart(2, "0")}` : `2026 Q${Math.floor(i / 3) + 1}`,
          label: m,
          supply: SUPPLY[i]!,
          sold: SOLD[i]!,
          loss: Number(loss.toFixed(2)),
          energy: Number((0.28 - i * 0.002).toFixed(3)),
          cost: Number((SUPPLY[i]! * 1.36).toFixed(1)),
        };
      }),
    [gran],
  );

  const exportData = (kind: "CSV" | "Excel") => {
    const header = ["期间", "供水量(万m³)", "售水量(万m³)", "产销差率(%)", "吨水电耗(kWh/m³)", "制水成本(万元)"];
    const csv = [header, ...table.map((r) => [r.period, r.supply, r.sold, r.loss, r.energy, r.cost])]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `水厂运营报表_${from}_${to}.${kind === "CSV" ? "csv" : "xls"}`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg(`${kind} 导出完成：${from} 至 ${to} · ${gran}口径 · ${table.length} 条记录`);
  };

  const b = baseOption();
  const mix = {
    ...b,
    legend: { ...(b.legend as object), top: 10 },
    grid: { top: 56, left: 48, right: 48, bottom: 28, containLabel: true },
    xAxis: { type: "category", boundaryGap: true, data: MONTHS, axisLabel: { color: "#9fc6e0" } },
    yAxis: [
      { type: "value", name: "万m³", ...(b.yAxis as object) },
      { type: "value", name: "产销差 %", min: 8, max: 14, ...(b.yAxis as object), splitLine: { show: false } },
    ],
    series: [
      { name: "供水量", type: "bar", barWidth: 16, data: SUPPLY, itemStyle: { borderRadius: [4, 4, 0, 0] } },
      { name: "售水量", type: "bar", barWidth: 16, data: SOLD, itemStyle: { borderRadius: [4, 4, 0, 0], color: "rgba(37,99,235,0.7)" } },
      {
        name: "产销差率",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        data: table.map((r) => r.loss),
        lineStyle: { width: 3, color: "#10b981" },
      },
    ],
  };

  const c = baseOption();
  const cost = {
    ...c,
    legend: { ...(c.legend as object), top: 10 },
    grid: { top: 56, left: 48, right: 32, bottom: 28, containLabel: true },
    xAxis: { ...(c.xAxis as object), data: MONTHS },
    series: [
      { name: "制水成本 万元", type: "line", smooth: true, symbol: "none", data: table.map((r) => r.cost), lineStyle: { width: 2.5 } },
      { name: "药剂成本 万元", type: "line", smooth: true, symbol: "none", data: wave(9, 146, 12, 3), lineStyle: { width: 2 } },
      { name: "电费 万元", type: "line", smooth: true, symbol: "none", data: wave(9, 318, 24, 6), lineStyle: { width: 2 } },
    ],
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="综合运营报表"
        desc="月度 / 季度供水运营统计 · 支持自定义区间与数据导出"
        right={
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md border border-border bg-white/5 px-2 py-1 text-foreground"
            />
            <span className="text-muted-foreground">至</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md border border-border bg-white/5 px-2 py-1 text-foreground"
            />
            {(["月度", "季度"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGran(g)}
                className={`rounded-md border px-2 py-1 transition-colors ${
                  gran === g ? "border-cyan/60 bg-cyan/15 text-cyan" : "border-border text-muted-foreground hover:text-cyan"
                }`}
              >
                {g}
              </button>
            ))}
            <button
              onClick={() => exportData("CSV")}
              className="rounded-md border border-cyan/50 bg-cyan/10 px-3 py-1 text-cyan transition-colors hover:bg-cyan/20"
            >
              导出 CSV
            </button>
            <button
              onClick={() => exportData("Excel")}
              className="rounded-md border border-techblue/50 bg-techblue/15 px-3 py-1 text-foreground transition-colors hover:bg-techblue/25"
            >
              导出 Excel
            </button>
          </div>
        }
      />

      {msg && (
        <div className="glass rounded-lg border-ok/40 px-3 py-2 text-[11px] text-ok">{msg}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="累计供水量 (万m³)" value={6713} spark={SUPPLY} />
        <KpiCard label="累计售水量 (万m³)" value={6039} tone="techblue" spark={SOLD} />
        <KpiCard label="平均产销差率 (%)" value={10.04} decimals={2} tone="warn" delta="目标 ≤10%" spark={table.map((r) => r.loss)} />
        <KpiCard label="平均制水成本 (元/m³)" value={1.36} decimals={2} tone="ok" spark={wave(20, 1.36, 0.04, 4)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="供水量 / 售水量 与产销差率" className="xl:col-span-2" subtitle="柱线混合 · 图例置顶">
          <EChart option={mix} height={330} />
        </Panel>
        <Panel title="成本构成趋势">
          <EChart option={cost} height={330} />
        </Panel>
      </div>

      <Panel title={`${gran}运营明细报表`} subtitle={`统计区间 ${from} ~ ${to}`}>
        <DataTable
          maxHeight={340}
          columns={["期间", "供水量(万m³)", "售水量(万m³)", "产销差率", "吨水电耗", "制水成本(万元)", "考核"]}
          rows={table.map((r) => [
            r.period,
            r.supply,
            r.sold,
            `${r.loss}%`,
            r.energy,
            r.cost,
            r.loss <= 10 ? <Tag tone="ok">达标</Tag> : <Tag tone="warn">超标</Tag>,
          ])}
        />
      </Panel>
    </div>
  );
}
