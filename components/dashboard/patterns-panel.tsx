"use client";

import { Search } from "lucide-react";
import type { DetectedPattern } from "@/lib/types";
import { PatternCard } from "./pattern-card";

export function PatternsPanel({ patterns }: { patterns: DetectedPattern[] }) {
  if (patterns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Search className="h-6 w-6 text-muted-foreground/40 mb-3" />
        <p className="text-[11px] font-mono text-muted-foreground/50">
          No patterns detected in current timeframe
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {patterns.map((p, i) => (
        <PatternCard key={`${p.name}-${i}`} pattern={p} />
      ))}
    </div>
  );
}
