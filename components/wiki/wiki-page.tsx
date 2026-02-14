"use client";

import { useState } from "react";
import { DragonLogo } from "@/components/landing/dragon-logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

/* ================================================================
   WIKI PAGE — How Ryujin Works
   ================================================================ */

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Wiki", href: "/wiki" },
];

export function WikiPage() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-grid">
      {/* ── Header ────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
          <a href="/" className="flex items-center gap-3">
            <DragonLogo size={36} />
            <span className="font-bold text-lg tracking-tight">Ryujin</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <AnimatedThemeToggler className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            <a
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-mono
                         border border-[#4ade80]/30 text-[#4ade80] rounded-lg
                         hover:bg-[#4ade80]/10 transition-all cursor-pointer"
            >
              Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* ── Content ───────────────────────────── */}
      <main className="relative pt-16">
        <HeroSection />
        <PipelineSection />
        <IndicatorsSection />
        <SignalScoringSection />
        <AIAnalysisSection />
        <FooterCTA />
      </main>
    </div>
  );
}

/* ================================================================
   HERO
   ================================================================ */
function HeroSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
      <div className="flex justify-center mb-6 animate-fade-in-up">
        <DragonLogo size={64} />
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-fade-in-up animate-delay-1">
        How Ryujin Works
      </h1>
      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-mono animate-fade-in-up animate-delay-2">
        A complete guide to the analysis methods, indicators, and signal scoring
        that power your trading insights.
      </p>
    </section>
  );
}

/* ================================================================
   PIPELINE DIAGRAM
   ================================================================ */
function PipelineSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <SectionHeader
        icon={<LayersIcon />}
        title="The Analysis Pipeline"
      />
      <p className="text-muted-foreground font-mono text-sm md:text-base max-w-3xl mb-8">
        Every analysis in Ryujin follows a four-stage pipeline. Raw market data
        (OHLCV candles) flows through technical indicator calculations, then an
        AI model analyzes the indicators, and finally a multi-factor confidence
        scorer generates a weighted trading signal.
      </p>

      {/* Pipeline SVG */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-10 overflow-x-auto">
        <PipelineDiagram />
      </div>
    </section>
  );
}

