"use client";

import { useMemo, useState } from "react";
import type { Interval, TradingSignal, IndicatorData } from "@/lib/types";
import { useBinance } from "@/lib/binance/use-binance";
import { computeAllIndicators } from "@/lib/indicators";
import { generateSignal } from "@/lib/signals/scorer";
import { TopStatsBar } from "./top-stats-bar";
import { ChartToolbar } from "./chart-toolbar";
import { ConnectionStatus } from "./connection-status";
import { PriceChart } from "./price-chart";
import { AIAnalysisPanel } from "./ai-analysis-panel";
import { DragonLogo } from "@/components/landing/dragon-logo";
import Link from "next/link";

export function DashboardShell() {
  const [interval, setInterval] = useState<Interval>("1h");
  const [overlays, setOverlays] = useState({ ema: true, bollinger: false });

  const { candles, status, loading, error } = useBinance(interval);

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between px-4 h-12">
          <Link href="/" className="flex items-center gap-2">
            <DragonLogo size={24} />
            <span className="font-bold text-sm tracking-tight font-mono">Ryujin</span>
          </Link>
          <div className="flex items-center gap-4">
            <ConnectionStatus status={status} />
            <span className="text-[10px] font-mono text-white/20">BTCUSDT</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-[1600px] p-4">
        {/* Stats bar */}
        <TopStatsBar candles={candles} indicators={indicators} />

        {/* Loading state */}
        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="h-6 w-6 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
            <p className="text-xs font-mono text-white/40">Fetching market data...</p>
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
            <div className="border border-white/5 rounded-lg bg-white/[0.01] overflow-hidden">
              <div className="p-3 border-b border-white/5">
                <ChartToolbar
                  interval={interval}
                  onIntervalChange={setInterval}
                  overlays={overlays}
                  onToggleOverlay={toggleOverlay}
                />
              </div>
              <PriceChart candles={candles} overlays={overlays} />
            </div>

            {/* Right: AI Analysis panel */}
            <div className="border border-white/5 rounded-lg bg-white/[0.01] overflow-hidden">
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
