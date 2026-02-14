import type { BinanceWSKline, Candle, Interval, TradingSymbol, WSStatus } from "@/lib/types";

const WS_BASE = "wss://stream.binance.com:9443/ws";

/** Max reconnect delay in ms */
const MAX_DELAY = 30_000;

type StatusCallback = (status: WSStatus) => void;
type CandleCallback = (candle: Candle, isClosed: boolean) => void;

/**
 * Binance WebSocket client with auto-reconnect.
 *
 * Connects to the kline stream for a given symbol and interval.
 * Calls `onCandle` for every tick — `isClosed` indicates whether the
 * candle is finalized or still forming.
 */
export class BinanceWS {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private destroyed = false;
  private symbol: TradingSymbol;
  private interval: Interval;
  private onCandle: CandleCallback;
  private onStatus: StatusCallback;

  constructor(
    symbol: TradingSymbol,
    interval: Interval,
    onCandle: CandleCallback,
    onStatus: StatusCallback
  ) {
    this.symbol = symbol;
    this.interval = interval;
    this.onCandle = onCandle;
    this.onStatus = onStatus;
  }

  /** Build the Binance WS stream name */
  private streamName(): string {
    const map: Record<Interval, string> = {
      "1h": "1h",
      "4h": "4h",
      "1d": "1d",
      "1w": "1w",
    };
    return `${this.symbol.toLowerCase()}@kline_${map[this.interval]}`;
  }

  connect() {
    if (this.destroyed) return;

    this.onStatus("connecting");
    const url = `${WS_BASE}/${this.streamName()}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onStatus("connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const data: BinanceWSKline = JSON.parse(event.data);
        const k = data.k;
        const candle: Candle = {
          time: Math.floor(k.t / 1000),
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
        };
        this.onCandle(candle, k.x);
      } catch {
        // Ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      if (!this.destroyed) {
        this.onStatus("disconnected");
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      this.onStatus("error");
      this.ws?.close();
    };
  }

  private scheduleReconnect() {
    if (this.destroyed) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, MAX_DELAY);
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), delay);
  }

  disconnect() {
    this.destroyed = true;
    this.ws?.close();
    this.ws = null;
  }
}
