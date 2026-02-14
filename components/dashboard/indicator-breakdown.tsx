"use client";

import { useState } from "react";
import type { AIIndicatorBreakdown, Sentiment } from "@/lib/types";
import { cn } from "@/lib/utils";

const SENTIMENT_STYLES: Record<Sentiment, { dot: string; text: string }> = {
  bullish: { dot: "bg-green-400", text: "text-green-400" },
  bearish: { dot: "bg-red-400", text: "text-red-400" },
  neutral: { dot: "bg-yellow-400", text: "text-yellow-400" },
};

export function IndicatorBreakdown({ items }: { items: AIIndicatorBreakdown[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="text-xs font-mono font-medium text-white/80">Indicator Detail</span>
          <span className="text-[10px] font-mono text-white/30">({items.length})</span>
        </div>
        <span className="text-white/30 text-xs">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-3">
          {items.map((item) => {
            const style = SENTIMENT_STYLES[item.sentiment];
            return (
              <div key={item.name} className="border border-white/5 rounded p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono font-medium text-white/80">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
                    <span className={cn("text-[10px] font-mono capitalize", style.text)}>
                      {item.sentiment}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] font-mono text-white/40 mb-1">
                  Value: {item.value}
                </p>
                <p className="text-[11px] font-mono text-white/60 leading-relaxed">
                  {item.interpretation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
