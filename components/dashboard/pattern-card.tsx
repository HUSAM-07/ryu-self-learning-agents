"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DetectedPattern } from "@/lib/types";
import { PatternVisualization } from "./pattern-visualizations";

const BIAS_STYLES: Record<string, { border: string; badge: string; text: string }> = {
  bullish: { border: "border-green-500/30", badge: "bg-green-500/10 text-green-400 border-green-500/30", text: "text-green-400" },
  bearish: { border: "border-red-500/30", badge: "bg-red-500/10 text-red-400 border-red-500/30", text: "text-red-400" },
  neutral: { border: "border-yellow-500/30", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", text: "text-yellow-400" },
};

export function PatternCard({ pattern }: { pattern: DetectedPattern }) {
  const [open, setOpen] = useState(false);
  const style = BIAS_STYLES[pattern.type];

  return (
    <div className={cn("border rounded-lg overflow-hidden", style.border)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="text-xs font-mono font-medium text-foreground/90">{pattern.name}</span>
          <Badge variant="outline" className={cn("text-[9px] font-mono py-0 px-1.5", style.badge)}>
            {pattern.type}
          </Badge>
        </div>
        <span className={cn("text-[11px] font-mono font-medium", style.text)}>
          {pattern.confidence}%
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-3">
          <PatternVisualization patternName={pattern.name} bias={pattern.type} />

          <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
            {pattern.description}
          </p>

          {pattern.keyPoints.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-foreground/60">Key Points</span>
              {pattern.keyPoints.map((kp, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">{kp.label}</span>
                  <span className="text-foreground/70">${kp.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
