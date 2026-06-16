"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Settings,
  Wallet,
  Menu,
  X,
  User,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accountName?: string;
  corporateEmail?: string;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab,
  accountName = "Administrator",
  corporateEmail = "admin@kassa.io"
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-card border border-border-custom text-foreground md:hidden hover:bg-zinc-800 transition-colors"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border-custom flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
            <Wallet size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white">Kassa</span>
            <span className="block text-xs font-semibold text-indigo-400">Finance Suite</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600/15 text-white"
                    : "text-muted-foreground-custom hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-indigo-400" : "text-muted-foreground-custom group-hover:text-zinc-300"
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Profile Card Footer */}
        <div className="p-4 border-t border-border-custom">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950/40 border border-border-custom/50">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{accountName}</p>
              <p className="text-xs text-muted-foreground-custom truncate">{corporateEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
