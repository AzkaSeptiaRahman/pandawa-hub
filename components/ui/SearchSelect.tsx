"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export default function SearchSelect({
  placeholder,
  value,
  options,
  onChange,
  disabled,
  disabledPlaceholder,
  open,
  onToggle,
  loading,
}: {
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
  open: boolean;
  onToggle: () => void;
  loading?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const display = disabled && disabledPlaceholder
    ? disabledPlaceholder
    : value || placeholder;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-[13px] border border-line",
          "bg-field px-4 py-3.5 text-left text-hi outline-none transition",
          "focus:border-brand/60 focus:ring-2 focus:ring-brand/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-low"
        )}
      >
        <span className="truncate">{loading ? "Loading..." : display}</span>
        <ChevronDown size={16} className="shrink-0 text-low" />
      </button>

      {open && options.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-[13px] border border-line bg-card-2 shadow-2xl">
          {options.map((item) => (
            <button
              type="button"
              key={item}
              onMouseEnter={() => setHover(item)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(item)}
              className={cn(
                "block w-full px-4 py-3 text-left text-sm transition",
                hover === item
                  ? "bg-brand text-white"
                  : "text-mid hover:text-hi"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
