import type { Candle, DetectedPattern, PatternKeyPoint } from "@/lib/types";

interface SwingPoint {
  index: number;
  price: number;
  type: "high" | "low";
}

function findSwingPoints(candles: Candle[], lookback = 5): SwingPoint[] {
  const points: SwingPoint[] = [];

  for (let i = lookback; i < candles.length - lookback; i++) {
    let isHigh = true;
    let isLow = true;

    for (let j = 1; j <= lookback; j++) {
      if (candles[i].high <= candles[i - j].high || candles[i].high <= candles[i + j].high) {
        isHigh = false;
      }
      if (candles[i].low >= candles[i - j].low || candles[i].low >= candles[i + j].low) {
        isLow = false;
      }
    }

    if (isHigh) points.push({ index: i, price: candles[i].high, type: "high" });
    if (isLow) points.push({ index: i, price: candles[i].low, type: "low" });
  }

  return points;
}

function pctDiff(a: number, b: number): number {
  return Math.abs(a - b) / ((a + b) / 2) * 100;
}

function detectDoubleTop(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const highs = swings.filter((s) => s.type === "high");
  for (let i = highs.length - 1; i >= 1; i--) {
    const h2 = highs[i];
    const h1 = highs[i - 1];
    if (h2.index - h1.index < 5) continue;

    if (pctDiff(h1.price, h2.price) > 1.5) continue;

    // Find valley between
    const lows = swings.filter((s) => s.type === "low" && s.index > h1.index && s.index < h2.index);
    if (lows.length === 0) continue;
    const valley = lows.reduce((a, b) => (a.price < b.price ? a : b));
    const dropPct = ((h1.price - valley.price) / h1.price) * 100;
    if (dropPct < 3) continue;

    const confidence = Math.min(90, 50 + dropPct * 3 + (1.5 - pctDiff(h1.price, h2.price)) * 10);
    return {
      name: "Double Top",
      type: "bearish",
      confidence: Math.round(confidence),
      description: `Two peaks at ~$${h1.price.toFixed(0)} with a ${dropPct.toFixed(1)}% valley between them, suggesting resistance and potential reversal.`,
      keyPoints: [
        { label: "Peak 1", index: h1.index, price: h1.price },
        { label: "Valley", index: valley.index, price: valley.price },
        { label: "Peak 2", index: h2.index, price: h2.price },
      ],
      startIndex: h1.index,
      endIndex: h2.index,
    };
  }
  return null;
}

function detectDoubleBottom(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const lows = swings.filter((s) => s.type === "low");
  for (let i = lows.length - 1; i >= 1; i--) {
    const l2 = lows[i];
    const l1 = lows[i - 1];
    if (l2.index - l1.index < 5) continue;

    if (pctDiff(l1.price, l2.price) > 1.5) continue;

    const highs = swings.filter((s) => s.type === "high" && s.index > l1.index && s.index < l2.index);
    if (highs.length === 0) continue;
    const peak = highs.reduce((a, b) => (a.price > b.price ? a : b));
    const risePct = ((peak.price - l1.price) / l1.price) * 100;
    if (risePct < 3) continue;

    const confidence = Math.min(90, 50 + risePct * 3 + (1.5 - pctDiff(l1.price, l2.price)) * 10);
    return {
      name: "Double Bottom",
      type: "bullish",
      confidence: Math.round(confidence),
      description: `Two troughs at ~$${l1.price.toFixed(0)} with a ${risePct.toFixed(1)}% peak between them, suggesting support and potential reversal upward.`,
      keyPoints: [
        { label: "Trough 1", index: l1.index, price: l1.price },
        { label: "Peak", index: peak.index, price: peak.price },
        { label: "Trough 2", index: l2.index, price: l2.price },
      ],
      startIndex: l1.index,
      endIndex: l2.index,
    };
  }
  return null;
}

function detectHeadAndShoulders(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const highs = swings.filter((s) => s.type === "high");
  for (let i = highs.length - 1; i >= 2; i--) {
    const right = highs[i];
    const head = highs[i - 1];
    const left = highs[i - 2];

    if (head.price <= left.price || head.price <= right.price) continue;
    if (pctDiff(left.price, right.price) > 2) continue;
    if (right.index - left.index < 10) continue;

    const headPct = ((head.price - left.price) / left.price) * 100;
    if (headPct < 1.5) continue;

    const confidence = Math.min(85, 45 + headPct * 5 + (2 - pctDiff(left.price, right.price)) * 8);
    return {
      name: "Head & Shoulders",
      type: "bearish",
      confidence: Math.round(confidence),
      description: `Head at $${head.price.toFixed(0)} rises ${headPct.toFixed(1)}% above shoulders at ~$${left.price.toFixed(0)}, classic reversal pattern.`,
      keyPoints: [
        { label: "Left Shoulder", index: left.index, price: left.price },
        { label: "Head", index: head.index, price: head.price },
        { label: "Right Shoulder", index: right.index, price: right.price },
      ],
      startIndex: left.index,
      endIndex: right.index,
    };
  }
  return null;
}

