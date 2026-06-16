"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";
import StatsGrid from "@/components/dashboard/stat-card";
import CashFlowChart from "@/components/dashboard/cash-flow-chart";
import TransactionTable from "@/components/dashboard/transaction-table";
import { Settings, Shield, Sliders, Database, CreditCard, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stat Cards */}
            <StatsGrid />

            {/* Grid Layout for Charts & Lists */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CashFlowChart />
              </div>
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-[420px] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl group-hover:scale-125 transition-transform" />
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Sparkles size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-white">Smart Insights</h3>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    Your net balance has increased by <strong className="text-emerald-400">12.8%</strong> this month. This is primarily driven by a <strong className="text-indigo-400">18.2%</strong> rise in consulting retainer revenue.
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Based on your average spending pattern, we project your next month expenses to be around <strong className="text-rose-400">$48,000.00</strong>, leaving an estimated savings margin of <strong className="text-cyan-400">42%</strong>.
                  </p>
                </div>

                <div className="border-t border-border-custom pt-4 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground-custom font-medium">Monthly budget limit status:</span>
                    <span className="text-emerald-400 font-bold">Good (61% Remaining)</span>
                  </div>
                  <div className="w-full bg-zinc-950/40 rounded-full h-1.5 mt-2 overflow-hidden border border-border-custom/50">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-[39%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Log */}
            <TransactionTable />
          </div>
        );
      case "transactions":
        return <TransactionTable />;
      case "analytics":
        return (
          <div className="space-y-6">
            <StatsGrid />
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
                    <select
                      defaultValue="USD"
                      className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="IDR">IDR (Rp) - Indonesian Rupiah</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">Language Preference</label>
                    <select
                      defaultValue="EN"
                      className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60"
                    >
                      <option value="EN">English</option>
                      <option value="ID">Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-border-custom" />

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-border-custom text-zinc-300 hover:text-white hover:bg-zinc-900/40 transition-colors">
                  Cancel Changes
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors glow-primary">
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
        <Navbar activeTab={activeTab} />

        {/* Dashboard Dynamic Content Container */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1600px] w-full mx-auto relative z-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
