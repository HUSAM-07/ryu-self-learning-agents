import type { Candle } from "@/lib/types";
import { calculateEMA } from "./ema";

export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

/**
 * MACD (Moving Average Convergence Divergence).
 *
 * MACD line     = EMA(fast) - EMA(slow)       (default 12, 26)
 * Signal line   = EMA(MACD line, signalPeriod) (default 9)
 * Histogram     = MACD - Signal
 *
 * Returns arrays the same length as candles. Entries that can't
 * be computed yet are NaN.
 */
export function calculateMACD(
  candles: Candle[],
  fast: number = 12,
  slow: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const len = candles.length;
  const macd: number[] = new Array(len).fill(NaN);
  const signal: number[] = new Array(len).fill(NaN);
  const histogram: number[] = new Array(len).fill(NaN);

  const emaFast = calculateEMA(candles, fast);
  const emaSlow = calculateEMA(candles, slow);

  // MACD line = fast EMA - slow EMA
  // Both EMAs need their respective periods to produce values
  const macdStart = slow - 1; // index where slow EMA first has a value
  for (let i = macdStart; i < len; i++) {
    if (!isNaN(emaFast[i]) && !isNaN(emaSlow[i])) {
      macd[i] = emaFast[i] - emaSlow[i];
    }
  }

  // Signal line = EMA of MACD values
  // We need to compute EMA over the non-NaN MACD values
  const macdValues: number[] = [];
  const macdIndices: number[] = [];
  for (let i = 0; i < len; i++) {
    if (!isNaN(macd[i])) {
      macdValues.push(macd[i]);
      macdIndices.push(i);
    }
  }

  if (macdValues.length >= signalPeriod) {
    // Seed signal with SMA of first signalPeriod MACD values
    let sum = 0;
    for (let i = 0; i < signalPeriod; i++) {
      sum += macdValues[i];
    }
    let prevSignal = sum / signalPeriod;
    signal[macdIndices[signalPeriod - 1]] = prevSignal;
    histogram[macdIndices[signalPeriod - 1]] =
      macd[macdIndices[signalPeriod - 1]] - prevSignal;

    const k = 2 / (signalPeriod + 1);
    for (let i = signalPeriod; i < macdValues.length; i++) {
      prevSignal = (macdValues[i] - prevSignal) * k + prevSignal;
      signal[macdIndices[i]] = prevSignal;
      histogram[macdIndices[i]] = macd[macdIndices[i]] - prevSignal;
    }
  }

  return { macd, signal, histogram };
}