function PipelineDiagram() {
  return (
    <svg
      viewBox="0 0 900 120"
      className="w-full min-w-[600px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes pipeline-draw {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes pipeline-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pipeline-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .pipe-box { animation: pipeline-fade 0.6s ease-out forwards; opacity: 0; }
        .pipe-box-1 { animation-delay: 0s; }
        .pipe-box-2 { animation-delay: 0.2s; }
        .pipe-box-3 { animation-delay: 0.4s; }
        .pipe-box-4 { animation-delay: 0.6s; }
        .pipe-arrow {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: pipeline-draw 0.4s ease-out forwards;
        }
        .pipe-arrow-1 { animation-delay: 0.15s; }
        .pipe-arrow-2 { animation-delay: 0.35s; }
        .pipe-arrow-3 { animation-delay: 0.55s; }
        .pipe-dot {
          animation: pipeline-pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Box 1 — Market Data */}
      <g className="pipe-box pipe-box-1">
        <rect x="10" y="20" width="170" height="80" rx="8" fill="none" stroke="#666" strokeWidth="1.5" />
        <text x="95" y="52" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700" fontFamily="monospace">Market Data</text>
        <text x="95" y="72" textAnchor="middle" fill="#888" fontSize="11" fontFamily="monospace">OHLCV Candles</text>
      </g>

      {/* Arrow 1 */}
      <line x1="190" y1="60" x2="240" y2="60" stroke="#4ade80" strokeWidth="2" className="pipe-arrow pipe-arrow-1" markerEnd="url(#arrowhead)" />
      <circle cx="215" cy="60" r="3" fill="#4ade80" className="pipe-dot" />

      {/* Box 2 — Indicators */}
      <g className="pipe-box pipe-box-2">
        <rect x="250" y="20" width="170" height="80" rx="8" fill="none" stroke="#eab308" strokeWidth="1.5" />
        <text x="335" y="52" textAnchor="middle" fill="#eab308" fontSize="14" fontWeight="700" fontFamily="monospace">Indicators</text>
        <text x="335" y="72" textAnchor="middle" fill="#888" fontSize="11" fontFamily="monospace">EMA, RSI, MACD, BB</text>
      </g>

      {/* Arrow 2 */}
      <line x1="430" y1="60" x2="480" y2="60" stroke="#4ade80" strokeWidth="2" className="pipe-arrow pipe-arrow-2" markerEnd="url(#arrowhead)" />
      <circle cx="455" cy="60" r="3" fill="#4ade80" className="pipe-dot" />

      {/* Box 3 — AI Analysis */}
      <g className="pipe-box pipe-box-3">
        <rect x="490" y="20" width="170" height="80" rx="8" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="575" y="52" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="700" fontFamily="monospace">AI Analysis</text>
        <text x="575" y="72" textAnchor="middle" fill="#888" fontSize="11" fontFamily="monospace">Grok via OpenRouter</text>
      </g>

      {/* Arrow 3 */}
      <line x1="670" y1="60" x2="720" y2="60" stroke="#4ade80" strokeWidth="2" className="pipe-arrow pipe-arrow-3" markerEnd="url(#arrowhead)" />
      <circle cx="695" cy="60" r="3" fill="#4ade80" className="pipe-dot" />

      {/* Box 4 — Trading Signal */}
      <g className="pipe-box pipe-box-4">
        <rect x="730" y="20" width="160" height="80" rx="8" fill="none" stroke="#4ade80" strokeWidth="1.5" />
        <text x="810" y="52" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="700" fontFamily="monospace">Trading Signal</text>
        <text x="810" y="72" textAnchor="middle" fill="#888" fontSize="11" fontFamily="monospace">Confidence + Direction</text>
      </g>

      {/* Arrowhead marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#4ade80" />
        </marker>
      </defs>
    </svg>
  );
}

/* ================================================================
   INDICATORS SECTION
   ================================================================ */
function IndicatorsSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <SectionHeader
        icon={<ChartLineIcon />}
        title="Technical Indicators"
      />
      <p className="text-muted-foreground font-mono text-sm md:text-base max-w-3xl mb-8">
        Indicators transform raw price data into actionable signals. Ryujin
        calculates four core indicators in real-time, each revealing a different
        dimension of market behavior.
      </p>

      <div className="space-y-4">
        <IndicatorAccordion
          title="Moving Averages (EMA)"
          defaultOpen
          content={<EMAContent />}
          svg={<EMASvg />}
        />
        <IndicatorAccordion
          title="Relative Strength Index (RSI)"
          content={<RSIContent />}
          svg={<RSISvg />}
        />
        <IndicatorAccordion
          title="MACD (Moving Average Convergence Divergence)"
          content={<MACDContent />}
          svg={<MACDSvg />}
        />
        <IndicatorAccordion
          title="Bollinger Bands"
          content={<BollingerContent />}
          svg={<BollingerSvg />}
        />
      </div>
    </section>
  );
}

/* ── Accordion component ─────────────────────── */
function IndicatorAccordion({
  title,
  content,
  svg,
  defaultOpen,
}: {
  title: string;
  content: React.ReactNode;
  svg: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer hover:bg-[#4ade80]/[0.03] transition-colors"
      >
        <span className="text-base md:text-lg font-bold font-mono">{title}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 border-t border-border pt-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
              <div className="text-sm text-muted-foreground font-mono leading-relaxed space-y-3">
                {content}
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-4 flex items-center justify-center">
                {svg}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── EMA ─────────────────────────────────────── */
function EMAContent() {
  return (
    <>
      <p>
        <strong className="text-foreground">Exponential Moving Average (EMA)</strong> gives
        more weight to recent prices using a multiplier of{" "}
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs">
          2 / (period + 1)
        </code>
        . Ryujin uses EMA-9 (fast) and EMA-21 (slow).
      </p>
      <p>
        The first EMA value is seeded with a Simple Moving Average (SMA) of the first N closes.
        After that, each new EMA builds on the previous one:{" "}
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs">
          EMA = (close - prevEMA) &times; k + prevEMA
        </code>
      </p>
      <p>
        When EMA-9 crosses above EMA-21 (&ldquo;golden cross&rdquo;), it signals a potential
        uptrend. The reverse (&ldquo;death cross&rdquo;) signals a potential downtrend.
      </p>
    </>
  );
}

function EMASvg() {
  return (
    <svg viewBox="0 0 240 140" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ema-draw-price {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ema-draw-fast {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ema-draw-slow {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ema-cross-pulse {
          0%, 100% { r: 4; opacity: 0.8; }
          50% { r: 7; opacity: 1; }
        }
        .ema-price { stroke-dasharray: 400; stroke-dashoffset: 400; animation: ema-draw-price 2s ease-out forwards; }
        .ema-fast { stroke-dasharray: 400; stroke-dashoffset: 400; animation: ema-draw-fast 2s ease-out 0.3s forwards; }
        .ema-slow { stroke-dasharray: 400; stroke-dashoffset: 400; animation: ema-draw-slow 2s ease-out 0.5s forwards; }
        .ema-cross { animation: ema-cross-pulse 2s ease-in-out infinite; }
      `}</style>

      {/* Grid lines */}
      <line x1="20" y1="30" x2="220" y2="30" stroke="#333" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="70" x2="220" y2="70" stroke="#333" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="110" x2="220" y2="110" stroke="#333" strokeWidth="0.5" opacity="0.3" />

      {/* Price line (gray, jagged) */}
      <polyline
        points="25,90 45,85 60,95 75,80 90,70 105,75 120,55 135,50 150,60 165,45 180,40 200,35 215,30"
        fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="ema-price"
      />

      {/* EMA 9 (fast — green) */}
      <polyline
        points="25,88 45,86 60,90 75,82 90,73 105,73 120,60 135,54 150,56 165,48 180,42 200,37 215,32"
        fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="ema-fast"
      />

      {/* EMA 21 (slow — orange) */}
      <polyline
        points="25,92 45,90 60,89 75,86 90,80 105,77 120,70 135,64 150,60 165,55 180,50 200,44 215,40"
        fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="ema-slow"
      />

      {/* Golden cross point */}
      <circle cx="90" cy="73" r="4" fill="#4ade80" className="ema-cross" />

      {/* Legend */}
      <text x="220" y="28" fill="#888" fontSize="9" fontFamily="monospace" textAnchor="end">Price</text>
      <text x="220" y="38" fill="#4ade80" fontSize="9" fontFamily="monospace" textAnchor="end">EMA 9</text>
      <text x="220" y="48" fill="#eab308" fontSize="9" fontFamily="monospace" textAnchor="end">EMA 21</text>
    </svg>
  );
}

/* ── RSI ─────────────────────────────────────── */
function RSIContent() {
  return (
    <>
      <p>
        <strong className="text-foreground">Relative Strength Index (RSI)</strong> measures
        the speed and magnitude of price changes on a scale of 0-100. Ryujin uses the
        standard 14-period RSI with Wilder&apos;s smoothing method.
      </p>
      <p>
        The formula:{" "}
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs">
          RSI = 100 - (100 / (1 + RS))
        </code>{" "}
        where RS = average gain / average loss over the period.
      </p>
      <p>
        <strong className="text-foreground">RSI &lt; 30</strong> = oversold (bullish signal).{" "}
        <strong className="text-foreground">RSI &gt; 70</strong> = overbought (bearish signal).
        Ryujin scores extreme readings (&lt;20 or &gt;80) even more heavily.
      </p>
    </>
  );
}

function RSISvg() {
  return (
    <svg viewBox="0 0 240 140" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes rsi-draw {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes rsi-zone-pulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }
        .rsi-line { stroke-dasharray: 500; stroke-dashoffset: 500; animation: rsi-draw 2s ease-out forwards; }
        .rsi-zone { animation: rsi-zone-pulse 3s ease-in-out infinite; }
      `}</style>

      {/* Overbought zone (70-100) */}
      <rect x="20" y="10" width="200" height="28" fill="#ef4444" className="rsi-zone" rx="2" />
      {/* Oversold zone (0-30) */}
      <rect x="20" y="102" width="200" height="28" fill="#4ade80" className="rsi-zone" rx="2" />

      {/* Threshold lines */}
      <line x1="20" y1="38" x2="220" y2="38" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
      <line x1="20" y1="102" x2="220" y2="102" stroke="#4ade80" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
      <line x1="20" y1="70" x2="220" y2="70" stroke="#666" strokeWidth="0.5" opacity="0.3" />

      {/* Labels */}
      <text x="16" y="42" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="end">70</text>
      <text x="16" y="74" fill="#666" fontSize="8" fontFamily="monospace" textAnchor="end">50</text>
      <text x="16" y="106" fill="#4ade80" fontSize="8" fontFamily="monospace" textAnchor="end">30</text>

      {/* RSI line */}
      <polyline
        points="25,70 40,62 55,50 70,35 85,30 100,42 115,55 130,70 145,85 155,105 165,110 180,100 195,80 210,65 220,60"
        fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="rsi-line"
      />

      {/* Overbought marker */}
      <circle cx="85" cy="30" r="3" fill="#ef4444" opacity="0.8" />
      <text x="85" y="22" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">Overbought</text>

      {/* Oversold marker */}
      <circle cx="165" cy="110" r="3" fill="#4ade80" opacity="0.8" />
      <text x="165" y="126" fill="#4ade80" fontSize="8" fontFamily="monospace" textAnchor="middle">Oversold</text>
    </svg>
  );
}

/* ── MACD ────────────────────────────────────── */
function MACDContent() {
  return (
    <>
      <p>
        <strong className="text-foreground">MACD</strong> shows the relationship between two
        EMAs. Ryujin computes it with the standard parameters: fast=12, slow=26, signal=9.
      </p>
      <p>
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs">
          MACD Line = EMA(12) - EMA(26)
        </code>
        <br />
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs mt-1 inline-block">
          Signal Line = EMA(MACD, 9)
        </code>
        <br />
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs mt-1 inline-block">
          Histogram = MACD - Signal
        </code>
      </p>
      <p>
        A positive histogram means bullish momentum (MACD above signal). The larger the
        histogram, the stronger the momentum. Ryujin needs at least 34 candles to compute
        MACD (26 for the slow EMA + 9 for the signal - 1).
      </p>
    </>
  );
}

function MACDSvg() {
  return (
    <svg viewBox="0 0 240 140" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes macd-draw {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes macd-bar-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .macd-line { stroke-dasharray: 400; stroke-dashoffset: 400; animation: macd-draw 2s ease-out forwards; }
        .macd-signal { stroke-dasharray: 400; stroke-dashoffset: 400; animation: macd-draw 2s ease-out 0.3s forwards; }
        .macd-bar { transform-origin: center bottom; animation: macd-bar-grow 0.5s ease-out forwards; opacity: 0.7; }
      `}</style>

      {/* Zero line */}
      <line x1="20" y1="70" x2="220" y2="70" stroke="#666" strokeWidth="0.5" opacity="0.5" />
      <text x="16" y="73" fill="#666" fontSize="8" fontFamily="monospace" textAnchor="end">0</text>

      {/* Histogram bars */}
      {[
        { x: 30, h: -8 }, { x: 45, h: -12 }, { x: 60, h: -18 }, { x: 75, h: -10 },
        { x: 90, h: -3 }, { x: 105, h: 5 }, { x: 120, h: 14 }, { x: 135, h: 22 },
        { x: 150, h: 18 }, { x: 165, h: 12 }, { x: 180, h: 8 }, { x: 195, h: 4 },
      ].map((bar, i) => (
        <rect
          key={i}
          x={bar.x - 5}
          y={bar.h > 0 ? 70 - bar.h : 70}
          width="10"
          height={Math.abs(bar.h)}
          fill={bar.h > 0 ? "#4ade80" : "#ef4444"}
          className="macd-bar"
          style={{ animationDelay: `${0.8 + i * 0.08}s` }}
          rx="1"
        />
      ))}

      {/* MACD line */}
      <polyline
        points="30,82 45,86 60,92 75,80 90,73 105,64 120,52 135,42 150,48 165,55 180,60 195,66"
        fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="macd-line"
      />

      {/* Signal line */}
      <polyline
        points="30,78 45,80 60,84 75,82 90,76 105,68 120,58 135,50 150,52 165,56 180,60 195,62"
        fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4,3"
        className="macd-signal"
      />

      {/* Legend */}
      <text x="220" y="48" fill="#3b82f6" fontSize="8" fontFamily="monospace" textAnchor="end">MACD</text>
      <text x="220" y="58" fill="#eab308" fontSize="8" fontFamily="monospace" textAnchor="end">Signal</text>
      <text x="220" y="68" fill="#4ade80" fontSize="8" fontFamily="monospace" textAnchor="end">Histogram</text>
    </svg>
  );
}

/* ── Bollinger Bands ─────────────────────────── */
function BollingerContent() {
  return (
    <>
      <p>
        <strong className="text-foreground">Bollinger Bands</strong> show volatility by
        drawing bands around a moving average. Ryujin uses a 20-period SMA with 2 standard
        deviations.
      </p>
      <p>
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs">
          Middle = SMA(20)
        </code>
        <br />
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs mt-1 inline-block">
          Upper = Middle + 2 &times; StdDev
        </code>
        <br />
        <code className="px-2 py-0.5 rounded bg-[#4ade80]/10 text-[#4ade80] text-xs mt-1 inline-block">
          Lower = Middle - 2 &times; StdDev
        </code>
      </p>
      <p>
        When price touches the lower band, it&apos;s a bullish signal (potential bounce). When
        it touches the upper band, it&apos;s bearish. Bandwidth (upper-lower)/middle measures
        overall volatility — a squeeze often precedes a breakout.
      </p>
    </>
  );
}

function BollingerSvg() {
  return (
    <svg viewBox="0 0 240 140" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes bb-draw {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes bb-fill-fade {
          from { opacity: 0; }
          to { opacity: 0.08; }
        }
        @keyframes bb-bounce {
          0%, 100% { cy: 105; }
          50% { cy: 100; }
        }
        .bb-band { stroke-dasharray: 400; stroke-dashoffset: 400; animation: bb-draw 2s ease-out forwards; }
        .bb-fill { animation: bb-fill-fade 1s ease-out 0.5s forwards; opacity: 0; }
        .bb-price { stroke-dasharray: 400; stroke-dashoffset: 400; animation: bb-draw 2s ease-out 0.2s forwards; }
        .bb-bounce { animation: bb-bounce 2s ease-in-out infinite; }
      `}</style>

      {/* Band fill */}
      <polygon
        points="25,30 45,28 65,25 85,30 105,45 125,50 145,42 165,35 185,30 205,28 220,25 220,115 205,112 185,110 165,105 145,98 125,100 105,105 85,110 65,115 45,112 25,110"
        fill="#a78bfa"
        className="bb-fill"
      />

      {/* Upper band */}
      <polyline
        points="25,30 45,28 65,25 85,30 105,45 125,50 145,42 165,35 185,30 205,28 220,25"
        fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="bb-band"
      />

      {/* Middle (SMA) */}
      <polyline
        points="25,70 45,68 65,66 85,68 105,72 125,74 145,70 165,67 185,65 205,66 220,65"
        fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeLinecap="round" strokeLinejoin="round"
        className="bb-band"
      />

      {/* Lower band */}
      <polyline
        points="25,110 45,112 65,115 85,110 105,105 125,100 145,98 165,105 185,110 205,112 220,115"
        fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="bb-band"
      />

      {/* Price line */}
      <polyline
        points="25,75 45,70 65,60 85,50 105,65 125,80 145,72 165,58 185,45 205,50 220,55"
        fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="bb-price"
      />

      {/* Bounce point at lower band */}
      <circle cx="125" cy="100" r="4" fill="#4ade80" className="bb-bounce" />
      <text x="125" y="126" fill="#4ade80" fontSize="8" fontFamily="monospace" textAnchor="middle">Bounce</text>

      {/* Labels */}
      <text x="224" y="28" fill="#a78bfa" fontSize="8" fontFamily="monospace">Upper</text>
      <text x="224" y="68" fill="#a78bfa" fontSize="8" fontFamily="monospace">SMA</text>
      <text x="224" y="118" fill="#a78bfa" fontSize="8" fontFamily="monospace">Lower</text>
    </svg>
  );
}

/* ================================================================
   SIGNAL SCORING
   ================================================================ */
function SignalScoringSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <SectionHeader
        icon={<ScaleIcon />}
        title="Signal Scoring"
      />
      <p className="text-muted-foreground font-mono text-sm md:text-base max-w-3xl mb-8">
        Each indicator produces a score from -100 (extremely bearish) to +100 (extremely
        bullish). These are averaged into a single composite score that determines the final
        trading direction.
      </p>

      {/* Scoring diagram */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-10 mb-8">
        <ScoringDiagram />
      </div>

      {/* Threshold table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ThresholdCard
          direction="BUY"
          condition="Composite > +15"
          color="#4ade80"
          description="Bullish consensus across indicators. Confidence and strength scale with the composite magnitude."
        />
        <ThresholdCard
          direction="HOLD"
          condition="-15 to +15"
          color="#eab308"
          description="No clear consensus. Indicators are mixed or neutral — wait for stronger alignment."
        />
        <ThresholdCard
          direction="SELL"
          condition="Composite < -15"
          color="#ef4444"
          description="Bearish consensus. The more negative the composite, the higher the confidence in the sell signal."
        />
      </div>

      {/* Strength table */}
      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="font-bold font-mono text-sm">Signal Strength Tiers</h4>
        </div>
        <div className="divide-y divide-border">
          <StrengthRow label="STRONG" range="|composite| >= 70" color="#4ade80" bar={95} />
          <StrengthRow label="MODERATE" range="|composite| >= 40" color="#eab308" bar={60} />
          <StrengthRow label="WEAK" range="|composite| < 40" color="#888" bar={25} />
        </div>
      </div>
    </section>
  );
}

function ScoringDiagram() {
  return (
    <svg viewBox="0 0 800 180" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes score-flow {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes score-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes score-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .score-box { animation: score-fade-in 0.5s ease-out forwards; opacity: 0; }
        .score-box-1 { animation-delay: 0s; }
        .score-box-2 { animation-delay: 0.15s; }
        .score-box-3 { animation-delay: 0.3s; }
        .score-box-4 { animation-delay: 0.45s; }
        .score-box-5 { animation-delay: 0.7s; }
        .score-arrow {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: score-flow 0.3s ease-out forwards;
        }
        .score-arrow-1 { animation-delay: 0.1s; }
        .score-arrow-2 { animation-delay: 0.25s; }
        .score-arrow-3 { animation-delay: 0.4s; }
        .score-arrow-4 { animation-delay: 0.6s; }
        .score-result { animation: score-pulse 2s ease-in-out infinite; }
      `}</style>

      {/* Indicator boxes */}
      <g className="score-box score-box-1">
        <rect x="10" y="15" width="120" height="55" rx="6" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="70" y="38" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="700" fontFamily="monospace">RSI</text>
        <text x="70" y="55" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">-100 to +100</text>
      </g>

      <g className="score-box score-box-2">
        <rect x="10" y="80" width="120" height="55" rx="6" fill="none" stroke="#eab308" strokeWidth="1.5" />
        <text x="70" y="103" textAnchor="middle" fill="#eab308" fontSize="12" fontWeight="700" fontFamily="monospace">EMA</text>
        <text x="70" y="120" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">-100 to +100</text>
      </g>

      <g className="score-box score-box-3">
        <rect x="160" y="15" width="120" height="55" rx="6" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="220" y="38" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="700" fontFamily="monospace">MACD</text>
        <text x="220" y="55" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">-100 to +100</text>
      </g>

      <g className="score-box score-box-4">
        <rect x="160" y="80" width="120" height="55" rx="6" fill="none" stroke="#f472b6" strokeWidth="1.5" />
        <text x="220" y="103" textAnchor="middle" fill="#f472b6" fontSize="12" fontWeight="700" fontFamily="monospace">Bollinger</text>
        <text x="220" y="120" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">-100 to +100</text>
      </g>

      {/* Arrows to combiner */}
      <line x1="135" y1="42" x2="350" y2="72" stroke="#4ade80" strokeWidth="1.5" className="score-arrow score-arrow-1" markerEnd="url(#arrowhead2)" />
      <line x1="135" y1="107" x2="350" y2="82" stroke="#4ade80" strokeWidth="1.5" className="score-arrow score-arrow-2" markerEnd="url(#arrowhead2)" />
      <line x1="285" y1="42" x2="350" y2="72" stroke="#4ade80" strokeWidth="1.5" className="score-arrow score-arrow-3" markerEnd="url(#arrowhead2)" />
      <line x1="285" y1="107" x2="350" y2="82" stroke="#4ade80" strokeWidth="1.5" className="score-arrow score-arrow-4" markerEnd="url(#arrowhead2)" />

      {/* Combiner box */}
      <g className="score-box score-box-5">
        <rect x="360" y="45" width="160" height="60" rx="8" fill="none" stroke="#4ade80" strokeWidth="2" />
        <text x="440" y="70" textAnchor="middle" fill="#4ade80" fontSize="13" fontWeight="700" fontFamily="monospace">Average</text>
        <text x="440" y="88" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">Equal Weight</text>
      </g>

      {/* Arrow to result */}
      <line x1="525" y1="75" x2="580" y2="75" stroke="#4ade80" strokeWidth="2" className="score-arrow score-arrow-4" markerEnd="url(#arrowhead2)" />

      {/* Result */}
      <g className="score-result">
        <rect x="590" y="30" width="200" height="100" rx="10" fill="none" stroke="#4ade80" strokeWidth="2" />
        <text x="690" y="60" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700" fontFamily="monospace">Composite Score</text>
        <text x="690" y="80" textAnchor="middle" fill="#4ade80" fontSize="18" fontWeight="800" fontFamily="monospace">-100 to +100</text>
        <text x="690" y="100" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">BUY / HOLD / SELL</text>
      </g>

      <defs>
        <marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#4ade80" />
        </marker>
      </defs>
    </svg>
  );
}

function ThresholdCard({
  direction,
  condition,
  color,
  description,
}: {
  direction: string;
  condition: string;
  color: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="px-3 py-1 rounded-md text-xs font-bold font-mono"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {direction}
        </span>
        <span className="text-xs font-mono text-muted-foreground">{condition}</span>
      </div>
      <p className="text-sm font-mono text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StrengthRow({
  label,
  range,
  color,
  bar,
}: {
  label: string;
  range: string;
  color: string;
  bar: number;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-3">
      <span className="text-xs font-bold font-mono w-24" style={{ color }}>{label}</span>
      <span className="text-xs font-mono text-muted-foreground w-40">{range}</span>
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${bar}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ================================================================
   AI ANALYSIS
   ================================================================ */
function AIAnalysisSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <SectionHeader
        icon={<BrainIcon />}
        title="AI-Powered Analysis"
      />
      <p className="text-muted-foreground font-mono text-sm md:text-base max-w-3xl mb-8">
        After computing indicators and scoring the signal, Ryujin sends all the data to an
        AI model (Grok via OpenRouter) for a natural-language analysis. The AI provides
        context that pure math can&apos;t capture.
      </p>

      <div className="rounded-xl border border-border bg-card p-6 md:p-10">
        <AIFlowDiagram />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="font-bold font-mono text-sm text-[#4ade80] mb-3">What the AI receives</h4>
          <ul className="space-y-2 text-sm font-mono text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-[#4ade80] mt-0.5">&#x2022;</span>
              Current price, 24h change, volume
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4ade80] mt-0.5">&#x2022;</span>
              All indicator values (RSI, EMA, MACD, BB)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4ade80] mt-0.5">&#x2022;</span>
              Per-indicator scores with reasoning
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4ade80] mt-0.5">&#x2022;</span>
              Composite signal direction and confidence
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="font-bold font-mono text-sm text-[#3b82f6] mb-3">What the AI returns</h4>
          <ul className="space-y-2 text-sm font-mono text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-[#3b82f6] mt-0.5">&#x2022;</span>
              Natural-language market summary
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3b82f6] mt-0.5">&#x2022;</span>
              Bullish and bearish factors
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3b82f6] mt-0.5">&#x2022;</span>
              Risk factors to watch
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3b82f6] mt-0.5">&#x2022;</span>
              Per-indicator breakdown with star ratings
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function AIFlowDiagram() {
  return (
    <svg viewBox="0 0 700 100" className="w-full min-w-[500px]" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes ai-fade {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes ai-data-flow {
          0% { stroke-dashoffset: 200; opacity: 0.3; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.3; }
        }
        .ai-box { animation: ai-fade 0.6s ease-out forwards; opacity: 0; }
        .ai-box-1 { animation-delay: 0s; }
        .ai-box-2 { animation-delay: 0.3s; }
        .ai-box-3 { animation-delay: 0.6s; }
        .ai-flow {
          stroke-dasharray: 8, 6;
          animation: ai-data-flow 2s linear infinite;
        }
      `}</style>

      {/* Input */}
      <g className="ai-box ai-box-1">
        <rect x="10" y="15" width="170" height="70" rx="8" fill="none" stroke="#eab308" strokeWidth="1.5" />
        <text x="95" y="42" textAnchor="middle" fill="#eab308" fontSize="13" fontWeight="700" fontFamily="monospace">Indicators +</text>
        <text x="95" y="60" textAnchor="middle" fill="#eab308" fontSize="13" fontWeight="700" fontFamily="monospace">Signal Scores</text>
      </g>

      {/* Flow arrow */}
      <line x1="190" y1="50" x2="260" y2="50" stroke="#4ade80" strokeWidth="2" className="ai-flow" markerEnd="url(#arrowhead3)" />

      {/* AI Box */}
      <g className="ai-box ai-box-2">
        <rect x="270" y="10" width="180" height="80" rx="10" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <text x="360" y="40" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="800" fontFamily="monospace">Grok AI</text>
        <text x="360" y="58" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">via OpenRouter API</text>
        <text x="360" y="72" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">JSON structured output</text>
      </g>

      {/* Flow arrow */}
      <line x1="460" y1="50" x2="520" y2="50" stroke="#4ade80" strokeWidth="2" className="ai-flow" markerEnd="url(#arrowhead3)" />

      {/* Output */}
      <g className="ai-box ai-box-3">
        <rect x="530" y="15" width="160" height="70" rx="8" fill="none" stroke="#4ade80" strokeWidth="1.5" />
        <text x="610" y="42" textAnchor="middle" fill="#4ade80" fontSize="13" fontWeight="700" fontFamily="monospace">AI Analysis</text>
        <text x="610" y="60" textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">Summary + Factors</text>
      </g>

      <defs>
        <marker id="arrowhead3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#4ade80" />
        </marker>
      </defs>
    </svg>
  );
}

/* ================================================================
   FOOTER CTA
   ================================================================ */
function FooterCTA() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
          Ready to see it in action?
        </h2>
        <p className="text-muted-foreground font-mono text-sm mb-8">
          All indicators, signals, and AI analysis running live on real market data.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-mono font-bold
                       bg-[#4ade80] text-black rounded-lg
                       hover:bg-[#22c55e] transition-all pulse-green cursor-pointer"
          >
            Open Dashboard <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-mono
                       border border-border text-foreground rounded-lg
                       hover:border-foreground/40 hover:bg-foreground/5 transition-all cursor-pointer"
          >
            Back to Home
          </a>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SHARED COMPONENTS
   ================================================================ */
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4ade80]/10 text-[#4ade80]">
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h2>
    </div>
  );
}

/* ── Icons ───────────────────────────────────── */
function LayersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L2 7L10 12L18 7L10 2Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <path d="M2 10L10 15L18 10" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d="M2 13L10 18L18 13" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    </svg>
  );
}

function ChartLineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="2,16 6,10 10,13 14,5 18,8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="5" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.2" />
      <line x1="4" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M3,6 L1,12 L5,12 Z" fill="currentColor" opacity="0.3" />
      <path d="M17,6 L15,12 L19,12 Z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C7 2 5 4 5 6.5C5 8 5.5 9 6 10L5 18H15L14 10C14.5 9 15 8 15 6.5C15 4 13 2 10 2Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M7.5 6.5C7.5 6.5 8.5 7.5 10 7.5C11.5 7.5 12.5 6.5 12.5 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <circle cx="8.5" cy="5.5" r="0.8" fill="currentColor" opacity="0.6" />
      <circle cx="11.5" cy="5.5" r="0.8" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
