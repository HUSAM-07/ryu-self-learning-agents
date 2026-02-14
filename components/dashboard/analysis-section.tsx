"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnalysisSectionProps {
  title: string;
  items: string[];
  icon: string;
  color: string;
}

export function AnalysisSection({ title, items, icon, color }: AnalysisSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className={cn("text-xs font-mono font-medium", color)}>{title}</span>
          <span className="text-[10px] font-mono text-white/30">({items.length})</span>
        </div>
        <span className="text-white/30 text-xs">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] font-mono text-white/60 leading-relaxed">
              <span className={cn("mt-1 shrink-0 w-1 h-1 rounded-full", color.replace("text-", "bg-"))} />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
