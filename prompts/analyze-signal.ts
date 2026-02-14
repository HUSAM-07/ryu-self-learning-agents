import type { Candle, IndicatorData, TradingSignal } from "@/lib/types";

/**
 * Build the prompt for Claude to analyze the trading signal.
 *
 * Includes: last 20 candles, all indicator values, the algorithmic
 * signal with reasons. Instructs Claude to explain in layman's terms.
 */
export function buildAnalysisPrompt(
  candles: Candle[],
  indicators: IndicatorData,
  signal: TradingSignal
): string {
  const recentCandles = candles.slice(-20);

  const candleTable = recentCandles
    .map(
      (c) =>
        `${new Date(c.time * 1000).toISOString().slice(0, 16)} | O:${c.open.toFixed(2)} H:${c.high.toFixed(2)} L:${c.low.toFixed(2)} C:${c.close.toFixed(2)} V:${c.volume.toFixed(2)}`
    )
    .join("\n");

  const indicatorSummary = `
RSI(14): ${indicators.rsi.value.toFixed(2)}
EMA(9): ${indicators.ema.ema9.toFixed(2)}
EMA(21): ${indicators.ema.ema21.toFixed(2)}
MACD Line: ${indicators.macd.macd.toFixed(4)}
MACD Signal: ${indicators.macd.signal.toFixed(4)}
MACD Histogram: ${indicators.macd.histogram.toFixed(4)}
Bollinger Upper: ${indicators.bollinger.upper.toFixed(2)}
Bollinger Middle: ${indicators.bollinger.middle.toFixed(2)}
Bollinger Lower: ${indicators.bollinger.lower.toFixed(2)}
Bollinger Bandwidth: ${(indicators.bollinger.bandwidth * 100).toFixed(3)}%`.trim();

  const signalSummary = `
Direction: ${signal.direction}
Confidence: ${signal.confidence.toFixed(1)}%
Strength: ${signal.strength}
Composite Score: ${signal.composite.toFixed(2)}

Individual Scores:
${signal.scores.map((s) => `  ${s.name}: ${s.score.toFixed(1)} — ${s.reason}`).join("\n")}`.trim();

  return `You are Ryujin, an AI Bitcoin trading signal analyst. Analyze the following BTCUSDT market data and provide your assessment.

## Recent Candles (Last 20)
${candleTable}

## Computed Indicators
${indicatorSummary}

## Algorithmic Signal
${signalSummary}

## Your Task
Analyze the market conditions and provide a JSON response with the following structure:
{
  "summary": "2-3 sentence plain English market overview — explain what's happening as if teaching someone who knows candlestick charts but not the math behind indicators",
  "bullishFactors": ["array of bullish observations, each 1 sentence"],
  "bearishFactors": ["array of bearish observations, each 1 sentence"],
  "riskFactors": ["array of risk warnings — volatility, divergences, upcoming events etc."],
  "indicatorBreakdown": [
    {
      "name": "RSI(14)",
      "value": "the numeric value as string",
      "interpretation": "1-2 sentence explanation in layman's terms of what this indicator is saying",
      "sentiment": "bullish" | "bearish" | "neutral"
    }
    // ... one entry for each of: RSI(14), EMA(9/21), MACD(12,26,9), BB(20,2)
  ]
}

Important:
- Explain as if teaching someone who understands charts but not indicator math
- Be specific about numbers — reference actual values from the data
- If the algorithmic signal seems wrong based on your analysis, explain why
- Include at least 2 items in each factors array
- Keep each factor to one clear sentence`;
}
