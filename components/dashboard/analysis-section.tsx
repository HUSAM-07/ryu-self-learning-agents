"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisSectionProps {
  title: string;
  items: string[];
  icon: LucideIcon;
  color: string;
}

export function AnalysisSection({ title, items, icon: Icon, color }: AnalysisSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icon className={cn("h-3.5 w-3.5", color)} />
          <span className={cn("text-xs font-mono font-medium", color)}>{title}</span>
          <span className="text-[10px] font-mono text-muted-foreground">({items.length})</span>
        </div>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] font-mono text-muted-foreground leading-relaxed">
              <span className={cn("mt-1 shrink-0 w-1 h-1 rounded-full", color.replace("text-", "bg-"))} />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
