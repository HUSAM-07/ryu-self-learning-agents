import type { Candle } from "@/lib/types";

export interface BollingerResult {
  upper: number[];
  middle: number[];
  lower: number[];
  bandwidth: number[];
}

/**
 * Bollinger Bands.
 *
 * Middle = SMA(period)
 * Upper  = Middle + (stdDev * multiplier)
 * Lower  = Middle - (stdDev * multiplier)
 * Bandwidth = (Upper - Lower) / Middle
 *
 * Default: period=20, multiplier=2
 */
export function calculateBollinger(
  candles: Candle[],
  period: number = 20,
  multiplier: number = 2
): BollingerResult {
  const len = candles.length;
  const upper: number[] = new Array(len).fill(NaN);
  const middle: number[] = new Array(len).fill(NaN);
  const lower: number[] = new Array(len).fill(NaN);
  const bandwidth: number[] = new Array(len).fill(NaN);

  if (len < period) return { upper, middle, lower, bandwidth };

  for (let i = period - 1; i < len; i++) {
    // SMA
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += candles[j].close;
    }
    const sma = sum / period;

    // Standard deviation
    let sqSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sqSum += (candles[j].close - sma) ** 2;
    }
    const stdDev = Math.sqrt(sqSum / period);

    middle[i] = sma;
    upper[i] = sma + stdDev * multiplier;
    lower[i] = sma - stdDev * multiplier;
    bandwidth[i] = middle[i] !== 0 ? (upper[i] - lower[i]) / middle[i] : 0;
  }

  return { upper, middle, lower, bandwidth };
}
