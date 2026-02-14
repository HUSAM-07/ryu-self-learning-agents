"use client";

import { useEffect, useRef } from "react";
import type { Candle } from "@/lib/types";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  ColorType,
  type Time,
} from "lightweight-charts";
import { calculateEMA } from "@/lib/indicators/ema";
import { calculateRSI } from "@/lib/indicators/rsi";
import { calculateBollinger } from "@/lib/indicators/bollinger";

interface PriceChartProps {
  candles: Candle[];
  overlays: { ema: boolean; bollinger: boolean };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnySeries = ISeriesApi<any>;

function getChartColors() {
  const isDark = document.documentElement.classList.contains("dark");
  return {
    textColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
    gridColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)",
    borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)",
    crosshairLabelBg: isDark ? "#1a1a1a" : "#f5f5f5",
    rsiRefLine: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  };
}

export function PriceChart({ candles, overlays }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<AnySeries | null>(null);
  const ema9Ref = useRef<AnySeries | null>(null);
  const ema21Ref = useRef<AnySeries | null>(null);
  const bbUpperRef = useRef<AnySeries | null>(null);
  const bbLowerRef = useRef<AnySeries | null>(null);
  const rsiSeriesRef = useRef<AnySeries | null>(null);
  const rsi30Ref = useRef<AnySeries | null>(null);
  const rsi70Ref = useRef<AnySeries | null>(null);

  // Create charts once
  useEffect(() => {
    if (!containerRef.current || !rsiContainerRef.current) return;

    // Main chart
    const colors = getChartColors();
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: colors.textColor,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: colors.gridColor },
        horzLines: { color: colors.gridColor },
      },
      crosshair: {
        vertLine: { color: "rgba(74,222,128,0.3)", labelBackgroundColor: colors.crosshairLabelBg },
        horzLine: { color: "rgba(74,222,128,0.3)", labelBackgroundColor: colors.crosshairLabelBg },
      },
      rightPriceScale: {
        borderColor: colors.borderColor,
      },
      timeScale: {
        borderColor: colors.borderColor,
        timeVisible: true,
      },
      handleScroll: { vertTouchDrag: false },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#4ade80",
      downColor: "#ef4444",
      borderUpColor: "#4ade80",
      borderDownColor: "#ef4444",
      wickUpColor: "#4ade80",
      wickDownColor: "#ef4444",
    });

    // EMA overlay lines
    const ema9Series = chart.addSeries(LineSeries, {
      color: "#3b82f6",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const ema21Series = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    // Bollinger overlay lines
    const bbUpper = chart.addSeries(LineSeries, {
      color: "rgba(168,85,247,0.5)",
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const bbLower = chart.addSeries(LineSeries, {
      color: "rgba(168,85,247,0.5)",
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    ema9Ref.current = ema9Series;
    ema21Ref.current = ema21Series;
    bbUpperRef.current = bbUpper;
    bbLowerRef.current = bbLower;

    // RSI sub-chart
    const rsiChart = createChart(rsiContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: colors.textColor,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: colors.gridColor },
        horzLines: { color: colors.gridColor },
      },
      rightPriceScale: {
        borderColor: colors.borderColor,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        visible: false,
      },
      handleScroll: { vertTouchDrag: false },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { color: "rgba(74,222,128,0.3)", labelBackgroundColor: colors.crosshairLabelBg },
      },
    });

    const rsiSeries = rsiChart.addSeries(LineSeries, {
      color: "#4ade80",
      lineWidth: 1,
      priceLineVisible: false,
    });

    // RSI reference lines (30 and 70)
    const rsi30 = rsiChart.addSeries(LineSeries, {
      color: colors.rsiRefLine,
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const rsi70 = rsiChart.addSeries(LineSeries, {
      color: colors.rsiRefLine,
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    rsiChartRef.current = rsiChart;
    rsiSeriesRef.current = rsiSeries;
    rsi30Ref.current = rsi30;
    rsi70Ref.current = rsi70;

    // Sync time scales
    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (range) rsiChart.timeScale().setVisibleLogicalRange(range);
    });
    rsiChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (range) chart.timeScale().setVisibleLogicalRange(range);
    });

    // Watch for theme changes and update chart colors
    const themeObserver = new MutationObserver(() => {
      const c = getChartColors();
      const layoutOpts = { layout: { textColor: c.textColor } };
      const gridOpts = { grid: { vertLines: { color: c.gridColor }, horzLines: { color: c.gridColor } } };
      chart.applyOptions({
        ...layoutOpts,
        ...gridOpts,
        crosshair: {
          vertLine: { labelBackgroundColor: c.crosshairLabelBg },
          horzLine: { labelBackgroundColor: c.crosshairLabelBg },
        },
        rightPriceScale: { borderColor: c.borderColor },
        timeScale: { borderColor: c.borderColor },
      });
      rsiChart.applyOptions({
        ...layoutOpts,
        ...gridOpts,
        rightPriceScale: { borderColor: c.borderColor },
        crosshair: { horzLine: { labelBackgroundColor: c.crosshairLabelBg } },
      });
      rsi30.applyOptions({ color: c.rsiRefLine });
      rsi70.applyOptions({ color: c.rsiRefLine });
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Handle resize
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
      if (rsiContainerRef.current) {
        rsiChart.applyOptions({ width: rsiContainerRef.current.clientWidth });
      }
    });
    observer.observe(containerRef.current);

    return () => {
      themeObserver.disconnect();
      observer.disconnect();
      chart.remove();
      rsiChart.remove();
    };
  }, []);

  // Update data when candles or overlays change
  useEffect(() => {
    if (!candleSeriesRef.current || candles.length === 0) return;

    // Candle data
    const candleData = candles.map((c) => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeriesRef.current.setData(candleData);

    // EMA overlays
    if (overlays.ema && ema9Ref.current && ema21Ref.current) {
      const ema9 = calculateEMA(candles, 9);
      const ema21 = calculateEMA(candles, 21);
      const ema9Data = candles
        .map((c, i) => ({ time: c.time as Time, value: ema9[i] }))
        .filter((d) => !isNaN(d.value));
      const ema21Data = candles
        .map((c, i) => ({ time: c.time as Time, value: ema21[i] }))
        .filter((d) => !isNaN(d.value));
      ema9Ref.current.setData(ema9Data);
      ema21Ref.current.setData(ema21Data);
    } else {
      ema9Ref.current?.setData([]);
      ema21Ref.current?.setData([]);
    }

    // Bollinger overlays
    if (overlays.bollinger && bbUpperRef.current && bbLowerRef.current) {
      const bb = calculateBollinger(candles, 20, 2);
      const upperData = candles
        .map((c, i) => ({ time: c.time as Time, value: bb.upper[i] }))
        .filter((d) => !isNaN(d.value));
      const lowerData = candles
        .map((c, i) => ({ time: c.time as Time, value: bb.lower[i] }))
        .filter((d) => !isNaN(d.value));
      bbUpperRef.current.setData(upperData);
      bbLowerRef.current.setData(lowerData);
    } else {
      bbUpperRef.current?.setData([]);
      bbLowerRef.current?.setData([]);
    }

    // RSI sub-chart
    if (rsiSeriesRef.current) {
      const rsi = calculateRSI(candles, 14);
      const rsiData = candles
        .map((c, i) => ({ time: c.time as Time, value: rsi[i] }))
        .filter((d) => !isNaN(d.value));
      rsiSeriesRef.current.setData(rsiData);

      // RSI reference lines (30/70)
      if (rsi30Ref.current && rsi70Ref.current && rsiData.length > 0) {
        const firstTime = rsiData[0].time;
        const lastTime = rsiData[rsiData.length - 1].time;
        rsi30Ref.current.setData([
          { time: firstTime, value: 30 },
          { time: lastTime, value: 30 },
        ]);
        rsi70Ref.current.setData([
          { time: firstTime, value: 70 },
          { time: lastTime, value: 70 },
        ]);
      }
    }
  }, [candles, overlays]);

  return (
    <div className="flex flex-col">
      <div ref={containerRef} className="w-full h-[400px]" />
      <div className="border-t border-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-[10px] font-mono text-muted-foreground">RSI(14)</span>
          <span className="text-[10px] font-mono text-muted-foreground/50">30 ── 70</span>
        </div>
        <div ref={rsiContainerRef} className="w-full h-[100px]" />
      </div>
    </div>
  );
}
