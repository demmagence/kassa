"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockMonthlyCashFlow, mockWeeklyCashFlow } from "@/data/mock-data";
import { BarChart2, TrendingUp } from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-xl border border-white/10 shadow-xl">
        <p className="text-xs font-semibold text-zinc-400 mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 text-xs">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                ${entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t border-white/5 pt-1 mt-1 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Net Flow:</span>
            <span
              className={`font-bold ${
                payload[0].payload.net >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              ${payload[0].payload.net.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function CashFlowChart() {
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly");
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<{
    monthly: any[];
    weekly: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadChartData() {
      setIsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/transactions");
        if (!res.ok) throw new Error("API error");
        const transactions = await res.json();

        // 1. Calculate Monthly Cash Flow (for current year)
        const monthly = [
          { name: "Jan", income: 0, expense: 0, net: 0 },
          { name: "Feb", income: 0, expense: 0, net: 0 },
          { name: "Mar", income: 0, expense: 0, net: 0 },
          { name: "Apr", income: 0, expense: 0, net: 0 },
          { name: "May", income: 0, expense: 0, net: 0 },
          { name: "Jun", income: 0, expense: 0, net: 0 },
          { name: "Jul", income: 0, expense: 0, net: 0 },
          { name: "Aug", income: 0, expense: 0, net: 0 },
          { name: "Sep", income: 0, expense: 0, net: 0 },
          { name: "Oct", income: 0, expense: 0, net: 0 },
          { name: "Nov", income: 0, expense: 0, net: 0 },
          { name: "Dec", income: 0, expense: 0, net: 0 },
        ];

        // 2. Calculate Weekly Cash Flow (current month)
        const weekly = [
          { name: "Week 1", income: 0, expense: 0, net: 0 },
          { name: "Week 2", income: 0, expense: 0, net: 0 },
          { name: "Week 3", income: 0, expense: 0, net: 0 },
          { name: "Week 4", income: 0, expense: 0, net: 0 },
        ];

        const today = new Date();
        const targetYear = today.getFullYear();
        const targetMonth = today.getMonth();

        transactions.forEach((tx: any) => {
          const txDate = new Date(tx.date);
          const y = txDate.getFullYear();
          const m = txDate.getMonth();
          const amt = tx.amount;

          // Aggregation for Monthly (only for current year)
          if (y === targetYear) {
            if (tx.type === "income") {
              monthly[m].income += amt;
            } else if (tx.type === "expense") {
              monthly[m].expense += amt;
            }
          }

          // Aggregation for Weekly (only for current month and year)
          if (y === targetYear && m === targetMonth) {
            const day = txDate.getDate();
            let weekIdx = 3;
            if (day <= 7) weekIdx = 0;
            else if (day <= 14) weekIdx = 1;
            else if (day <= 21) weekIdx = 2;

            if (tx.type === "income") {
              weekly[weekIdx].income += amt;
            } else if (tx.type === "expense") {
              weekly[weekIdx].expense += amt;
            }
          }
        });

        // Compute net for each point
        monthly.forEach(pt => { pt.net = pt.income - pt.expense; });
        weekly.forEach(pt => { pt.net = pt.income - pt.expense; });

        setChartData({ monthly, weekly });
      } catch (err) {
        // Fallback to mock data if API offline
        setChartData({
          monthly: mockMonthlyCashFlow,
          weekly: mockWeeklyCashFlow
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadChartData();
  }, []);

  const data = chartData ? chartData[viewMode] : [];

  const formatYAxis = (tick: number) => {
    if (tick >= 1000) return `$${(tick / 1000).toFixed(0)}K`;
    return `$${tick}`;
  };

  if (isLoading || !mounted) {
    return (
      <div className="glass-card p-6 rounded-2xl h-[420px] flex flex-col justify-between animate-pulse">
        <div className="h-6 w-1/4 bg-zinc-800 rounded" />
        <div className="h-3/4 w-full bg-zinc-900 rounded" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col h-[420px]">
      {/* Header with Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <BarChart2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-none">
              Cash Flow Trend
            </h2>
            <span className="text-xs text-muted-foreground-custom font-medium mt-1 block">
              Income vs. Expense visualization over time
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-xl bg-zinc-950/40 p-1 border border-border-custom self-start sm:self-auto">
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "monthly"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/10"
                : "text-muted-foreground-custom hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "weekly"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/10"
                : "text-muted-foreground-custom hover:text-white"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255, 255, 255, 0.05)" }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconSize={8}
              iconType="circle"
              wrapperStyle={{
                fontSize: "11px",
                color: "#94a3b8",
                paddingLeft: "20px",
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
              activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
              activeDot={{ r: 4, strokeWidth: 0, fill: "#f43f5e" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
