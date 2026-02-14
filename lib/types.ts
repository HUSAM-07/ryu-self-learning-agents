// ── Domain types for the Ryujin trading dashboard ──

/** OHLCV candle from Binance */
export interface Candle {
  time: number;       // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Binance REST kline array response (positional) */
export type BinanceKline = [
  number,   // 0  Open time (ms)
  string,   // 1  Open
  string,   // 2  High
  string,   // 3  Low
  string,   // 4  Close
  string,   // 5  Volume
  number,   // 6  Close time (ms)
  string,   // 7  Quote asset volume
  number,   // 8  Number of trades
  string,   // 9  Taker buy base volume
  string,   // 10 Taker buy quote volume
  string,   // 11 Ignore
];

/** Binance WebSocket kline event */
export interface BinanceWSKline {
  e: string;          // Event type
  E: number;          // Event time
  s: string;          // Symbol
  k: {
    t: number;        // Kline start time
    T: number;        // Kline close time
    s: string;        // Symbol
    i: string;        // Interval
    o: string;        // Open
    h: string;        // High
    l: string;        // Low
    c: string;        // Close
    v: string;        // Volume
    x: boolean;       // Is this kline closed?
  };
}

/** Chart timeframe intervals */
export type Interval = "1h" | "4h" | "1d" | "1w";

/** Supported trading symbols */
export type TradingSymbol = "BTCUSDT" | "ETHUSDT";

export interface SymbolConfig {
  symbol: TradingSymbol;
  label: string;       // "BTC/USDT"
  base: string;        // "BTC"
}

export const SYMBOLS: SymbolConfig[] = [
  { symbol: "BTCUSDT", label: "BTC/USDT", base: "BTC" },
  { symbol: "ETHUSDT", label: "ETH/USDT", base: "ETH" },
];

/** EMA values for a given candle */
export interface EMAData {
  ema9: number;
  ema21: number;
}

/** RSI value */
export interface RSIData {
  value: number;
}

/** MACD values */
export interface MACDData {
  macd: number;
  signal: number;
  histogram: number;
}

/** Bollinger Bands values */
export interface BollingerData {
  upper: number;
  middle: number;
  lower: number;
  bandwidth: number;
}

/** All computed indicators for the latest candle */
export interface IndicatorData {
  ema: EMAData;
  rsi: RSIData;
  macd: MACDData;
  bollinger: BollingerData;
}

/** Per-indicator score breakdown */
export interface IndicatorScore {
  name: string;
  score: number;      // -100 to +100
  reason: string;
}

/** Signal direction */
export type SignalDirection = "BUY" | "SELL" | "HOLD";

/** Signal strength */
export type SignalStrength = "STRONG" | "MODERATE" | "WEAK";

/** Composite trading signal */
export interface TradingSignal {
  direction: SignalDirection;
  confidence: number;   // 0-100
  strength: SignalStrength;
  composite: number;    // -100 to +100 raw score
  scores: IndicatorScore[];
}

/** Sentiment for AI analysis */
export type Sentiment = "bullish" | "bearish" | "neutral";

/** AI indicator breakdown item */
export interface AIIndicatorBreakdown {
  name: string;
  value: string;
  interpretation: string;
  sentiment: Sentiment;
}

/** AI analysis response from Claude */
export interface AIAnalysis {
  summary: string;
  bullishFactors: string[];
  bearishFactors: string[];
  riskFactors: string[];
  indicatorBreakdown: AIIndicatorBreakdown[];
  marketBias?: number; // -100 to +100
}

/** Pattern bias direction */
export type PatternBias = "bullish" | "bearish" | "neutral";

/** A key point on a detected pattern */
export interface PatternKeyPoint {
  label: string;
  index: number;
  price: number;
}

/** A chart pattern detected from candle data */
export interface DetectedPattern {
  name: string;
  type: PatternBias;
  confidence: number; // 0-100
  description: string;
  keyPoints: PatternKeyPoint[];
  startIndex: number;
  endIndex: number;
}

/** WebSocket connection states */
export type WSStatus = "connecting" | "connected" | "disconnected" | "error";
