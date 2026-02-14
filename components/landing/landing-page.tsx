"use client";

import { DragonLogo } from "./dragon-logo";
import { AnimatedChart } from "./animated-chart";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "About", href: "#about" },
  { label: "Technical Paper", href: "#paper" },
];

const FEATURES = [
  {
    title: "AI-Powered",
    desc: "Claude Opus analyzes signals",
  },
  {
    title: "4 Indicators",
    desc: "RSI, EMA, MACD, Bollinger",
  },
  {
    title: "Real-time",
    desc: "Live Binance WebSocket data",
  },
  {
    title: "Open Source",
    desc: "Transparent & extensible",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white bg-grid">
      {/* ── Header ────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <DragonLogo size={36} />
            <span className="font-bold text-lg tracking-tight">Ryujin</span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white/50 hover:text-white transition-colors font-mono"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-mono
                         border border-[#4ade80]/30 text-[#4ade80] rounded-lg
                         hover:bg-[#4ade80]/10 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────── */}
      <main className="relative pt-16">
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div>
              <h1 className="hero-heading animate-fade-in-up">
                Ryujin
              </h1>
              <p className="mt-8 text-lg md:text-xl text-white/50 max-w-lg animate-fade-in-up animate-delay-1 font-mono">
                AI-powered Bitcoin signal intelligence for everyone.
              </p>
              <p className="mt-2 text-lg md:text-xl text-[#4ade80] animate-fade-in-up animate-delay-2 font-mono">
                Smarter signals. No guesswork.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up animate-delay-3">
                <button
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-mono font-bold
                             bg-[#4ade80] text-black rounded-lg
                             hover:bg-[#22c55e] transition-all pulse-green cursor-pointer"
                >
                  <span className="text-black font-extrabold">Free</span> open source
                </button>
                <button
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-mono
                             border border-white/20 text-white rounded-lg
                             hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer"
                >
                  Explore Platform <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>

            {/* Right — animated chart */}
            <div className="animate-fade-in-up animate-delay-2">
              <AnimatedChart />
            </div>
          </div>
        </section>

        {/* ── How it works (mini) ─────────────── */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animate-delay-4">
            <WorkflowCard
              step="01"
              title="Ingest"
              desc="Real-time OHLCV data from Binance WebSocket. Every tick, every move."
              icon={<CandlestickIcon />}
            />
            <WorkflowCard
              step="02"
              title="Compute"
              desc="Technical indicators — RSI, EMA, MACD, Bollinger Bands — calculated on live data."
              icon={<IndicatorIcon />}
            />
            <WorkflowCard
              step="03"
              title="Reason"
              desc="Claude Opus analyzes indicators, justifies the signal, and scores confidence."
              icon={<BrainIcon />}
            />
          </div>
        </section>

        {/* ── Feature bar ─────────────────────── */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className={`px-6 py-8 ${
                    i < FEATURES.length - 1 ? "border-r border-white/5" : ""
                  }`}
                >
                  <p className="text-sm font-bold font-mono text-white">{f.title}</p>
                  <p className="mt-1 text-xs text-white/40 font-mono">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── Workflow card ─────────────────────────── */
function WorkflowCard({
  step,
  title,
  desc,
  icon,
}: {
  step: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#4ade80]/20 hover:bg-[#4ade80]/[0.03] transition-all">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-mono text-[#4ade80]/60">{step}</span>
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4ade80]/10 text-[#4ade80]">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold font-mono">{title}</h3>
      <p className="mt-2 text-sm text-white/40 font-mono leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Mini SVG icons ───────────────────────── */
function CandlestickIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="3" height="14" rx="0.5" fill="currentColor" opacity="0.8" />
      <line x1="5.5" y1="1" x2="5.5" y2="3" stroke="currentColor" strokeWidth="1" />
      <line x1="5.5" y1="17" x2="5.5" y2="19" stroke="currentColor" strokeWidth="1" />
      <rect x="10" y="6" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.5" />
      <line x1="11.5" y1="4" x2="11.5" y2="6" stroke="currentColor" strokeWidth="1" />
      <line x1="11.5" y1="14" x2="11.5" y2="17" stroke="currentColor" strokeWidth="1" />
      <rect x="16" y="2" width="3" height="10" rx="0.5" fill="currentColor" opacity="0.3" />
      <line x1="17.5" y1="0" x2="17.5" y2="2" stroke="currentColor" strokeWidth="1" />
      <line x1="17.5" y1="12" x2="17.5" y2="15" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function IndicatorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="1,15 5,10 9,12 13,5 17,8 19,3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="1,17 5,14 9,16 13,11 17,13 19,9" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" strokeDasharray="2,2" />
      <circle cx="13" cy="5" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C7 2 5 4 5 6.5C5 8 5.5 9 6 10L5 18H15L14 10C14.5 9 15 8 15 6.5C15 4 13 2 10 2Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M7.5 6.5C7.5 6.5 8.5 7.5 10 7.5C11.5 7.5 12.5 6.5 12.5 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <line x1="10" y1="10" x2="10" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <circle cx="8.5" cy="5.5" r="0.8" fill="currentColor" opacity="0.6" />
      <circle cx="11.5" cy="5.5" r="0.8" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
