"use client";

import React, { useState, useEffect } from "react";
import { mockTransactions, Transaction } from "@/data/mock-data";
import { ArrowUpRight, ArrowDownRight, Search, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { t } from "@/lib/locales";

interface TransactionTableProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  refreshKey?: number;
  currency?: string;
  language?: string;
}

const formatTransactionId = (t: any) => {
  if (t.reference) return t.reference;
  
  const dbId = t.id || t._id || "";
  // Check if it is a 24-character hexadecimal MongoDB ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(dbId)) {
    const datePart = t.date ? t.date.split("T")[0].replace(/-/g, "") : "00000000";
    const lastFour = dbId.slice(-4);
    return `TX-${datePart}-${lastFour}`;
  }
  return dbId;
};

export default function TransactionTable({ 
  searchQuery: propSearchQuery, 
  setSearchQuery: propSetSearchQuery,
  refreshKey,
  currency = "USD",
  language = "EN"
}: TransactionTableProps) {
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localSearchQuery;
  const setSearchQuery = propSetSearchQuery !== undefined ? propSetSearchQuery : setLocalSearchQuery;

  // symbol removed; formatCurrency handles it

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/transactions");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        
        const formatted = data.map((t: any) => ({
          id: formatTransactionId(t),
          date: t.date.split("T")[0],
          description: t.description || "",
          category: t.category,
          type: t.type,
          amount: t.amount,
          status: "completed" as const,
        }));

        setTransactions(formatted);
      } catch (err) {
        setTransactions(mockTransactions);
      }
    }
    fetchTransactions();
  }, [refreshKey]);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === "all" || tx.type === filterType;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
            <CheckCircle2 size={12} />
            {t("Completed", language)}
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-warning-custom/10 text-warning-custom border border-warning-custom/10">
            <Clock size={12} />
            {t("Pending", language)}
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-danger-custom/10 text-danger-custom border border-danger-custom/10">
            <AlertCircle size={12} />
            {t("Failed", language)}
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col flex-1 min-w-0">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-white leading-none">
            {t("Recent Transactions", language)}
          </h2>
          <span className="text-xs text-muted-foreground-custom font-medium mt-1 block">
            {t("Monitor and audit all cash flow operations", language)}
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filters */}
          <div className="flex rounded-xl bg-zinc-950/40 p-1 border border-border-custom">
            {(["all", "income", "expense"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  filterType === type
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-muted-foreground-custom hover:text-white"
                }`}
              >
                {t(type, language)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
          <thead>
            <tr className="border-b border-border-custom text-xs font-bold uppercase tracking-wider text-muted-foreground-custom">
              <th className="pb-3 pl-2 w-[35%]">{t("Transaction", language)}</th>
              <th className="pb-3 w-[20%]">{t("Category", language)}</th>
              <th className="pb-3 w-[15%]">{t("Date", language)}</th>
              <th className="pb-3 w-[15%]">{t("Amount", language)}</th>
              <th className="pb-3 pr-2 w-[15%]">{t("Status", language)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/40">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="text-xs group hover:bg-white/[0.01] transition-colors"
                >
                  {/* Name & Type */}
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${
                          tx.type === "income"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {tx.type === "income" ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                          {tx.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground-custom font-medium truncate">
                          {t("ID:", language)} {tx.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-border-custom text-[10px] text-zinc-300 font-semibold uppercase tracking-wide">
                      {tx.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 text-zinc-400 font-medium">
                    {tx.date}
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-3.5 font-bold ${
                      tx.type === "income"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, currency)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 pr-2">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground-custom">
                  No transactions found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
