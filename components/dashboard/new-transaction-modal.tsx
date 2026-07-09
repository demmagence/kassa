"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Tag, AlertCircle } from "lucide-react";
import CustomSelect from "./custom-select";
import CustomDatePicker from "./custom-datepicker";
import { t } from "@/lib/locales";
import { convertToUSD } from "@/lib/currency";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  language?: string;
  currency?: string;
}

const generateReferenceCode = () => {
  const dateObj = new Date();
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TX-${y}${m}${d}-${rand}`;
};

export default function NewTransactionModal({
  isOpen,
  onClose,
  onAddSuccess,
  language = "EN",
  currency = "USD",
}: NewTransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Infrastructure");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeError, setActiveError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setType("expense");
      setCategory("Infrastructure");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setReference(generateReferenceCode());
      setError("");
      setActiveError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (error) {
      setActiveError(error);
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      setLoading(false);
      return;
    }

    // Convert amount to USD base before sending to database
    const amountUSD = convertToUSD(parsedAmount, currency);

    const payload = {
      amount: amountUSD,
      type,
      category,
      date: new Date(date).toISOString(),
      description: description || undefined,
      reference: reference || undefined,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to add transaction to database");
      }

      onAddSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError("Error connecting to database. Please make sure MongoDB Atlas network whitelist is active.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Infrastructure",
    "Freelance",
    "Rent & Facilities",
    "Design Resources",
    "Salary",
    "Utilities",
    "Marketing",
    "SaaS Subscription",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Toast Notification (Popup) */}
      <div 
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 transition-all duration-300 ease-out ${
          error 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/85 backdrop-blur-lg border border-rose-500/30 shadow-2xl shadow-rose-950/20 text-rose-300 text-xs font-medium">
          <span className="flex-shrink-0 text-rose-500 mt-0.5">
            <AlertCircle size={16} />
          </span>
          <div className="flex-1 leading-normal">{t(activeError, language)}</div>
          <button
            type="button"
            onClick={() => setError("")}
            className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors self-start -mt-1 -mr-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div 
        className="w-full max-w-lg glass-card p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden animate-in scale-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground-custom hover:text-white hover:bg-zinc-900/40 transition-colors"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-bold text-white mb-1">{t("Add New Transaction", language)}</h2>
        <p className="text-xs text-muted-foreground-custom mb-6">{t("Create a real-time ledger entry.", language)}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipe Transaksi */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                type === "expense"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "border-border-custom text-muted-foreground-custom hover:text-white"
              }`}
            >
                            {t("Expense (Pengeluaran)", language)}
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                type === "income"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "border-border-custom text-muted-foreground-custom hover:text-white"
              }`}
            >
                            {t("Income (Pemasukan)", language)}
            </button>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">{t("Amount", language)}</label>
            <div className="relative">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground-custom text-xs font-bold">
                {currency === "IDR" ? "Rp" : "$"}
              </span>
              <input
                type="text"
                inputMode="decimal"
                required
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                    setAmount(val);
                  }
                }}
                placeholder={currency === "IDR" ? "0" : "0.00"}
                className="h-10 w-full rounded-xl border border-border-custom bg-zinc-950/40 pl-9 pr-4 text-xs font-medium text-white placeholder-muted-foreground-custom outline-none focus:border-indigo-500 focus:bg-zinc-900/60"
              />
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">{t("Category", language)}</label>
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={categories.map((c) => ({ value: c, label: t(c, language) }))}
                triggerClassName="h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">{t("Date", language)}</label>
               <CustomDatePicker
                 value={date}
                 onChange={setDate}
                 triggerClassName="h-10"
                 language={language}
               />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground-custom tracking-wider">{t("Description", language)}</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
                            placeholder={t("e.g. Cloud Server Hosting", language)}
              className="h-10 w-full rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white placeholder-muted-foreground-custom outline-none focus:border-indigo-500 focus:bg-zinc-900/60"
            />
          </div>



          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <button
              id="modal-cancel-button"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-10 px-4 rounded-xl text-xs font-semibold border border-border-custom text-zinc-300 hover:text-white hover:bg-zinc-900/40 transition-colors flex items-center justify-center"
            >
                            {t("Cancel", language)}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-10 w-36 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors glow-primary disabled:opacity-50 flex items-center justify-center"
            >
                            {loading ? t("Saving...", language) : t("Add Transaction", language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
