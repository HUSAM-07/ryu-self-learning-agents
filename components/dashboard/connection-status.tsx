"use client";

import type { WSStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<WSStatus, { label: string; color: string; dot: string }> = {
  connected: { label: "Live", color: "text-green-400", dot: "bg-green-400" },
  connecting: { label: "Connecting", color: "text-yellow-400", dot: "bg-yellow-400" },
  disconnected: { label: "Offline", color: "text-red-400", dot: "bg-red-400" },
  error: { label: "Error", color: "text-red-400", dot: "bg-red-400" },
};

export function ConnectionStatus({ status }: { status: WSStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={cn("flex items-center gap-1.5 text-xs font-mono", config.color)}>
      <span className="relative flex h-2 w-2">
        {status === "connected" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", config.dot)} />
      </span>
      {config.label}
    </div>
  );
}
