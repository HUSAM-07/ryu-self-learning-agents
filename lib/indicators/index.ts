import type { Candle, IndicatorData } from "@/lib/types";
import { calculateEMA } from "./ema";
import { calculateRSI } from "./rsi";
import { calculateMACD } from "./macd";
import { calculateBollinger } from "./bollinger";

export { calculateEMA } from "./ema";
export { calculateRSI } from "./rsi";
export { calculateMACD } from "./macd";
export { calculateBollinger } from "./bollinger";

/**
 * Compute all indicators from a candle array.
 * Returns the latest values for each indicator.
 *
 * Returns null if there isn't enough data to compute all indicators
 * (need at least 34 candles: 26 for MACD slow + 9 for signal = 34).
 */
export function computeAllIndicators(candles: Candle[]): IndicatorData | null {
  if (candles.length < 34) return null;

  const last = candles.length - 1;

  // EMA
  const ema9 = calculateEMA(candles, 9);
  const ema21 = calculateEMA(candles, 21);

  // RSI
  const rsi = calculateRSI(candles, 14);

  // MACD
  const macdResult = calculateMACD(candles, 12, 26, 9);

  // Bollinger Bands
  const bb = calculateBollinger(candles, 20, 2);

  // Check that all values are valid at the last index
  if (
    isNaN(ema9[last]) || isNaN(ema21[last]) ||
    isNaN(rsi[last]) ||
    isNaN(macdResult.macd[last]) || isNaN(macdResult.signal[last]) ||
    isNaN(bb.upper[last])
  ) {
    return null;
  }

  return {
    ema: {
      ema9: ema9[last],
      ema21: ema21[last],
    },
    rsi: {
      value: rsi[last],
    },
    macd: {
      macd: macdResult.macd[last],
      signal: macdResult.signal[last],
      histogram: macdResult.histogram[last],
    },
    bollinger: {
      upper: bb.upper[last],
      middle: bb.middle[last],
      lower: bb.lower[last],
      bandwidth: bb.bandwidth[last],
    },
  };
}
