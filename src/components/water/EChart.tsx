import { useEffect, useRef } from "react";
import type { EChartsOption } from "echarts";

export function EChart({
  option,
  height = 280,
  className = "",
}: {
  option: EChartsOption;
  height?: number;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const inst = useRef<{ setOption: (o: unknown, r?: boolean) => void; resize: () => void; dispose: () => void } | null>(
    null,
  );
  const latest = useRef(option);
  latest.current = option;

  useEffect(() => {
    let disposed = false;
    const onResize = () => inst.current?.resize();
    (async () => {
      const echarts = await import("echarts");
      if (disposed || !el.current) return;
      const chart = echarts.init(el.current, undefined, { renderer: "canvas" });
      inst.current = chart as unknown as typeof inst.current;
      chart.setOption(latest.current);
      window.addEventListener("resize", onResize);
    })();
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      inst.current?.dispose();
      inst.current = null;
    };
  }, []);

  useEffect(() => {
    inst.current?.setOption(option, true);
  }, [option]);

  return <div ref={el} style={{ height }} className={className} />;
}
