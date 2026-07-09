"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { t } from "@/lib/locales";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  language?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CustomDatePicker({
  value,
  onChange,
  className = "",
  triggerClassName = "",
  language = "EN",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isOpen) {
      const updateHeight = () => {
        const cancelButton = document.getElementById("modal-cancel-button");
        if (cancelButton && containerRef.current) {
          const cancelRect = cancelButton.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          const calculatedHeight = cancelRect.bottom - containerRect.bottom - 6; // 6px for mt-1.5
          if (calculatedHeight > 0) {
            setMaxHeight(calculatedHeight);
          }
        }
      };
      
      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, [isOpen]);

  // Parse local YYYY-MM-DD safely
  const parseLocalDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return new Date(y, m, d);
    }
    return new Date();
  };

  const formatLocalDate = (d: Date) => {
    const yearStr = d.getFullYear();
    const monthStr = String(d.getMonth() + 1).padStart(2, "0");
    const dayStr = String(d.getDate()).padStart(2, "0");
    return `${yearStr}-${monthStr}-${dayStr}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return dateStr;
  };

  const selectedDate = parseLocalDate(value);
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  // Sync view when value changes externally
  useEffect(() => {
    const d = parseLocalDate(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (dayNum: number, m: number, y: number) => {
    const d = new Date(y, m, dayNum);
    onChange(formatLocalDate(d));
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    onChange(formatLocalDate(today));
    setIsOpen(false);
  };

  // Generate calendar grid cells
  const cells = [];
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayIndex = getFirstDayOfMonth(viewYear, viewMonth);
  const prevDaysInMonth = getDaysInMonth(viewYear, viewMonth - 1);

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({
      day: prevDaysInMonth - i,
      month: viewMonth === 0 ? 11 : viewMonth - 1,
      year: viewMonth === 0 ? viewYear - 1 : viewYear,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to fill standard grid (always 42 cells/6 rows for fixed height layout)
  const totalCells = 42;
  const nextMonthDaysCount = totalCells - cells.length;
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    cells.push({
      day: i,
      month: viewMonth === 11 ? 0 : viewMonth + 1,
      year: viewMonth === 11 ? viewYear + 1 : viewYear,
      isCurrentMonth: false,
    });
  }

  // Helper to check if a day is the currently selected date
  const isSelected = (dayNum: number, m: number, y: number) => {
    return (
      dayNum === selectedDate.getDate() &&
      m === selectedDate.getMonth() &&
      y === selectedDate.getFullYear()
    );
  };

  // Helper to check if a day is today
  const isToday = (dayNum: number, m: number, y: number) => {
    const today = new Date();
    return (
      dayNum === today.getDate() &&
      m === today.getMonth() &&
      y === today.getFullYear()
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Input / Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border border-border-custom bg-zinc-950/40 px-3.5 text-xs font-medium text-white outline-none transition-all hover:bg-zinc-900/30 focus:border-indigo-500 focus:bg-zinc-900/60 ${triggerClassName}`}
      >
        <span>{formatDisplayDate(value)}</span>
        <CalendarIcon
          size={14}
          className={`text-muted-foreground-custom transition-colors ${
            isOpen ? "text-indigo-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Calendar Popup */}
      {isOpen && (
        <div 
          style={{ height: maxHeight ? `${maxHeight}px` : "156px" }}
          className="absolute left-0 right-0 z-50 mt-1.5 flex flex-col justify-between rounded-xl border border-white/10 bg-zinc-950/95 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-bold text-white tracking-wide">
              {t(MONTHS[viewMonth], language)} {viewYear}
            </h3>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-0.5 rounded-md border border-white/5 hover:border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white transition-all"
              >
                <ChevronLeft size={7} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-0.5 rounded-md border border-white/5 hover:border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white transition-all"
              >
                <ChevronRight size={7} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-[1px] text-center">
            {WEEKDAYS.map((wd) => (
              <span
                key={wd}
                className="text-[7px] font-bold text-muted-foreground-custom tracking-wider uppercase py-0"
              >
                {t(wd, language)}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-[1px] text-center">
            {cells.map((cell, idx) => {
              const active = isSelected(cell.day, cell.month, cell.year);
              const today = isToday(cell.day, cell.month, cell.year);

              return (
                <button
                  key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
                  type="button"
                  onClick={() => handleSelectDay(cell.day, cell.month, cell.year)}
                  className={`h-[14px] w-[14px] mx-auto rounded-md text-[7px] font-semibold flex items-center justify-center transition-all ${
                    active
                      ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20"
                      : today
                      ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold"
                      : cell.isCurrentMonth
                      ? "text-zinc-200 hover:bg-white/5 hover:text-white"
                      : "text-zinc-600 hover:bg-white/5 hover:text-zinc-400"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <button
              type="button"
              onClick={handleToday}
              className="text-[7px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {t("Today", language)}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[7px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              {t("Close", language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
