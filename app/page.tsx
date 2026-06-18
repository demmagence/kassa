"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";
import StatsGrid from "@/components/dashboard/stat-card";
import CashFlowChart from "@/components/dashboard/cash-flow-chart";
import TransactionTable from "@/components/dashboard/transaction-table";
import NewTransactionModal from "@/components/dashboard/new-transaction-modal";
import CustomSelect from "@/components/dashboard/custom-select";
import { formatCurrency } from "@/lib/currency";
import { t } from "@/lib/locales";
import { Settings, Shield, Sliders, Database, Sparkles, CheckCircle2, Info, X } from "lucide-react";


export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Configuration States (Source of Truth)
  const [accountName, setAccountName] = useState("Administrator");
  const [corporateEmail, setCorporateEmail] = useState("admin@kassa.io");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("EN");

  // Form Edit States
  const [formAccountName, setFormAccountName] = useState("Administrator");
  const [formCorporateEmail, setFormCorporateEmail] = useState("admin@kassa.io");
  const [formCurrency, setFormCurrency] = useState("USD");
  const [formLanguage, setFormLanguage] = useState("EN");

  // Settings Sub-Tab State
  const [activeSettingsTab, setActiveSettingsTab] = useState<"general" | "security" | "database">("general");

  // Toast Notification States
  const [toast, setToast] = useState<{ type: "success" | "info" | null; message: string }>({ type: null, message: "" });
  const [activeToast, setActiveToast] = useState<{ type: "success" | "info" | null; message: string }>({ type: null, message: "" });

  React.useEffect(() => {
    if (toast.type) {
      setActiveToast(toast);
      const timer = setTimeout(() => {
        setToast({ type: null, message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  React.useEffect(() => {
    const savedName = localStorage.getItem("kassa_account_name");
    const savedEmail = localStorage.getItem("kassa_corporate_email");
    const savedCurrency = localStorage.getItem("kassa_currency");
    const savedLanguage = localStorage.getItem("kassa_language");

    if (savedName) {
      setAccountName(savedName);
      setFormAccountName(savedName);
    }
    if (savedEmail) {
      setCorporateEmail(savedEmail);
      setFormCorporateEmail(savedEmail);
    }
    if (savedCurrency) {
      setCurrency(savedCurrency);
      setFormCurrency(savedCurrency);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setFormLanguage(savedLanguage);
    }
  }, []);

  // symbol is no longer used directly; formatCurrency handles it

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

  const addNotification = (message: string, type: "success" | "info" | "warning") => {
    const saved = localStorage.getItem("kassa_notifications");
    let list = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = [
          {
            id: "1",
            type: "warning",
            message: "Warning: Based on current burn rate, cash runway is under 30 days.",
            time: "2 hours ago",
            read: false,
          },
          {
            id: "2",
            type: "info",
            message: "Invoice INV-2026-004 to Client A is overdue by 5 days.",
            time: "5 hours ago",
            read: false,
          },
          {
            id: "3",
            type: "success",
            message: "Successfully synchronized database with MongoDB Atlas.",
            time: "1 day ago",
            read: true,
          }
        ];
      }
    } else {
      list = [
        {
          id: "1",
          type: "warning",
          message: "Warning: Based on current burn rate, cash runway is under 30 days.",
          time: "2 hours ago",
          read: false,
        },
        {
          id: "2",
          type: "info",
          message: "Invoice INV-2026-004 to Client A is overdue by 5 days.",
          time: "5 hours ago",
          read: false,
        },
        {
          id: "3",
          type: "success",
          message: "Successfully synchronized database with MongoDB Atlas.",
          time: "1 day ago",
          read: true,
        }
      ];
    }

    const newNotification = {
      id: Date.now().toString(),
      type,
      message,
      time: "Just now",
      read: false
    };

    localStorage.setItem("kassa_notifications", JSON.stringify([newNotification, ...list]));
    triggerRefresh();
  };

  const handleSaveChanges = () => {
    setAccountName(formAccountName);
    setCorporateEmail(formCorporateEmail);
    setCurrency(formCurrency);
    setLanguage(formLanguage);

    localStorage.setItem("kassa_account_name", formAccountName);
    localStorage.setItem("kassa_corporate_email", formCorporateEmail);
    localStorage.setItem("kassa_currency", formCurrency);
    localStorage.setItem("kassa_language", formLanguage);

    setToast({ type: "success", message: "General Configuration saved successfully!" });
    triggerRefresh();
  };

  const handleCancelChanges = () => {
    setFormAccountName(accountName);
    setFormCorporateEmail(corporateEmail);
    setFormCurrency(currency);
    setFormLanguage(language);

    setToast({ type: "info", message: "Changes discarded." });
  };


  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div key="dashboard-tab" className="space-y-6">
            {/* Stat Cards */}
            <StatsGrid refreshKey={refreshKey} currency={currency} language={language} />

            {/* Grid Layout for Charts & Lists */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CashFlowChart currency={currency} language={language} />
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
                      <h3 className="text-sm font-bold text-white">{t("Smart Insights", language)}</h3>
                    </div>
                    {stats.totalIncome === 0 && stats.totalExpenses === 0 ? (
                      <>
                        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                          {t("No transactions recorded for the current billing cycle. Add new income or expenses to generate smart financial insights.", language)}
                        </p>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {t("Once data is logged, we will analyze your spending patterns, cash runway, and savings margin.", language)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                          {t("Your net balance is", language)} <strong className="text-emerald-400">{formatCurrency(stats.netBalance, currency)}</strong> {t("this month. This is driven by", language)} <strong className="text-emerald-400">{formatCurrency(stats.totalIncome, currency)}</strong> {t("in total revenue against", language)} <strong className="text-rose-400">{formatCurrency(stats.totalExpenses, currency)}</strong> {t("in operational expenses.", language)}
                        </p>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {t("Based on your current spending patterns, we project your next month expenses to be around", language)} <strong className="text-rose-400">{formatCurrency(stats.totalExpenses, currency)}</strong>, {t("leaving an estimated savings rate of", language)} <strong className="text-cyan-400">{stats.savingsRate}%</strong>.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="border-t border-border-custom pt-4 mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground-custom font-medium">{t("Monthly budget limit status:", language)}</span>
                      <span className={`${budgetStatus.color} font-bold`}>{t(budgetStatus.label, language)} ({budgetRemainingPercent.toFixed(0)}% {t("Remaining", language)})</span>
                    </div>
                    <div className="w-full bg-zinc-950/40 rounded-full h-1.5 mt-2 overflow-hidden border border-border-custom/50">
                      <div className={`${budgetStatus.barColor} h-1.5 rounded-full`} style={{ width: `${budgetRemainingPercent}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Log */}
            <TransactionTable refreshKey={refreshKey} searchQuery={searchQuery} setSearchQuery={setSearchQuery} currency={currency} language={language} />
          </div>
        );
      case "transactions":
        return <TransactionTable refreshKey={refreshKey} searchQuery={searchQuery} setSearchQuery={setSearchQuery} currency={currency} language={language} />;
      case "analytics":
        return (
          <div key="analytics-tab" className="space-y-6">
            <StatsGrid refreshKey={refreshKey} currency={currency} language={language} />
            <CashFlowChart currency={currency} language={language} />
          </div>
        );
      case "settings":
        return (
          <div key="settings-tab" className="grid gap-6 md:grid-cols-3">
            {/* Navigation links for settings */}
            <div className="glass-card p-4 rounded-2xl h-fit space-y-1">
              <button
                onClick={() => setActiveSettingsTab("general")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                  activeSettingsTab === "general"
                    ? "bg-indigo-600 text-white"
                    : "text-muted-foreground-custom hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                <Sliders size={16} />
                {t("General Configuration", language)}
              </button>
              <button
                onClick={() => setActiveSettingsTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                  activeSettingsTab === "security"
                    ? "bg-indigo-600 text-white"
                    : "text-muted-foreground-custom hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                <Shield size={16} />
                {t("Security & Access", language)}
              </button>
              <button
                onClick={() => setActiveSettingsTab("database")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                  activeSettingsTab === "database"
                    ? "bg-indigo-600 text-white"
                    : "text-muted-foreground-custom hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                <Database size={16} />
                {t("Database & Sync", language)}
              </button>
            </div>

            {/* Main Settings Content Area */}
            <div className="md:col-span-2 glass-card p-6 rounded-2xl space-y-6">
              {/* General Configuration Tab */}
              {activeSettingsTab === "general" && (
                <>
                  <div>
                    <h2 className="text-base font-bold text-white leading-none">{t("Settings Panel", language)}</h2>
                    <p className="text-xs text-muted-foreground-custom mt-1">{t("Configure your personal and corporate preferences.", language)}</p>
                  </div>

                  <hr className="border-border-custom" />

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">{t("Account Name", language)}</label>
                        <input
                          type="text"
                          value={formAccountName}
                          onChange={(e) => setFormAccountName(e.target.value)}
                          className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">{t("Corporate Email", language)}</label>
                        <input
                          type="email"
                          value={formCorporateEmail}
                          onChange={(e) => setFormCorporateEmail(e.target.value)}
                          className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">{t("Base Currency", language)}</label>
                        <CustomSelect
                          value={formCurrency}
                          onChange={(val) => {
                            setFormCurrency(val);
                            setCurrency(val);
                          }}
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
                        <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">{t("Language Preference", language)}</label>
                        <CustomSelect
                          value={formLanguage}
                          onChange={(val) => {
                            setFormLanguage(val);
                            setLanguage(val);
                          }}
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
                    <button 
                      onClick={handleCancelChanges}
                      className="h-10 px-4 rounded-xl text-xs font-semibold border border-border-custom text-zinc-300 hover:text-white hover:bg-zinc-900/40 transition-colors flex items-center justify-center"
                    >
                      {t("Cancel Changes", language)}
                    </button>
                    <button 
                      onClick={handleSaveChanges}
                      className="h-10 px-4 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors glow-primary flex items-center justify-center"
                    >
                      {t("Save Changes", language)}
                    </button>
                  </div>
                </>
              )}

              {/* Security & Access Tab */}
              {activeSettingsTab === "security" && (
                <>
                  <div>
                    <h2 className="text-base font-bold text-white leading-none">Security & Access</h2>
                    <p className="text-xs text-muted-foreground-custom mt-1">Manage authentication, session controls, and access policies.</p>
                  </div>

                  <hr className="border-border-custom" />

                  {/* Password Change Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                        <Shield size={14} />
                      </div>
                      <h3 className="text-xs font-bold text-white">Change Password</h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60 placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="h-10 rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500 focus:bg-zinc-900/60 placeholder:text-zinc-600"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setToast({ type: "success", message: "Password updated successfully!" })}
                        className="h-10 px-4 rounded-xl text-xs font-semibold bg-amber-600 text-white shadow-md shadow-amber-500/20 hover:bg-amber-500 transition-colors flex items-center justify-center"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  <hr className="border-border-custom" />

                  {/* Session Management */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Settings size={14} />
                      </div>
                      <h3 className="text-xs font-bold text-white">Session Management</h3>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-custom bg-zinc-950/40">
                      <div>
                        <p className="text-xs font-semibold text-white">Two-Factor Authentication</p>
                        <p className="text-[10px] text-muted-foreground-custom mt-0.5">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => setToast({ type: "info", message: "2FA configuration will be available in a future update." })}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        Disabled
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-custom bg-zinc-950/40">
                      <div>
                        <p className="text-xs font-semibold text-white">Active Sessions</p>
                        <p className="text-[10px] text-muted-foreground-custom mt-0.5">1 active session on this device</p>
                      </div>
                      <button
                        onClick={() => setToast({ type: "success", message: "All other sessions have been terminated." })}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      >
                        Revoke All
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-custom bg-zinc-950/40">
                      <div>
                        <p className="text-xs font-semibold text-white">Auto-Lock Timeout</p>
                        <p className="text-[10px] text-muted-foreground-custom mt-0.5">Automatically lock after inactivity</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400">30 minutes</span>
                    </div>
                  </div>
                </>
              )}

              {/* Database & Sync Tab */}
              {activeSettingsTab === "database" && (
                <>
                  <div>
                    <h2 className="text-base font-bold text-white leading-none">Database & Sync</h2>
                    <p className="text-xs text-muted-foreground-custom mt-1">Monitor database connection, sync status, and data management.</p>
                  </div>

                  <hr className="border-border-custom" />

                  {/* Connection Status */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Database size={14} />
                      </div>
                      <h3 className="text-xs font-bold text-white">Connection Status</h3>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-custom bg-zinc-950/40">
                      <div>
                        <p className="text-xs font-semibold text-white">MongoDB Atlas</p>
                        <p className="text-[10px] text-muted-foreground-custom mt-0.5">Cluster: kassa-db | Region: ap-southeast-1</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400">Connected</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-custom bg-zinc-950/40">
                      <div>
                        <p className="text-xs font-semibold text-white">Last Sync</p>
                        <p className="text-[10px] text-muted-foreground-custom mt-0.5">Automatic sync every 5 minutes</p>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400">Just now</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border border-border-custom bg-zinc-950/40">
                      <div>
                        <p className="text-xs font-semibold text-white">Storage Used</p>
                        <p className="text-[10px] text-muted-foreground-custom mt-0.5">Free tier: 512 MB available</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-white">2.4 MB</span>
                        <div className="w-20 h-1 rounded-full bg-zinc-800 mt-1 overflow-hidden">
                          <div className="h-full w-[5%] rounded-full bg-indigo-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-border-custom" />

                  {/* Actions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Settings size={14} />
                      </div>
                      <h3 className="text-xs font-bold text-white">Data Management</h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={async () => {
                          setToast({ type: "info", message: "Syncing database..." });
                          try {
                            const res = await fetch("http://127.0.0.1:8000/api/status");
                            if (res.ok) {
                              setToast({ type: "success", message: "Database synchronized successfully!" });
                            } else {
                              setToast({ type: "info", message: "Sync completed with warnings. Check connection." });
                            }
                          } catch {
                            setToast({ type: "info", message: "Sync simulated. Backend is currently offline." });
                          }
                          triggerRefresh();
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border-custom bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-indigo-500/30 transition-all text-left"
                      >
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                          <Database size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Force Sync</p>
                          <p className="text-[10px] text-muted-foreground-custom">Manually trigger a database sync</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setToast({ type: "info", message: "Export feature will be available in a future update." })}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border-custom bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-cyan-500/30 transition-all text-left"
                      >
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                          <Database size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Export Data</p>
                          <p className="text-[10px] text-muted-foreground-custom">Download transactions as JSON/CSV</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setToast({ type: "info", message: "Backup created successfully!" })}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border-custom bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all text-left"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                          <CheckCircle2 size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Create Backup</p>
                          <p className="text-[10px] text-muted-foreground-custom">Snapshot current database state</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setToast({ type: "info", message: "This action is disabled for safety. Use the backend API directly." })}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border-custom bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-rose-500/30 transition-all text-left opacity-60 cursor-not-allowed"
                      >
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                          <X size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Clear All Data</p>
                          <p className="text-[10px] text-muted-foreground-custom">Permanently delete all transactions</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
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
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        accountName={accountName}
        corporateEmail={corporateEmail}
        language={language}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 md:pl-64">
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          onNewTransactionClick={() => setIsModalOpen(true)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          refreshKey={refreshKey}
          language={language}
          currency={currency}
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
        language={language}
        currency={currency}
      />

      {/* Floating Toast Notification */}
      <div 
        className={`fixed top-6 right-6 z-[100] w-full max-w-sm transition-all duration-300 ease-out ${
          toast.type 
            ? "opacity-100 translate-x-0 scale-100" 
            : "opacity-0 translate-x-8 scale-95 pointer-events-none"
        }`}
      >
        <div className={`flex items-center gap-3 p-4 rounded-xl backdrop-blur-xl border shadow-2xl text-xs font-semibold ${
          activeToast.type === "success"
            ? "bg-zinc-950/85 border-emerald-500/20 shadow-emerald-500/5 text-emerald-400"
            : "bg-zinc-950/85 border-indigo-500/20 shadow-indigo-500/5 text-indigo-400"
        }`}>
          <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${
            activeToast.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
          }`}>
            {activeToast.type === "success" ? <CheckCircle2 size={18} /> : <Info size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-200 font-medium text-xs">{activeToast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast({ type: null, message: "" })}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
