"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";
import StatsGrid from "@/components/dashboard/stat-card";
import CashFlowChart from "@/components/dashboard/cash-flow-chart";
import TransactionTable from "@/components/dashboard/transaction-table";
import NewTransactionModal from "@/components/dashboard/new-transaction-modal";
import CustomSelect from "@/components/dashboard/custom-select";
import { Settings, Shield, Sliders, Database, Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("EN");

  const [stats, setStats] = useState<{
    netBalance: number;
    totalIncome: number;
    totalExpenses: number;
    savingsRate: number;
  } | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  React.useEffect(() => {
    async function loadStats() {
      setIsStatsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/transactions/stats/summary");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        
        const income = data.total_income;
        const expenses = data.total_expense;
        const netBalance = data.net_cash_flow;
        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

        setStats({
          netBalance,
          totalIncome: income,
          totalExpenses: expenses,
          savingsRate: parseFloat(savingsRate.toFixed(1))
        });
      } catch (err) {
        // Default fallback mock values if offline
        setStats({
          netBalance: 289450,
          totalIncome: 95000,
          totalExpenses: 58000,
          savingsRate: 38.9
        });
      } finally {
        setIsStatsLoading(false);
      }
    }
    loadStats();
  }, [refreshKey]);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const budgetLimit = 2000; // Monthly budget limit
  const expensesVal = stats ? stats.totalExpenses : 0;
  const budgetUsedPercent = Math.min((expensesVal / budgetLimit) * 100, 100);
  const budgetRemainingPercent = Math.max(100 - budgetUsedPercent, 0);

  const getBudgetStatus = () => {
    if (budgetRemainingPercent >= 50) return { label: "Good", color: "text-emerald-400", barColor: "bg-emerald-500" };
    if (budgetRemainingPercent >= 15) return { label: "Warning", color: "text-amber-400", barColor: "bg-amber-500" };
    return { label: "Critical", color: "text-rose-400", barColor: "bg-rose-500" };
  };

  const budgetStatus = getBudgetStatus();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stat Cards */}
            <StatsGrid refreshKey={refreshKey} />

            {/* Grid Layout for Charts & Lists */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CashFlowChart />
              </div>
              
              {isStatsLoading || !stats ? (
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-[420px] relative overflow-hidden group animate-pulse">
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl" />
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-xl bg-zinc-800 text-zinc-700">
                        <Sparkles size={16} />
                      </div>
                      <div className="h-4 w-24 bg-zinc-800 rounded" />
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-3 w-full bg-zinc-800 rounded" />
                      <div className="h-3 w-5/6 bg-zinc-800 rounded" />
                      <div className="h-3 w-4/5 bg-zinc-800 rounded" />
                    </div>
                    <div className="space-y-2.5 mt-6">
                      <div className="h-3 w-full bg-zinc-800 rounded" />
                      <div className="h-3 w-11/12 bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="border-t border-border-custom pt-4 mt-4 space-y-2">
                    <div className="h-3 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-2 w-full bg-zinc-850 rounded-full animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-[420px] relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl group-hover:scale-125 transition-transform" />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                        <Sparkles size={16} />
                      </div>
                      <h3 className="text-sm font-bold text-white">Smart Insights</h3>
                    </div>
                    {stats.totalIncome === 0 && stats.totalExpenses === 0 ? (
                      <>
                        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                          No transactions recorded for the current billing cycle. Add new income or expenses to generate smart financial insights.
                        </p>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          Once data is logged, we will analyze your spending patterns, cash runway, and savings margin.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                          Your net balance is <strong className="text-emerald-400">${stats.netBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> this month. This is driven by <strong className="text-emerald-400">${stats.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> in total revenue against <strong className="text-rose-400">${stats.totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> in operational expenses.
                        </p>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          Based on your current spending patterns, we project your next month expenses to be around <strong className="text-rose-400">${stats.totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>, leaving an estimated savings rate of <strong className="text-cyan-400">{stats.savingsRate}%</strong>.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="border-t border-border-custom pt-4 mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground-custom font-medium">Monthly budget limit status:</span>
                      <span className={`${budgetStatus.color} font-bold`}>{budgetStatus.label} ({budgetRemainingPercent.toFixed(0)}% Remaining)</span>
                    </div>
                    <div className="w-full bg-zinc-950/40 rounded-full h-1.5 mt-2 overflow-hidden border border-border-custom/50">
                      <div className={`${budgetStatus.barColor} h-1.5 rounded-full`} style={{ width: `${budgetRemainingPercent}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Log */}
            <TransactionTable refreshKey={refreshKey} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        );
      case "transactions":
        return <TransactionTable refreshKey={refreshKey} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case "analytics":
        return (
          <div className="space-y-6">
            <StatsGrid refreshKey={refreshKey} />
            <CashFlowChart />
          </div>
        );
      case "settings":
        return (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Navigation links for settings */}
            <div className="glass-card p-4 rounded-2xl h-fit space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white text-left">
                <Sliders size={16} />
                General Configuration
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground-custom hover:text-white hover:bg-zinc-900/40 text-left transition-colors">
                <Shield size={16} />
                Security & Access
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground-custom hover:text-white hover:bg-zinc-900/40 text-left transition-colors">
                <Database size={16} />
                Database & Sync
              </button>
            </div>

            {/* Main Settings Form */}
            <div className="md:col-span-2 glass-card p-6 rounded-2xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-white leading-none">Settings Panel</h2>
                <p className="text-xs text-muted-foreground-custom mt-1">Configure your personal and corporate preferences.</p>
              </div>

              <hr className="border-border-custom" />

              <div className="space-y-4">
                {/* Profile Settings */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">Account Name</label>
                    <input
                      type="text"
                      defaultValue="Administrator"
                      className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">Corporate Email</label>
                    <input
                      type="email"
                      defaultValue="admin@kassa.io"
                      className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60"
                    />
                  </div>
                </div>

                {/* Regional/Currency Settings */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">Base Currency</label>
                    <CustomSelect
                      value={currency}
                      onChange={setCurrency}
                      options={[
                        { value: "USD", label: "USD ($) - US Dollar" },
                        { value: "EUR", label: "EUR (€) - Euro" },
                        { value: "IDR", label: "IDR (Rp) - Indonesian Rupiah" },
                        { value: "GBP", label: "GBP (£) - British Pound" },
                      ]}
                      triggerClassName="h-10"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">Language Preference</label>
                    <CustomSelect
                      value={language}
                      onChange={setLanguage}
                      options={[
                        { value: "EN", label: "English" },
                        { value: "ID", label: "Bahasa Indonesia" },
                      ]}
                      triggerClassName="h-10"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-border-custom" />

              <div className="flex justify-end gap-3">
                 <button className="h-10 px-4 rounded-xl text-xs font-semibold border border-border-custom text-zinc-300 hover:text-white hover:bg-zinc-900/40 transition-colors flex items-center justify-center">
                   Cancel Changes
                 </button>
                 <button className="h-10 px-4 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors glow-primary flex items-center justify-center">
                   Save Changes
                 </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Decorative Blur Ambient Globs */}
      <div className="ambient-glow bg-indigo-600/30 top-1/4 -left-64" />
      <div className="ambient-glow bg-cyan-600/30 bottom-1/4 -right-64" />

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 md:pl-64">
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          onNewTransactionClick={() => setIsModalOpen(true)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dashboard Dynamic Content Container */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1600px] w-full mx-auto relative z-10">
          {renderContent()}
        </main>
      </div>

      {/* Add New Transaction Modal */}
      <NewTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddSuccess={triggerRefresh} 
      />
    </div>
  );
}
