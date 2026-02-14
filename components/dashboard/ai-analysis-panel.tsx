"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import type { AIAnalysis, TradingSignal, Candle, IndicatorData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SignalCard } from "./signal-card";
import { AnalysisSection } from "./analysis-section";
import { IndicatorBreakdown } from "./indicator-breakdown";
import { PatternsPanel } from "./patterns-panel";
import { detectPatterns } from "@/lib/patterns/detector";

interface AIAnalysisPanelProps {
  signal: TradingSignal | null;
  candles: Candle[];
  indicators: IndicatorData | null;
}

function MarketBiasGauge({ bias }: { bias: number }) {
  // bias: -100 to +100, map to 0-100% position
  const position = ((bias + 100) / 200) * 100;
  const label = bias > 30 ? "Bullish" : bias < -30 ? "Bearish" : "Neutral";
  const color = bias > 30 ? "text-green-400" : bias < -30 ? "text-red-400" : "text-yellow-400";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">Market Bias</span>
        <span className={cn("text-[10px] font-mono font-medium", color)}>
          {label} ({bias > 0 ? "+" : ""}{bias})
        </span>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-background shadow-md transition-all duration-500"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-mono text-muted-foreground/50">
        <span>-100</span>
        <span>0</span>
        <span>+100</span>
      </div>
    </div>
  );
}

export function AIAnalysisPanel({ signal, candles, indicators }: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "patterns">("analysis");

  const patterns = useMemo(() => detectPatterns(candles), [candles]);

  async function runAnalysis() {
    if (!signal || !indicators || candles.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candles, indicators, signal }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data: AIAnalysis = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-bold font-mono text-foreground/80">AI Analysis</h2>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Powered by Grok</p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("analysis")}
          className={cn(
            "flex-1 text-[11px] font-mono py-2 transition-colors cursor-pointer",
            activeTab === "analysis"
              ? "text-green-400 border-b-2 border-green-400 font-medium"
              : "text-muted-foreground hover:text-foreground/70"
          )}
        >
          Analysis
        </button>
        <button
          onClick={() => setActiveTab("patterns")}
          className={cn(
            "flex-1 text-[11px] font-mono py-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5",
            activeTab === "patterns"
              ? "text-green-400 border-b-2 border-green-400 font-medium"
              : "text-muted-foreground hover:text-foreground/70"
          )}
        >
          Patterns
          {patterns.length > 0 && (
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
              activeTab === "patterns"
                ? "bg-green-500/20 text-green-400"
                : "bg-muted text-muted-foreground"
            )}>
              {patterns.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {activeTab === "analysis" ? (
          <>
            {/* Run button */}
            <Button
              onClick={runAnalysis}
              disabled={loading || !signal}
              className="w-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 font-mono text-xs disabled:opacity-30"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 border border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Run AI Analysis"
              )}
            </Button>

            {/* Error */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-3">
                <p className="text-[11px] font-mono text-red-400">{error}</p>
              </div>
            )}

            {/* Signal card + AI analysis */}
            {analysis ? (
              <>
                {signal && <SignalCard signal={signal} />}

                {analysis.marketBias !== undefined && (
                  <MarketBiasGauge bias={analysis.marketBias} />
                )}

                <Separator className="bg-border" />

                {/* Summary */}
                <div className="text-[11px] font-mono text-foreground/70 leading-relaxed">
                  {analysis.summary}
                </div>

                {/* Expandable sections */}
                <AnalysisSection
                  title="Bullish Factors"
                  items={analysis.bullishFactors}
                  icon={TrendingUp}
                  color="text-green-400"
                />
                <AnalysisSection
                  title="Bearish Factors"
                  items={analysis.bearishFactors}
                  icon={TrendingDown}
                  color="text-red-400"
                />
                <AnalysisSection
                  title="Risk Factors"
                  items={analysis.riskFactors}
                  icon={AlertTriangle}
                  color="text-yellow-400"
                />

                {/* Indicator breakdown */}
                <IndicatorBreakdown items={analysis.indicatorBreakdown} />
              </>
            ) : !loading ? (
              <div className="text-[10px] font-mono text-muted-foreground/50 text-center py-4">
                Click above to generate AI-powered signal
              </div>
            ) : null}
          </>
        ) : (
          <PatternsPanel patterns={patterns} />
        )}
      </div>
    </div>
  );
}
