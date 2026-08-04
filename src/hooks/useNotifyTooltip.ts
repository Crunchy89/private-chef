"use client";

import { useCallback, useEffect, useState } from "react";
import type { TooltipTone } from "@/components/Tooltip";

type NotifyTone = Extract<TooltipTone, "success" | "error" | "warning">;

/**
 * Short-lived tooltip notification for admin save / update actions.
 */
export function useNotifyTooltip(durationMs = 3500) {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<NotifyTone>("success");

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs]);

  const notify = useCallback((nextMessage: string, nextTone: NotifyTone = "success") => {
    setTone(nextTone);
    setMessage(nextMessage);
  }, []);

  const clear = useCallback(() => {
    setMessage("");
  }, []);

  return {
    message,
    tone,
    open: Boolean(message),
    notify,
    clear,
  };
}