function detectInverseHeadAndShoulders(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const lows = swings.filter((s) => s.type === "low");
  for (let i = lows.length - 1; i >= 2; i--) {
    const right = lows[i];
    const head = lows[i - 1];
    const left = lows[i - 2];

    if (head.price >= left.price || head.price >= right.price) continue;
    if (pctDiff(left.price, right.price) > 2) continue;
    if (right.index - left.index < 10) continue;

    const headPct = ((left.price - head.price) / left.price) * 100;
    if (headPct < 1.5) continue;

    const confidence = Math.min(85, 45 + headPct * 5 + (2 - pctDiff(left.price, right.price)) * 8);
    return {
      name: "Inverse Head & Shoulders",
      type: "bullish",
      confidence: Math.round(confidence),
      description: `Head at $${head.price.toFixed(0)} dips ${headPct.toFixed(1)}% below shoulders at ~$${left.price.toFixed(0)}, bullish reversal pattern.`,
      keyPoints: [
        { label: "Left Shoulder", index: left.index, price: left.price },
        { label: "Head", index: head.index, price: head.price },
        { label: "Right Shoulder", index: right.index, price: right.price },
      ],
      startIndex: left.index,
      endIndex: right.index,
    };
  }
  return null;
}

function detectAscendingTriangle(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const highs = swings.filter((s) => s.type === "high").slice(-5);
  const lows = swings.filter((s) => s.type === "low").slice(-5);
  if (highs.length < 3 || lows.length < 3) return null;

  // Check flat resistance (highs within 1% of each other)
  const avgHigh = highs.reduce((s, h) => s + h.price, 0) / highs.length;
  const flatResistance = highs.every((h) => pctDiff(h.price, avgHigh) < 1);
  if (!flatResistance) return null;

  // Check rising lows
  let risingLows = true;
  for (let i = 1; i < lows.length; i++) {
    if (lows[i].price <= lows[i - 1].price) { risingLows = false; break; }
  }
  if (!risingLows) return null;

  const risePct = ((lows[lows.length - 1].price - lows[0].price) / lows[0].price) * 100;
  const confidence = Math.min(80, 50 + risePct * 5);
  const start = Math.min(highs[0].index, lows[0].index);
  const end = Math.max(highs[highs.length - 1].index, lows[lows.length - 1].index);

  return {
    name: "Ascending Triangle",
    type: "bullish",
    confidence: Math.round(confidence),
    description: `Flat resistance at ~$${avgHigh.toFixed(0)} with rising lows, suggesting building buying pressure for a breakout.`,
    keyPoints: [
      { label: "Resistance", index: highs[0].index, price: avgHigh },
      { label: "Low 1", index: lows[0].index, price: lows[0].price },
      { label: "Low 2", index: lows[lows.length - 1].index, price: lows[lows.length - 1].price },
    ],
    startIndex: start,
    endIndex: end,
  };
}

function detectDescendingTriangle(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const highs = swings.filter((s) => s.type === "high").slice(-5);
  const lows = swings.filter((s) => s.type === "low").slice(-5);
  if (highs.length < 3 || lows.length < 3) return null;

  const avgLow = lows.reduce((s, l) => s + l.price, 0) / lows.length;
  const flatSupport = lows.every((l) => pctDiff(l.price, avgLow) < 1);
  if (!flatSupport) return null;

  let fallingHighs = true;
  for (let i = 1; i < highs.length; i++) {
    if (highs[i].price >= highs[i - 1].price) { fallingHighs = false; break; }
  }
  if (!fallingHighs) return null;

  const dropPct = ((highs[0].price - highs[highs.length - 1].price) / highs[0].price) * 100;
  const confidence = Math.min(80, 50 + dropPct * 5);
  const start = Math.min(highs[0].index, lows[0].index);
  const end = Math.max(highs[highs.length - 1].index, lows[lows.length - 1].index);

  return {
    name: "Descending Triangle",
    type: "bearish",
    confidence: Math.round(confidence),
    description: `Flat support at ~$${avgLow.toFixed(0)} with falling highs, suggesting increasing selling pressure.`,
    keyPoints: [
      { label: "Support", index: lows[0].index, price: avgLow },
      { label: "High 1", index: highs[0].index, price: highs[0].price },
      { label: "High 2", index: highs[highs.length - 1].index, price: highs[highs.length - 1].price },
    ],
    startIndex: start,
    endIndex: end,
  };
}

