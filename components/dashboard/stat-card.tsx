"use client";

import React from "react";
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";

interface SparklineProps {
  data: number[];
  color: string;
}

function Sparkline({ data, color }: SparklineProps) {
  const width = 120;
  const height = 40;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y =
        height -
        ((val - min) / range) * (height - padding * 2) -
        padding;
      return `${x},${y}`;
    })
    .join(" ");

  const fillPoints = `${padding},${height} ${points} ${width - padding},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Area under the line */}
      <polygon points={fillPoints} fill={`url(#gradient-${color})`} />
      {/* The sparkline itself */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{
          strokeDasharray: "150",
          strokeDashoffset: "0",
          animation: "draw-line 1.2s ease-out forwards",
        }}
      />
    </svg>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
  colorClass: "indigo" | "emerald" | "rose" | "cyan";
  sparklineData: number[];
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  colorClass,
  sparklineData,
}: StatCardProps) {
  const colors = {
    indigo: {
      accent: "#6366f1",
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      border: "hover:border-indigo-500/30",
    },
    emerald: {
      accent: "#10b981",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "hover:border-emerald-500/30",
    },
    rose: {
      accent: "#f43f5e",
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "hover:border-rose-500/30",
    },
    cyan: {
      accent: "#06b6d4",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "hover:border-cyan-500/30",
    },
  };

  const activeColor = colors[colorClass] || colors.indigo;

  return (
    <div
      className={`glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${activeColor.border}`}
    >
      {/* Background radial accent glow */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none"
        style={{ backgroundColor: activeColor.accent }}
      />

      <div className="flex items-start justify-between">
        {/* Metric Label & Icon */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground-custom">
            {title}
          </span>
          <span className="text-2xl font-extrabold text-white tracking-tight mt-1">
            {value}
          </span>
        </div>

        {/* Icon Circle */}
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${activeColor.bg} ${activeColor.text}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {/* Trend Indicator */}
        <div className="flex items-center gap-1">
          <span
            className={`flex items-center rounded-lg px-2 py-1 text-xs font-bold ${
              trend === "up"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight size={14} className="mr-0.5" />
            ) : (
              <ArrowDownRight size={14} className="mr-0.5" />
            )}
            {change}%
          </span>
          <span className="text-[10px] text-muted-foreground-custom font-medium ml-1">
            vs last month
          </span>
        </div>

        {/* Sparkline Graphic */}
        <div className="opacity-90">
          <Sparkline data={sparklineData} color={activeColor.accent} />
        </div>
      </div>
    </div>
  );
}

export default function StatsGrid() {
  // Hardcoded values based on mock stats for presentation
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Net Balance"
        value="$289,450.00"
        change={12.8}
        trend="up"
        icon={<DollarSign size={20} />}
        colorClass="indigo"
        sparklineData={[250, 260, 255, 270, 280, 275, 289]}
      />
      <StatCard
        title="Total Income"
        value="$95,000.00"
        change={18.2}
        trend="up"
        icon={<ArrowUpRight size={20} />}
        colorClass="emerald"
        sparklineData={[70, 75, 82, 80, 85, 90, 95]}
      />
      <StatCard
        title="Total Expenses"
        value="$58,000.00"
        change={9.4}
        trend="up"
        icon={<ArrowDownRight size={20} />}
        colorClass="rose"
        sparklineData={[50, 52, 51, 55, 54, 56, 58]}
      />
      <StatCard
        title="Savings Rate"
        value="38.9%"
        change={4.1}
        trend="up"
        icon={<Percent size={20} />}
        colorClass="cyan"
        sparklineData={[34, 35, 36, 35.5, 37, 38, 38.9]}
      />
    </div>
  );
}
