"use client";

import { useMemo, useState } from "react";
import type { Interval, TradingSymbol, SymbolConfig, TradingSignal, IndicatorData } from "@/lib/types";
import { SYMBOLS } from "@/lib/types";
import { useBinance } from "@/lib/binance/use-binance";
import { computeAllIndicators } from "@/lib/indicators";
import { generateSignal } from "@/lib/signals/scorer";
import { TopStatsBar } from "./top-stats-bar";
import { ChartToolbar } from "./chart-toolbar";
import { ConnectionStatus } from "./connection-status";
import { PriceChart } from "./price-chart";
import { AIAnalysisPanel } from "./ai-analysis-panel";
import { SymbolToggle } from "./symbol-toggle";
import { DragonLogo } from "@/components/landing/dragon-logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import Link from "next/link";

export function DashboardShell() {
  const [symbol, setSymbol] = useState<TradingSymbol>("BTCUSDT");
  const [interval, setInterval] = useState<Interval>("1h");
  const [overlays, setOverlays] = useState({ ema: true, bollinger: false });

  const symbolConfig: SymbolConfig = SYMBOLS.find((s) => s.symbol === symbol)!;

  const { candles, status, loading, error } = useBinance(symbol, interval);

  const indicators: IndicatorData | null = useMemo(
    () => (candles.length >= 34 ? computeAllIndicators(candles) : null),
    [candles]
  );

  const signal: TradingSignal | null = useMemo(
    () => (indicators ? generateSignal(indicators, candles) : null),
    [indicators, candles]
  );

  function toggleOverlay(overlay: "ema" | "bollinger") {
    setOverlays((prev) => ({ ...prev, [overlay]: !prev[overlay] }));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <DragonLogo size={24} />
              <span className="font-bold text-sm tracking-tight font-mono">Ryujin</span>
            </Link>
            <SymbolToggle value={symbol} onChange={setSymbol} />
          </div>
          <div className="flex items-center gap-4">
            <ConnectionStatus status={status} />
            <span className="text-[10px] font-mono text-foreground/20">{symbolConfig.label}</span>
            <AnimatedThemeToggler className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-[1600px] p-4">
        {/* Stats bar */}
        <TopStatsBar candles={candles} indicators={indicators} symbolConfig={symbolConfig} />

        {/* Loading state */}
        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="h-6 w-6 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
            <p className="text-xs font-mono text-muted-foreground">Fetching {symbolConfig.base} market data...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-4 border border-red-500/30 bg-red-500/10 rounded-lg p-4">
            <p className="text-xs font-mono text-red-400">{error}</p>
          </div>
        )}

        {/* Chart + Analysis layout */}
        {!loading && candles.length > 0 && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
            {/* Left: Chart area */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <div className="p-3 border-b border-border">
                <ChartToolbar
                  interval={interval}
                  onIntervalChange={setInterval}
                  overlays={overlays}
                  onToggleOverlay={toggleOverlay}
                />
              </div>
              <PriceChart candles={candles} overlays={overlays} />
            </div>

            {/* Right: AI Analysis panel — sticky with internal scroll */}
            <div className="lg:sticky lg:top-[calc(3rem+1px)] lg:max-h-[calc(100vh-3rem-1px-2rem)] border border-border rounded-lg bg-card overflow-hidden flex flex-col">
              <AIAnalysisPanel
                signal={signal}
                candles={candles}
                indicators={indicators}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
