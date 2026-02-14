"use client";

import type { Candle, IndicatorData, SymbolConfig } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TopStatsBarProps {
  candles: Candle[];
  indicators: IndicatorData | null;
  symbolConfig: SymbolConfig;
}

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(1);
}

export function TopStatsBar({ candles, indicators, symbolConfig }: TopStatsBarProps) {
  if (candles.length === 0) return null;

  const current = candles[candles.length - 1];
  const prev = candles.length > 1 ? candles[candles.length - 2] : current;
  const priceChange = current.close - prev.close;
  const priceChangePct = (priceChange / prev.close) * 100;
  const isUp = priceChange >= 0;

  // 24h high/low — scan recent candles (up to 24)
  const recent = candles.slice(-24);
  const high24h = Math.max(...recent.map((c) => c.high));
  const totalVolume = recent.reduce((sum, c) => sum + c.volume, 0);

  const stats = [
    {
      label: `${symbolConfig.base} Price`,
      value: formatPrice(current.close),
      sub: `${isUp ? "+" : ""}${priceChange.toFixed(0)} (${isUp ? "+" : ""}${priceChangePct.toFixed(2)}%)`,
      color: isUp ? "text-green-400" : "text-red-400",
    },
    {
      label: "24H High",
      value: formatPrice(high24h),
      sub: null,
      color: "text-foreground",
    },
    {
      label: "Volume",
      value: formatVolume(totalVolume),
      sub: symbolConfig.base,
      color: "text-foreground",
    },
    {
      label: "RSI(14)",
      value: indicators ? indicators.rsi.value.toFixed(1) : "—",
      sub: indicators
        ? indicators.rsi.value > 70
          ? "Overbought"
          : indicators.rsi.value < 30
          ? "Oversold"
          : "Neutral"
        : null,
      color: indicators
        ? indicators.rsi.value > 70
          ? "text-red-400"
          : indicators.rsi.value < 30
          ? "text-green-400"
          : "text-foreground"
        : "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="pt-3 pb-3">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</p>
            <p className={cn("text-lg font-bold font-mono mt-0.5", stat.color)}>{stat.value}</p>
            {stat.sub && (
              <p className={cn("text-[10px] font-mono mt-0.5", stat.color === "text-foreground" ? "text-muted-foreground" : stat.color)}>
                {stat.sub}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
