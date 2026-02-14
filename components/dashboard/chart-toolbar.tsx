"use client";

import type { Interval } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartToolbarProps {
  interval: Interval;
  onIntervalChange: (interval: Interval) => void;
  overlays: { ema: boolean; bollinger: boolean };
  onToggleOverlay: (overlay: "ema" | "bollinger") => void;
}

const INTERVALS: { value: Interval; label: string }[] = [
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
];

export function ChartToolbar({
  interval,
  onIntervalChange,
  overlays,
  onToggleOverlay,
}: ChartToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {INTERVALS.map((item) => (
          <Button
            key={item.value}
            variant={interval === item.value ? "default" : "ghost"}
            size="xs"
            onClick={() => onIntervalChange(item.value)}
            className={cn(
              "font-mono text-[11px]",
              interval === item.value
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onToggleOverlay("ema")}
          className={cn(
            "font-mono text-[11px]",
            overlays.ema ? "text-blue-400" : "text-muted-foreground/50"
          )}
        >
          EMA
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onToggleOverlay("bollinger")}
          className={cn(
            "font-mono text-[11px]",
            overlays.bollinger ? "text-purple-400" : "text-muted-foreground/50"
          )}
        >
          BB
        </Button>
      </div>
    </div>
  );
}
