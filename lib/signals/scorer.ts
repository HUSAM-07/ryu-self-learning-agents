import type {
  Candle,
  IndicatorData,
  IndicatorScore,
  TradingSignal,
  SignalDirection,
  SignalStrength,
} from "@/lib/types";

/**
 * Score RSI: -100 (extreme overbought) to +100 (extreme oversold).
 * Oversold = bullish (buy opportunity), overbought = bearish.
 */
function scoreRSI(rsi: number): IndicatorScore {
  let score: number;
  let reason: string;

  if (rsi < 20) {
    score = 100;
    reason = `RSI at ${rsi.toFixed(1)} — extremely oversold, strong buy signal`;
  } else if (rsi < 30) {
    score = 70;
    reason = `RSI at ${rsi.toFixed(1)} — oversold territory, buy signal`;
  } else if (rsi < 40) {
    score = 30;
    reason = `RSI at ${rsi.toFixed(1)} — approaching oversold, mild bullish`;
  } else if (rsi <= 60) {
    score = 0;
    reason = `RSI at ${rsi.toFixed(1)} — neutral zone`;
  } else if (rsi <= 70) {
    score = -30;
    reason = `RSI at ${rsi.toFixed(1)} — approaching overbought, mild bearish`;
  } else if (rsi <= 80) {
    score = -70;
    reason = `RSI at ${rsi.toFixed(1)} — overbought territory, sell signal`;
  } else {
    score = -100;
    reason = `RSI at ${rsi.toFixed(1)} — extremely overbought, strong sell signal`;
  }

  return { name: "RSI(14)", score, reason };
}

/**
 * Score EMA crossover: positive when EMA9 > EMA21 (bullish),
 * negative when EMA9 < EMA21 (bearish). Magnitude based on spread.
 */
function scoreEMA(
  ema9: number,
  ema21: number,
  price: number
): IndicatorScore {
  const spread = ((ema9 - ema21) / ema21) * 100; // percentage spread
  const priceAboveBoth = price > ema9 && price > ema21;
  const priceBelowBoth = price < ema9 && price < ema21;

  let score = Math.max(-100, Math.min(100, spread * 50)); // scale spread to score

  // Bonus for price position
  if (priceAboveBoth) score = Math.min(100, score + 20);
  if (priceBelowBoth) score = Math.max(-100, score - 20);

  let reason: string;
  if (ema9 > ema21) {
    reason = `EMA9 above EMA21 (spread ${spread.toFixed(3)}%) — bullish trend`;
    if (priceAboveBoth) reason += ", price above both EMAs";
  } else {
    reason = `EMA9 below EMA21 (spread ${spread.toFixed(3)}%) — bearish trend`;
    if (priceBelowBoth) reason += ", price below both EMAs";
  }

  return { name: "EMA(9/21)", score, reason };
}

/**
 * Score MACD: positive when MACD > signal (bullish momentum),
 * histogram magnitude indicates strength.
 */
function scoreMACD(
  macd: number,
  signal: number,
  histogram: number
): IndicatorScore {
  // Normalize histogram relative to signal magnitude
  const signalMag = Math.abs(signal) || 1;
  const normalizedHist = (histogram / signalMag) * 100;
  const score = Math.max(-100, Math.min(100, normalizedHist));

  let reason: string;
  if (macd > signal && histogram > 0) {
    reason = `MACD above signal line, histogram positive (${histogram.toFixed(1)}) — bullish momentum`;
  } else if (macd < signal && histogram < 0) {
    reason = `MACD below signal line, histogram negative (${histogram.toFixed(1)}) — bearish momentum`;
  } else {
    reason = `MACD crossing signal line (histogram ${histogram.toFixed(1)}) — momentum shift`;
  }

  return { name: "MACD(12,26,9)", score, reason };
}

/**
 * Score Bollinger Bands: price position within the bands.
 * Near upper band = overbought (-), near lower band = oversold (+).
 */
function scoreBollinger(
  price: number,
  upper: number,
  middle: number,
  lower: number,
  bandwidth: number
): IndicatorScore {
  const range = upper - lower;
  if (range === 0) return { name: "BB(20,2)", score: 0, reason: "Bollinger Bands flat" };

  // %B = (price - lower) / (upper - lower), ranges 0-1
  const percentB = (price - lower) / range;

  // Score: 0.5 = middle (neutral), <0.2 = oversold (bullish), >0.8 = overbought (bearish)
  const score = Math.max(-100, Math.min(100, (0.5 - percentB) * 200));

  let reason: string;
  if (percentB > 0.95) {
    reason = `Price above upper Bollinger Band (%B=${percentB.toFixed(2)}) — overbought`;
  } else if (percentB > 0.8) {
    reason = `Price near upper Bollinger Band (%B=${percentB.toFixed(2)}) — approaching overbought`;
  } else if (percentB < 0.05) {
    reason = `Price below lower Bollinger Band (%B=${percentB.toFixed(2)}) — oversold`;
  } else if (percentB < 0.2) {
    reason = `Price near lower Bollinger Band (%B=${percentB.toFixed(2)}) — approaching oversold`;
  } else {
    reason = `Price within Bollinger Bands (%B=${percentB.toFixed(2)}) — neutral`;
  }

  // Note squeeze
  if (bandwidth < 0.03) {
    reason += ". Bollinger squeeze detected — expect volatility expansion";
  }

  return { name: "BB(20,2)", score, reason };
}

/**
 * Generate composite trading signal from indicator data.
 * Each indicator contributes equally (0.25 weight).
 */
export function generateSignal(
  indicators: IndicatorData,
  candles: Candle[]
): TradingSignal {
  const price = candles[candles.length - 1].close;

  const scores: IndicatorScore[] = [
    scoreRSI(indicators.rsi.value),
    scoreEMA(indicators.ema.ema9, indicators.ema.ema21, price),
    scoreMACD(indicators.macd.macd, indicators.macd.signal, indicators.macd.histogram),
    scoreBollinger(
      price,
      indicators.bollinger.upper,
      indicators.bollinger.middle,
      indicators.bollinger.lower,
      indicators.bollinger.bandwidth
    ),
  ];

  // Equal-weight composite
  const composite = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

  // Direction
  let direction: SignalDirection;
  if (composite > 15) direction = "BUY";
  else if (composite < -15) direction = "SELL";
  else direction = "HOLD";

  // Confidence = |composite|, capped at 100
  const confidence = Math.min(100, Math.abs(composite));

  // Strength
  let strength: SignalStrength;
  if (confidence >= 70) strength = "STRONG";
  else if (confidence >= 40) strength = "MODERATE";
  else strength = "WEAK";

  return { direction, confidence, strength, composite, scores };
}
