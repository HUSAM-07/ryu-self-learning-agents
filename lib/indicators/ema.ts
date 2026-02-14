import type { Candle } from "@/lib/types";

/**
 * Exponential Moving Average.
 *
 * Uses SMA as the seed for the first `period` values, then applies
 * the standard multiplier formula:
 *   EMA = (close - prevEMA) * k + prevEMA
 *   k   = 2 / (period + 1)
 *
 * Returns an array the same length as `candles` — entries before
 * the period is reached are NaN.
 */
export function calculateEMA(candles: Candle[], period: number): number[] {
  const result: number[] = new Array(candles.length).fill(NaN);
  if (candles.length < period) return result;

  // Seed: SMA of first `period` closes
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  result[period - 1] = sum / period;

  const k = 2 / (period + 1);
  for (let i = period; i < candles.length; i++) {
    result[i] = (candles[i].close - result[i - 1]) * k + result[i - 1];
  }

  return result;
}
