"use client";

import type { TradingSymbol } from "@/lib/types";
import { SYMBOLS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SymbolToggleProps {
  value: TradingSymbol;
  onChange: (symbol: TradingSymbol) => void;
}

export function SymbolToggle({ value, onChange }: SymbolToggleProps) {
  return (
    <div className="flex rounded-md border border-border bg-muted/50 p-0.5">
      {SYMBOLS.map((s) => (
        <button
          key={s.symbol}
          onClick={() => onChange(s.symbol)}
          className={cn(
            "px-2.5 py-1 rounded-sm text-[11px] font-mono font-semibold transition-all",
            value === s.symbol
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {s.base}
        </button>
      ))}
    </div>
  );
}
