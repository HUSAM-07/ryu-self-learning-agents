"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Candle, Interval, WSStatus } from "@/lib/types";
import { fetchKlines } from "./client";
import { BinanceWS } from "./websocket";

interface UseBinanceReturn {
  candles: Candle[];
  status: WSStatus;
  loading: boolean;
  error: string | null;
}

/**
 * React hook: fetches historical klines via REST, then merges live
 * WebSocket ticks into the candle array.
 *
 * When `isClosed` is false the WS tick updates the last candle in-place
 * (live price). When `isClosed` is true the candle is finalized and a
 * new one begins.
 */
export function useBinance(interval: Interval): UseBinanceReturn {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [status, setStatus] = useState<WSStatus>("disconnected");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<BinanceWS | null>(null);

  const handleCandle = useCallback((candle: Candle, isClosed: boolean) => {
    setCandles((prev) => {
      if (prev.length === 0) return prev;

      const updated = [...prev];
      const last = updated[updated.length - 1];

      if (candle.time === last.time) {
        // Update current (open) candle in-place
        updated[updated.length - 1] = candle;
      } else if (isClosed) {
        // Previous candle just closed — this is a *new* candle tick
        // Replace last with the closed version, then append fresh
        updated.push(candle);
        // Keep array bounded to ~300 candles
        if (updated.length > 300) updated.shift();
      } else {
        // New open candle (time > last.time, not yet closed)
        updated.push(candle);
        if (updated.length > 300) updated.shift();
      }

      return updated;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);

      try {
        const historical = await fetchKlines(interval, 200);
        if (cancelled) return;
        setCandles(historical);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to fetch klines");
      } finally {
        if (!cancelled) setLoading(false);
      }

      // Start WebSocket after REST data is loaded
      wsRef.current?.disconnect();
      const ws = new BinanceWS(interval, handleCandle, setStatus);
      wsRef.current = ws;
      ws.connect();
    }

    init();

    return () => {
      cancelled = true;
      wsRef.current?.disconnect();
      wsRef.current = null;
    };
  }, [interval, handleCandle]);

  return { candles, status, loading, error };
}
