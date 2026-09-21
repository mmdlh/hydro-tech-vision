import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Droplets,
  FlaskConical,
  Network,
  Cog,
  Gauge,
  Siren,
  FileBarChart2,
  Maximize2,
  Minimize2,
  Bell,
  UserRound,
} from "lucide-react";

export const NAV = [
  { to: "/", label: "综合大屏", icon: LayoutDashboard },
  { to: "/water-quality", label: "水质监测", icon: FlaskConical },
  { to: "/process", label: "制水工艺", icon: Droplets },
  { to: "/pipeline", label: "管网调度", icon: Network },
  { to: "/equipment", label: "机电设备", icon: Cog },
  { to: "/energy", label: "能耗碳排", icon: Gauge },
  { to: "/emergency", label: "预警应急", icon: Siren },
  { to: "/reports", label: "运营报表", icon: FileBarChart2 },
] as const;

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <span className="font-display text-sm tabular-nums text-cyan/70">--:--:--</span>;
  return (
    <div className="leading-tight">
      <div className="font-display text-sm tabular-nums text-cyan glow-text">
        {now.toLocaleTimeString("zh-CN", { hour12: false })}
      </div>
      <div className="text-[10px] text-muted-foreground">
        {now.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" })}
      </div>
    </div>
  );
}

export function TopNav() {
  const [full, setFull] = useState(false);
  const toggleFull = () => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      setFull(false);
    } else {
      void document.documentElement.requestFullscreen?.();
      setFull(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan/20 bg-[#06101e]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1800px] items-center gap-4 px-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-cyan/40 bg-cyan/10">
            <Droplets className="h-5 w-5 text-cyan" />
          </div>
          <div>
            <div className="glow-text font-display text-base font-bold tracking-widest text-cyan">
              智慧水厂综合管控平台
            </div>
            <div className="text-[10px] tracking-wider text-muted-foreground">
              SMART WATER PLANT · INTEGRATED CONTROL CENTER
            </div>
          </div>
          <div className="ml-2 hidden items-center gap-2 rounded-full border border-ok/40 bg-ok/10 px-3 py-1 lg:flex">
            <span className="status-dot text-ok" />
            <span className="text-[11px] text-ok">全厂运行正常</span>
          </div>
          <div className="ml-2 hidden lg:block">
            <Clock />
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group flex shrink-0 flex-col items-center gap-0.5 rounded-lg border border-transparent px-3 py-1.5 text-[11px] text-muted-foreground transition-all hover:border-cyan/30 hover:bg-cyan/10 hover:text-cyan data-[status=active]:border-cyan/50 data-[status=active]:bg-cyan/15 data-[status=active]:text-cyan"
            >
              <Icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 border-l border-border pl-3">
          <button
            onClick={toggleFull}
            aria-label="全屏切换"
            className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <Link
            to="/emergency"
            aria-label="报警通知"
            className="relative grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-warn/50 hover:text-warn"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              7
            </span>
          </Link>
          <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1">
            <UserRound className="h-4 w-4 text-cyan" />
            <div className="hidden leading-tight sm:block">
              <div className="text-[11px] text-foreground">中控值班员</div>
              <div className="text-[10px] text-muted-foreground">张工 · 甲班</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
