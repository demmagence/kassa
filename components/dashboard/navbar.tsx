"use client";

import React from "react";
import { Calendar, Plus, Search } from "lucide-react";
import { t } from "@/lib/locales";

interface NavbarProps {
  activeTab: string;
  onNewTransactionClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshKey?: number;
  language?: string;
  currency?: string;
}

export default function Navbar({ 
  activeTab, 
  onNewTransactionClick, 
  searchQuery, 
  setSearchQuery,
  refreshKey,
  language = "EN",
  currency = "USD"
}: NavbarProps) {
  const currentDate = new Date().toLocaleDateString(language === "ID" ? "id-ID" : "en-US", {
      month: "long",
      year: "numeric",
    });

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return t("Dashboard Overview", language);
      case "transactions":
        return t("Transaction Log", language);
      case "analytics":
        return t("Cash Flow Analytics", language);
      case "settings":
        return t("System Settings", language);
      default:
        return t("Financial Dashboard", language);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border-custom bg-background/80 px-6 backdrop-blur-md md:px-8">
      {/* Page Title */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-white md:text-2xl leading-none">
          {getTitle()}
        </h1>
        <p className="hidden text-xs font-medium text-muted-foreground-custom mt-1 md:block">
          {t("Manage, analyze and track your real-time revenue operations.", language)}
        </p>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        {activeTab === "transactions" && (
          <div className="relative hidden max-w-xs md:block">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground-custom"
            />
            <input
              type="text"
              placeholder={t("Search transactions...", language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-xl border border-border-custom bg-zinc-950/40 pl-9 pr-4 text-xs font-medium text-white placeholder-muted-foreground-custom outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-zinc-900/60"
            />
          </div>
        )}

        {/* Date Filter Quick View */}
        {activeTab === "dashboard" && (
          <div className="flex h-10 items-center gap-2 px-3.5 rounded-xl border border-border-custom bg-zinc-950/20 text-xs font-medium text-zinc-300">
            <Calendar size={14} className="text-indigo-400" />
            <span>{currentDate}</span>
          </div>
        )}



        {/* Quick Action Button */}
        {activeTab === "transactions" && (
          <button 
            onClick={onNewTransactionClick}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 glow-primary"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">{t("New Transaction", language)}</span>
          </button>
        )}
      </div>
    </header>
  );
}
