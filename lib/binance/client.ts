import type { BinanceKline, Candle, Interval } from "@/lib/types";

const BASE_URL = "https://api.binance.com/api/v3";

/** Map our interval labels to Binance API interval strings */
const INTERVAL_MAP: Record<Interval, string> = {
  "1h": "1h",
  "4h": "4h",
  "1d": "1d",
  "1w": "1w",
};

/** Convert a Binance kline array to our Candle interface */
function toCandle(k: BinanceKline): Candle {
  return {
    time: Math.floor(k[0] / 1000), // ms → s
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  };
}

/**
 * Fetch historical klines from Binance REST API.
 * Returns up to `limit` candles for BTCUSDT at the given interval.
 */
export async function fetchKlines(
  interval: Interval,
  limit: number = 200
): Promise<Candle[]> {
  const url = `${BASE_URL}/klines?symbol=BTCUSDT&interval=${INTERVAL_MAP[interval]}&limit=${limit}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Binance REST ${res.status}: ${await res.text()}`);
  }

  const data: BinanceKline[] = await res.json();
  return data.map(toCandle);
}
