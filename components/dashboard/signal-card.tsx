"use client";

import type { TradingSignal } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DIRECTION_STYLES: Record<string, { bg: string; text: string; glow: string }> = {
  BUY: {
    bg: "bg-green-500/10 border-green-500/30",
    text: "text-green-400",
    glow: "shadow-[0_0_20px_rgba(74,222,128,0.15)]",
  },
  SELL: {
    bg: "bg-red-500/10 border-red-500/30",
    text: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  },
  HOLD: {
    bg: "bg-yellow-500/10 border-yellow-500/30",
    text: "text-yellow-400",
    glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
  },
};

export function SignalCard({ signal }: { signal: TradingSignal }) {
  const style = DIRECTION_STYLES[signal.direction];

  return (
    <div className={cn("border rounded-lg p-4", style.bg, style.glow)}>
      <div className="flex items-center justify-between mb-3">
        <span className={cn("text-2xl font-bold font-mono", style.text)}>
          {signal.direction}
        </span>
        <span className={cn("text-lg font-bold font-mono", style.text)}>
          {signal.confidence.toFixed(0)}%
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge
          variant="outline"
          className={cn("font-mono text-[10px]", style.text, "border-current/30")}
        >
          {signal.strength}
        </Badge>
        <span className="text-[10px] font-mono text-muted-foreground">
          Score: {signal.composite.toFixed(1)}
        </span>
      </div>

      {/* Confidence bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", {
            "bg-green-400": signal.direction === "BUY",
            "bg-red-400": signal.direction === "SELL",
            "bg-yellow-400": signal.direction === "HOLD",
          })}
          style={{ width: `${signal.confidence}%` }}
        />
      </div>

      {/* Per-indicator scores */}
      <div className="mt-3 space-y-1.5">
        {signal.scores.map((s) => (
          <div key={s.name} className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-muted-foreground">{s.name}</span>
            <span
              className={cn({
                "text-green-400": s.score > 15,
                "text-red-400": s.score < -15,
                "text-yellow-400": s.score >= -15 && s.score <= 15,
              })}
            >
              {s.score > 0 ? "+" : ""}
              {s.score.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
