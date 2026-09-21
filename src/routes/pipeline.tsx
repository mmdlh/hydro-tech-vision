import { createFileRoute } from "@tanstack/react-router";
import { EChart } from "@/components/water/EChart";
import { DataTable, KpiCard, Panel, PageHeader, StatusDot, Tag } from "@/components/water/ui";
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
  component: Pipeline;
});

function Pipeline() {
  return null;
}
