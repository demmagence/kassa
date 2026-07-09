import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { t } from "@/lib/locales";

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
  isLoading?: boolean;
  language?: string;
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  colorClass,
  sparklineData,
  isLoading = false,
  language = "EN",
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
          {isLoading ? (
            <div className="h-8 w-28 rounded-lg bg-white/5 animate-pulse mt-1.5" />
          ) : (
            <span className="text-2xl font-extrabold text-white tracking-tight mt-1">
              {value}
            </span>
          )}
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
        {isLoading ? (
          <div className="h-6 w-20 rounded-lg bg-white/5 animate-pulse" />
        ) : (
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
              {t("vs last month", language)}
            </span>
          </div>
        )}

        {/* Sparkline Graphic */}
        <div className="opacity-90">
          {isLoading ? (
            <div className="h-10 w-[120px] rounded-lg bg-white/5 animate-pulse" />
          ) : (
            <Sparkline data={sparklineData} color={activeColor.accent} />
          )}
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  refreshKey?: number;
  currency?: string;
  language?: string;
}

export default function StatsGrid({ refreshKey, currency = "USD", language = "EN" }: StatsGridProps) {
  const [stats, setStats] = useState<{
    netBalance: number;
    totalIncome: number;
    totalExpenses: number;
    savingsRate: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/transactions/stats/summary");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        
        const income = data.total_income;
        const expenses = data.total_expense;
        const netBalance = data.net_cash_flow;
        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

        setStats({
          netBalance: netBalance,
          totalIncome: income,
          totalExpenses: expenses,
          savingsRate: parseFloat(savingsRate.toFixed(1))
        });
      } catch (err) {
        // Fallback to mock defaults if API offline
        setStats({
          netBalance: 289450,
          totalIncome: 95000,
          totalExpenses: 58000,
          savingsRate: 38.9
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [refreshKey]);

  const displayStats = stats || {
    netBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    savingsRate: 0
  };

  const getNetBalanceIcon = (cur: string) => {
    if (cur === "IDR") {
      return <span className="text-[10px] font-extrabold">Rp</span>;
    }
    return <DollarSign size={20} />;
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("Net Balance", language)}
        value={formatCurrency(displayStats.netBalance, currency)}
        change={12.8}
        trend={displayStats.netBalance >= 0 ? "up" : "down"}
        icon={getNetBalanceIcon(currency)}
        colorClass="indigo"
        sparklineData={[250, 260, 255, 270, 280, 275, 289]}
        isLoading={isLoading}
        language={language}
      />
      <StatCard
        title={t("Total Income", language)}
        value={formatCurrency(displayStats.totalIncome, currency)}
        change={18.2}
        trend="up"
        icon={<ArrowUpRight size={20} />}
        colorClass="emerald"
        sparklineData={[70, 75, 82, 80, 85, 90, 95]}
        isLoading={isLoading}
        language={language}
      />
      <StatCard
        title={t("Total Expenses", language)}
        value={formatCurrency(displayStats.totalExpenses, currency)}
        change={9.4}
        trend="up"
        icon={<ArrowDownRight size={20} />}
        colorClass="rose"
        sparklineData={[50, 52, 51, 55, 54, 56, 58]}
        isLoading={isLoading}
        language={language}
      />
      <StatCard
        title={t("Savings Rate", language)}
        value={`${displayStats.savingsRate.toFixed(1)}%`}
        change={4.1}
        trend="up"
        icon={<Percent size={20} />}
        colorClass="cyan"
        sparklineData={[34, 35, 36, 35.5, 37, 38, 38.9]}
        isLoading={isLoading}
        language={language}
      />
    </div>
  );
}