function detectBullFlag(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const len = candles.length;
  if (len < 20) return null;

  // Look for strong impulse up in last 30 candles, then consolidation
  for (let poleEnd = len - 10; poleEnd >= len - 25 && poleEnd >= 5; poleEnd--) {
    const poleStart = Math.max(0, poleEnd - 10);
    const poleGain = ((candles[poleEnd].close - candles[poleStart].close) / candles[poleStart].close) * 100;
    if (poleGain < 5) continue;

    // Flag: small downward channel after pole
    const flagCandles = candles.slice(poleEnd, len);
    if (flagCandles.length < 5) continue;

    const flagDrop = ((flagCandles[0].close - flagCandles[flagCandles.length - 1].close) / flagCandles[0].close) * 100;
    if (flagDrop < 0.5 || flagDrop > poleGain * 0.5) continue;

    const confidence = Math.min(80, 45 + poleGain * 2 + (poleGain / 2 - flagDrop) * 3);
    return {
      name: "Bull Flag",
      type: "bullish",
      confidence: Math.round(Math.max(40, confidence)),
      description: `Strong ${poleGain.toFixed(1)}% upward move followed by a ${flagDrop.toFixed(1)}% consolidation pullback, potential continuation upward.`,
      keyPoints: [
        { label: "Pole Start", index: poleStart, price: candles[poleStart].close },
        { label: "Pole End", index: poleEnd, price: candles[poleEnd].close },
        { label: "Flag End", index: len - 1, price: candles[len - 1].close },
      ],
      startIndex: poleStart,
      endIndex: len - 1,
    };
  }
  return null;
}

function detectBearFlag(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const len = candles.length;
  if (len < 20) return null;

  for (let poleEnd = len - 10; poleEnd >= len - 25 && poleEnd >= 5; poleEnd--) {
    const poleStart = Math.max(0, poleEnd - 10);
    const poleDrop = ((candles[poleStart].close - candles[poleEnd].close) / candles[poleStart].close) * 100;
    if (poleDrop < 5) continue;

    const flagCandles = candles.slice(poleEnd, len);
    if (flagCandles.length < 5) continue;

    const flagRise = ((flagCandles[flagCandles.length - 1].close - flagCandles[0].close) / flagCandles[0].close) * 100;
    if (flagRise < 0.5 || flagRise > poleDrop * 0.5) continue;

    const confidence = Math.min(80, 45 + poleDrop * 2 + (poleDrop / 2 - flagRise) * 3);
    return {
      name: "Bear Flag",
      type: "bearish",
      confidence: Math.round(Math.max(40, confidence)),
      description: `Strong ${poleDrop.toFixed(1)}% downward move followed by a ${flagRise.toFixed(1)}% consolidation bounce, potential continuation downward.`,
      keyPoints: [
        { label: "Pole Start", index: poleStart, price: candles[poleStart].close },
        { label: "Pole End", index: poleEnd, price: candles[poleEnd].close },
        { label: "Flag End", index: len - 1, price: candles[len - 1].close },
      ],
      startIndex: poleStart,
      endIndex: len - 1,
    };
  }
  return null;
}

function detectRisingWedge(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const highs = swings.filter((s) => s.type === "high").slice(-4);
  const lows = swings.filter((s) => s.type === "low").slice(-4);
  if (highs.length < 3 || lows.length < 3) return null;

  // Both trendlines rising
  let risingHighs = true, risingLows = true;
  for (let i = 1; i < highs.length; i++) {
    if (highs[i].price <= highs[i - 1].price) risingHighs = false;
  }
  for (let i = 1; i < lows.length; i++) {
    if (lows[i].price <= lows[i - 1].price) risingLows = false;
  }
  if (!risingHighs || !risingLows) return null;

  // Converging: gap between high and low trendlines shrinking
  const firstGap = highs[0].price - lows[0].price;
  const lastGap = highs[highs.length - 1].price - lows[lows.length - 1].price;
  if (lastGap >= firstGap) return null;

  const convergePct = ((firstGap - lastGap) / firstGap) * 100;
  if (convergePct < 20) return null;

  const confidence = Math.min(75, 40 + convergePct * 0.5);
  const start = Math.min(highs[0].index, lows[0].index);
  const end = Math.max(highs[highs.length - 1].index, lows[lows.length - 1].index);

  return {
    name: "Rising Wedge",
    type: "bearish",
    confidence: Math.round(confidence),
    description: `Both highs and lows rising but converging (${convergePct.toFixed(0)}% narrower), bearish reversal pattern.`,
    keyPoints: [
      { label: "Start High", index: highs[0].index, price: highs[0].price },
      { label: "Start Low", index: lows[0].index, price: lows[0].price },
      { label: "End High", index: highs[highs.length - 1].index, price: highs[highs.length - 1].price },
      { label: "End Low", index: lows[lows.length - 1].index, price: lows[lows.length - 1].price },
    ],
    startIndex: start,
    endIndex: end,
  };
}

