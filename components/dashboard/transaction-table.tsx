"use client";

import React, { useState } from "react";
import { mockTransactions, Transaction } from "@/data/mock-data";
import { ArrowUpRight, ArrowDownRight, Search, SlidersHorizontal, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function TransactionTable() {
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = mockTransactions.filter((tx) => {
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
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-warning-custom/10 text-warning-custom border border-warning-custom/10">
            <Clock size={12} />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-danger-custom/10 text-danger-custom border border-danger-custom/10">
            <AlertCircle size={12} />
            Failed
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
            Recent Transactions
          </h2>
          <span className="text-xs text-muted-foreground-custom font-medium mt-1 block">
            Monitor and audit all cash flow operations
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input for Mobile/Tablet */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground-custom" />
            <input
              type="text"
              placeholder="Search desc or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full sm:w-48 rounded-lg border border-border-custom bg-zinc-950/40 pl-8 pr-3 text-xs font-medium text-white placeholder-muted-foreground-custom outline-none transition-all duration-200 focus:border-indigo-500 focus:w-60 focus:bg-zinc-900/60"
            />
          </div>

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
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border-custom text-xs font-bold uppercase tracking-wider text-muted-foreground-custom">
              <th className="pb-3 pl-2">Transaction</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3 pr-2">Status</th>
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
                  <td className="py-3.5 pl-2 flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
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
                    <div>
                      <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {tx.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground-custom font-medium">
                        ID: {tx.id}
                      </p>
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
                    {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
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
