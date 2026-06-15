"use client";

import React from "react";
import { Search, Bell, Calendar, Plus } from "lucide-react";

interface NavbarProps {
  activeTab: string;
}

export default function Navbar({ activeTab }: NavbarProps) {
  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "transactions":
        return "Transaction Log";
      case "analytics":
        return "Cash Flow Analytics";
      case "settings":
        return "System Settings";
      default:
        return "Financial Dashboard";
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
          Manage, analyze and track your real-time revenue operations.
        </p>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden max-w-xs md:block">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground-custom"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            className="h-10 w-64 rounded-xl border border-border-custom bg-zinc-950/40 pl-9 pr-4 text-xs font-medium text-white placeholder-muted-foreground-custom outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-zinc-900/60"
          />
        </div>

        {/* Date Filter Quick View */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border-custom bg-zinc-950/20 text-xs font-medium text-zinc-300">
          <Calendar size={14} className="text-indigo-400" />
          <span>June 2026</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl border border-border-custom bg-zinc-950/20 text-muted-foreground-custom hover:text-white transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-zinc-950 animate-ping" />
        </button>

        {/* Quick Action Button */}
        <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 glow-primary">
          <Plus size={14} />
          <span className="hidden sm:inline">New Transaction</span>
        </button>
      </div>
    </header>
  );
}