function detectFallingWedge(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const highs = swings.filter((s) => s.type === "high").slice(-4);
  const lows = swings.filter((s) => s.type === "low").slice(-4);
  if (highs.length < 3 || lows.length < 3) return null;

  let fallingHighs = true, fallingLows = true;
  for (let i = 1; i < highs.length; i++) {
    if (highs[i].price >= highs[i - 1].price) fallingHighs = false;
  }
  for (let i = 1; i < lows.length; i++) {
    if (lows[i].price >= lows[i - 1].price) fallingLows = false;
  }
  if (!fallingHighs || !fallingLows) return null;

  const firstGap = highs[0].price - lows[0].price;
  const lastGap = highs[highs.length - 1].price - lows[lows.length - 1].price;
  if (lastGap >= firstGap) return null;

  const convergePct = ((firstGap - lastGap) / firstGap) * 100;
  if (convergePct < 20) return null;

  const confidence = Math.min(75, 40 + convergePct * 0.5);
  const start = Math.min(highs[0].index, lows[0].index);
  const end = Math.max(highs[highs.length - 1].index, lows[lows.length - 1].index);

  return {
    name: "Falling Wedge",
    type: "bullish",
    confidence: Math.round(confidence),
    description: `Both highs and lows falling but converging (${convergePct.toFixed(0)}% narrower), bullish reversal pattern.`,
    keyPoints: [
      { label: "Start High", index: highs[0].index, price: highs[0].price },
      { label: "Start Low", index: lows[0].index, price: lows[0].price },
      { label: "End High", index: highs[highs.length - 1].index, price: highs[highs.length - 1].price },
      { label: "End Low", index: lows[lows.length - 1].index, price: lows[lows.length - 1].price },
    ],
    startIndex: start,
    endIndex: end,
  };
}

function detectCupAndHandle(candles: Candle[], swings: SwingPoint[]): DetectedPattern | null {
  const lows = swings.filter((s) => s.type === "low");
  const highs = swings.filter((s) => s.type === "high");
  if (lows.length < 3 || highs.length < 2) return null;

  // Look for U-shape: lows form a curve (first and last higher than middle)
  for (let i = lows.length - 1; i >= 2; i--) {
    const right = lows[i];
    const bottom = lows[i - 1];
    const left = lows[i - 2];

    if (bottom.price >= left.price || bottom.price >= right.price) continue;
    if (right.index - left.index < 10) continue;

    // Both sides of cup should be roughly similar height
    if (pctDiff(left.price, right.price) > 3) continue;

    const cupDepth = ((left.price - bottom.price) / left.price) * 100;
    if (cupDepth < 2) continue;

    // Handle: small pullback after right lip
    const handleCandles = candles.slice(right.index);
    if (handleCandles.length < 3) continue;

    const confidence = Math.min(75, 40 + cupDepth * 3);
    return {
      name: "Cup & Handle",
      type: "bullish",
      confidence: Math.round(confidence),
      description: `U-shaped bottom at $${bottom.price.toFixed(0)} (${cupDepth.toFixed(1)}% deep), with lips at ~$${left.price.toFixed(0)}, bullish continuation.`,
      keyPoints: [
        { label: "Left Lip", index: left.index, price: left.price },
        { label: "Cup Bottom", index: bottom.index, price: bottom.price },
        { label: "Right Lip", index: right.index, price: right.price },
      ],
      startIndex: left.index,
      endIndex: right.index,
    };
  }
  return null;
}

export function detectPatterns(candles: Candle[]): DetectedPattern[] {
  const window = candles.slice(-100);
  if (window.length < 20) return [];

  const swings = findSwingPoints(window);
  if (swings.length < 3) return [];

  const detectors = [
    detectDoubleTop,
    detectDoubleBottom,
    detectHeadAndShoulders,
    detectInverseHeadAndShoulders,
    detectAscendingTriangle,
    detectDescendingTriangle,
    detectBullFlag,
    detectBearFlag,
    detectRisingWedge,
    detectFallingWedge,
    detectCupAndHandle,
  ];

  const patterns: DetectedPattern[] = [];
  for (const detect of detectors) {
    const result = detect(window, swings);
    if (result && result.confidence >= 40) {
      patterns.push(result);
    }
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}
