"use client";

import { useId, type ReactNode } from "react";

export type TooltipTone = "default" | "warning" | "error" | "success";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  /** Force visible (e.g. after save / rate limit). */
  open?: boolean;
  tone?: TooltipTone;
  placement?: "top" | "bottom";
  className?: string;
};

const toneClass: Record<TooltipTone, string> = {
  default: "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
  warning: "bg-amber-900 text-amber-50",
  error: "bg-error-600 text-white",
  success: "bg-success-600 text-white",
};

const arrowTone: Record<TooltipTone, string> = {
  default: "border-t-gray-900 dark:border-t-white",
  warning: "border-t-amber-900",
  error: "border-t-error-600",
  success: "border-t-success-600",
};

const arrowToneBottom: Record<TooltipTone, string> = {
  default: "border-b-gray-900 dark:border-b-white",
  warning: "border-b-amber-900",
  error: "border-b-error-600",
  success: "border-b-success-600",
};

/**
 * Lightweight tooltip. Shows on hover/focus, or when `open` is true.
 */
export function Tooltip({
  content,
  children,
  open = false,
  tone = "default",
  placement = "top",
  className = "",
}: TooltipProps) {
  const id = useId();
  const isTop = placement === "top";

  return (
    <div className={`group relative inline-flex ${className}`}>
      <div className="w-full" aria-describedby={open ? id : undefined}>
        {children}
      </div>
      <div
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-30 w-max max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg px-3 py-2 text-center text-xs leading-relaxed shadow-theme-sm transition-opacity duration-200 sm:text-sm ${
          isTop ? "bottom-[calc(100%+10px)]" : "top-[calc(100%+10px)]"
        } ${toneClass[tone]} ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        }`}
      >
        {content}
        <span
          aria-hidden
          className={`absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-x-transparent ${
            isTop
              ? `top-full border-t-[6px] ${arrowTone[tone]}`
              : `bottom-full border-b-[6px] ${arrowToneBottom[tone]}`
          }`}
        />
      </div>
    </div>
  );
}
