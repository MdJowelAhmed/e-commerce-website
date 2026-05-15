"use client";

import { motion } from "framer-motion";

interface SalesChartProps {
  data: { label: string; value: number }[];
  title?: string;
}

export function SalesChart({ data, title = "Sales overview" }: SalesChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 0, bottom: 28, left: 0 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * innerW;
    const y = padding.top + (1 - d.value / max) * innerH;
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0},${height - padding.bottom} L ${points[0]?.x ?? 0},${height - padding.bottom} Z`;

  return (
    <div className="rounded-2xl border bg-background p-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </div>
        <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
          +12.4%
        </div>
      </div>
      <div className="mt-6 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.18" />
              <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={areaPath}
            fill="url(#chart-grad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3}
              fill="hsl(var(--background))"
              stroke="hsl(var(--foreground))"
              strokeWidth={1.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.02 }}
            />
          ))}
        </svg>
        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          {data
            .filter((_, i) => i % Math.max(1, Math.floor(data.length / 7)) === 0)
            .slice(0, 7)
            .map((d) => (
              <span key={d.label}>{d.label}</span>
            ))}
        </div>
      </div>
    </div>
  );
}
