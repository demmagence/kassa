"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Calendar, Plus, AlertTriangle, Info, CheckCircle2, Search } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  onNewTransactionClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface NotificationItem {
  id: string;
  type: "warning" | "info" | "success";
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
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
  },
];

export default function Navbar({ 
  activeTab, 
  onNewTransactionClick, 
  searchQuery, 
  setSearchQuery 
}: NavbarProps) {
  const [currentDate] = useState(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("kassa_notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        setNotifications(mockNotifications);
      }
    } else {
      setNotifications(mockNotifications);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening and save to localStorage
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
      localStorage.setItem("kassa_notifications", JSON.stringify(updated));
    }
  };

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
        {activeTab !== "dashboard" && activeTab !== "analytics" && (
          <div className="relative hidden max-w-xs md:block">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground-custom"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-xl border border-border-custom bg-zinc-950/40 pl-9 pr-4 text-xs font-medium text-white placeholder-muted-foreground-custom outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-zinc-900/60"
            />
          </div>
        )}

        {/* Date Filter Quick View */}
        {activeTab !== "transactions" && activeTab !== "analytics" && (
          <div className="flex h-10 items-center gap-2 px-3.5 rounded-xl border border-border-custom bg-zinc-950/20 text-xs font-medium text-zinc-300">
            <Calendar size={14} className="text-indigo-400" />
            <span>{currentDate}</span>
          </div>
        )}

        {/* Notification Bell with Dropdown */}
        {activeTab !== "transactions" && activeTab !== "analytics" && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleNotificationClick}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border-custom bg-zinc-950/20 text-muted-foreground-custom hover:text-white transition-colors"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-zinc-950" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border-custom bg-zinc-950/95 p-4 shadow-xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-border-custom pb-2 mb-3">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground-custom py-4">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex gap-3 p-2.5 rounded-xl border transition-colors ${
                          n.read ? "bg-transparent border-transparent" : "bg-indigo-500/5 border-indigo-500/10"
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {n.type === "warning" && <AlertTriangle size={14} className="text-amber-500" />}
                          {n.type === "info" && <Info size={14} className="text-sky-400" />}
                          {n.type === "success" && <CheckCircle2 size={14} className="text-emerald-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-muted-foreground-custom font-semibold mt-1 block">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Action Button */}
        {activeTab !== "dashboard" && activeTab !== "analytics" && (
          <button 
            onClick={onNewTransactionClick}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 glow-primary"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Transaction</span>
          </button>
        )}
      </div>
    </header>
  );
}
