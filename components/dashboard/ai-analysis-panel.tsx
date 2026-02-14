"use client";

import type { AIAnalysis, TradingSignal, Candle, IndicatorData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignalCard } from "./signal-card";
import { AnalysisSection } from "./analysis-section";
import { IndicatorBreakdown } from "./indicator-breakdown";
import { useState } from "react";

interface AIAnalysisPanelProps {
  signal: TradingSignal | null;
  candles: Candle[];
  indicators: IndicatorData | null;
}

export function AIAnalysisPanel({ signal, candles, indicators }: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="px-4 py-3 border-b border-white/5">
        <h2 className="text-sm font-bold font-mono text-white/80">AI Analysis</h2>
        <p className="text-[10px] font-mono text-white/30 mt-0.5">Powered by Claude Opus</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

        {/* Signal card */}
        {signal && <SignalCard signal={signal} />}

        {/* AI analysis results */}
        {analysis && (
          <>
            <Separator className="bg-white/5" />

            {/* Summary */}
            <div className="text-[11px] font-mono text-white/70 leading-relaxed">
              {analysis.summary}
            </div>

            {/* Expandable sections */}
            <AnalysisSection
              title="Bullish Factors"
              items={analysis.bullishFactors}
              icon="📈"
              color="text-green-400"
            />
            <AnalysisSection
              title="Bearish Factors"
              items={analysis.bearishFactors}
              icon="📉"
              color="text-red-400"
            />
            <AnalysisSection
              title="Risk Factors"
              items={analysis.riskFactors}
              icon="⚠️"
              color="text-yellow-400"
            />

            {/* Indicator breakdown */}
            <IndicatorBreakdown items={analysis.indicatorBreakdown} />
          </>
        )}
      </div>
    </div>
  );
}
