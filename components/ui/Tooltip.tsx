"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

export default function Tooltip({
  label,
  side = "right",
  disabled = false,
  className,
  children,
}: {
  label: string;
  side?: "right" | "top";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const triggerRef = useRef<HTMLSpanElement>(null);

  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [open, setOpen] = useState(false);

  // Position is measured on demand and rendered with position:fixed, because
  // the sidebar is a scroll container and would clip an absolute tooltip.
  const show = () => {
    if (disabled) return;

    const element = triggerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    setCoords(
      side === "right"
        ? { top: rect.top + rect.height / 2, left: rect.right + 10 }
        : { top: rect.top - 8, left: rect.left + rect.width / 2 },
    );

    setOpen(true);
  };

  const hide = () => setOpen(false);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className={cn("flex", className)}
    >
      {children}

      <span
        role="tooltip"
        style={{ top: coords.top, left: coords.left }}
        className={cn(
          "pointer-events-none fixed z-50 whitespace-nowrap rounded-[9px] border border-line bg-card-2 px-2.5 py-1.5 text-xs font-semibold text-hi shadow-2xl transition duration-150 motion-reduce:transition-none",
          side === "right"
            ? "-translate-y-1/2"
            : "-translate-x-1/2 -translate-y-full",
          open ? "opacity-100" : "invisible opacity-0",
        )}
      >
        {label}
      </span>
    </span>
  );
}
