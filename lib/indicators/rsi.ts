import type { Candle } from "@/lib/types";

/**
 * Relative Strength Index (Wilder's smoothing method).
 *
 * RSI = 100 - (100 / (1 + RS))
 * RS  = avgGain / avgLoss
 *
 * The first average is a simple mean of the first `period` gains/losses.
 * Subsequent values use Wilder's smoothing:
 *   avgGain = (prevAvgGain * (period-1) + currentGain) / period
 *
 * Returns an array the same length as `candles` — entries before
 * period+1 values are available are NaN.
 */
export function calculateRSI(candles: Candle[], period: number = 14): number[] {
  const result: number[] = new Array(candles.length).fill(NaN);
  if (candles.length < period + 1) return result;

  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    changes.push(candles[i].close - candles[i - 1].close);
  }

  // Initial average gain/loss (simple mean of first `period` changes)
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] >= 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }
  avgGain /= period;
  avgLoss /= period;

  // First RSI value
  const rs0 = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result[period] = 100 - 100 / (1 + rs0);

  // Subsequent RSI values using Wilder's smoothing
  for (let i = period; i < changes.length; i++) {
    const gain = changes[i] >= 0 ? changes[i] : 0;
    const loss = changes[i] < 0 ? Math.abs(changes[i]) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result[i + 1] = 100 - 100 / (1 + rs);
  }

  return result;
}
