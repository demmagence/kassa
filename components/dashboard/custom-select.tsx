"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  triggerClassName?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  triggerClassName = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

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

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border border-border-custom bg-zinc-950/40 px-3 text-xs font-medium text-white outline-none transition-all hover:bg-zinc-900/30 focus:border-indigo-500 focus:bg-zinc-900/60 ${triggerClassName}`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground-custom transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div 
          style={{ maxHeight: maxHeight ? `${maxHeight}px` : "156px" }}
          className="absolute left-0 right-0 z-50 mt-1.5 overflow-y-auto no-scrollbar rounded-xl border border-white/10 bg-zinc-950/90 p-1 shadow-2xl backdrop-blur-md"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-lg px-2.5 py-1 text-left text-[10px] font-medium transition-colors ${
                  isSelected
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
