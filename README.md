# Ryujin

**AI-powered Bitcoin signal intelligence.** Technical indicators meet LLM reasoning.

Ryujin is a real-time BTCUSDT trading dashboard that computes technical indicators client-side, generates composite BUY/SELL/HOLD signals with confidence scoring, and uses Claude (via AWS Bedrock) to produce plain-English explanations of _why_ the signal was generated.

> **Ryujin** (Dragon God) — a deity of the sea in Japanese mythology, known for wisdom and control over tides.

---

## What It Does

```
Binance REST API (200 historical candles)
        |
   useBinance() hook
        |                    <-- Binance WebSocket merges live ticks
  candles[] state
        |
  computeAllIndicators()  --> RSI(14), EMA(9/21), MACD(12,26,9), Bollinger(20,2)
        |
  generateSignal()        --> BUY/SELL/HOLD + confidence % + strength
        |
  [User clicks "Run AI Analysis"]
        |
  POST /api/analyze       --> Claude via AWS Bedrock --> plain-English breakdown
```

**Four technical indicators** are computed entirely in the browser (zero server cost):

| Indicator | What It Measures | Signal Logic |
|-----------|-----------------|--------------|
| **RSI(14)** | Momentum / overbought-oversold | < 30 = oversold (BUY), > 70 = overbought (SELL) |
| **EMA(9/21)** | Trend direction via crossover | EMA9 > EMA21 = bullish, EMA9 < EMA21 = bearish |
| **MACD(12,26,9)** | Trend strength + momentum | Histogram positive = bullish momentum |
| **Bollinger Bands(20,2)** | Volatility + price extremes | %B < 0.2 = oversold, %B > 0.8 = overbought |

Each indicator scores **-100 to +100**. The composite (equal-weight average) determines:
- **> +15**: BUY
- **< -15**: SELL
- **-15 to +15**: HOLD
- **Confidence** = |composite|, capped at 100
- **Strength**: >= 70 STRONG, >= 40 MODERATE, else WEAK

---

## Dashboard Layout

```
+------------------------------------------------------------------+
|  [Price $97,234]  [24H High $98,100]  [Volume 12.3k]  [RSI 62]  |  <-- TopStatsBar
+--------------------------------------------+---------------------+
|  [1H] [4H] [1D] [1W]  EMA  BB        Live |  AI Analysis Panel  |
|                                             |                     |
|  +---------------------------------------+  |  [Run AI Analysis]  |
|  |                                       |  |                     |
|  |     TradingView Candlestick Chart     |  |  +-- BUY -- 75% --+|
|  |     + EMA overlays + Bollinger        |  |  |  MODERATE       ||
|  |     + zoom / pan / crosshair          |  |  |  Score: +22.5   ||
|  |                                       |  |  +----------------+|
|  +---------------------------------------+  |                     |
|  | RSI(14) sub-pane       ----70----     |  |  > Bullish Factors  |
|  | ~~~~~~~~~~~~~~~line~~~ ----30----     |  |  > Bearish Factors  |
|  +---------------------------------------+  |  > Risk Factors     |
|                                             |  > Indicator Detail  |
+--------------------------------------------+---------------------+
          ~70% width                               ~30% width
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Charting | TradingView [lightweight-charts](https://github.com/nickvdyck/lightweight-charts) v5 |
| Market Data | Binance REST + WebSocket (client-side, no API key needed) |
| Indicators | Pure TypeScript (EMA, RSI, MACD, Bollinger) |
| AI | Grok 4.1 Fast via [OpenRouter](https://openrouter.ai) SDK |
| Fonts | JetBrains Mono + Geist |

---

## Quick Start

### Prerequisites

- Node.js 18+
- An [OpenRouter](https://openrouter.ai) API key

### 1. Clone & install

```bash
git clone <repo-url>
cd ryu-self-learning-agents
npm install
```

### 2. Configure OpenRouter

Create `.env.local` in the project root:

```bash
# OpenRouter API key (get one at https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Model (default: x-ai/grok-4.1-fast — see https://openrouter.ai/models for options)
OPENROUTER_MODEL=x-ai/grok-4.1-fast
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or go directly to [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

### 4. Test the OpenRouter connection

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"x-ai/grok-4.1-fast","messages":[{"role":"user","content":"Say hello"}]}'
```

---

## Project Structure

```
ryu-self-learning-agents/
|
|-- app/
|   |-- page.tsx                          # Landing page route (/)
|   |-- layout.tsx                        # Root layout (dark mode, fonts)
|   |-- globals.css                       # Tailwind + shadcn + green accent tokens
|   |-- dashboard/
|   |   +-- page.tsx                      # Dashboard route (/dashboard)
|   +-- api/
|       +-- analyze/
|           +-- route.ts                  # POST: AI analysis endpoint (OpenRouter)
|
|-- components/
|   |-- landing/
|   |   |-- landing-page.tsx              # Full landing page
|   |   |-- dragon-logo.tsx               # Animated SVG pixel-art dragon
|   |   +-- animated-chart.tsx            # Hero section chart animation
|   |-- dashboard/
|   |   |-- dashboard-shell.tsx           # Client orchestrator (state, hooks, layout)
|   |   |-- top-stats-bar.tsx             # Price, 24H High, Volume, RSI cards
|   |   |-- chart-toolbar.tsx             # Timeframe selector + indicator toggles
|   |   |-- connection-status.tsx         # WebSocket online/offline indicator
|   |   |-- price-chart.tsx              # TradingView lightweight-charts wrapper
|   |   |-- ai-analysis-panel.tsx         # Right sidebar: AI analysis container
|   |   |-- signal-card.tsx               # BUY/SELL/HOLD + confidence + strength
|   |   |-- analysis-section.tsx          # Expandable bullish/bearish/risk sections
|   |   +-- indicator-breakdown.tsx       # Per-indicator AI explanation cards
|   +-- ui/                               # shadcn/ui primitives (button, card, badge, etc.)
|
|-- lib/
|   |-- openrouter.ts                     # OpenRouter LLM client (@openrouter/sdk)
|   |-- types.ts                          # All domain interfaces
|   |-- utils.ts                          # cn() utility (clsx + tailwind-merge)
|   |-- binance/
|   |   |-- client.ts                     # REST: fetchKlines(interval, limit)
|   |   |-- websocket.ts                  # BinanceWS class (auto-reconnect)
|   |   +-- use-binance.ts               # React hook: REST bootstrap + WS live merge
|   |-- indicators/
|   |   |-- ema.ts                        # Exponential Moving Average
|   |   |-- rsi.ts                        # Relative Strength Index (Wilder's smoothing)
|   |   |-- macd.ts                       # MACD line + signal + histogram
|   |   |-- bollinger.ts                  # Bollinger Bands + bandwidth
|   |   +-- index.ts                      # computeAllIndicators() barrel
|   +-- signals/
|       +-- scorer.ts                     # Composite signal scorer
|
+-- prompts/
    +-- analyze-signal.ts                 # AI prompt template builder
```

---

## Architecture Deep Dive

### Data Flow

The dashboard follows a **unidirectional data flow**:

1. **Bootstrap**: `useBinance(interval)` fetches 200 historical candles via Binance REST
2. **Live merge**: A WebSocket connection streams live ticks. When `isClosed=false`, the last candle updates in-place (live price). When `isClosed=true`, a new candle is appended.
3. **Indicators**: `computeAllIndicators(candles)` runs pure-function math on the candle array. Needs >= 34 candles (26 for MACD slow period + 9 for signal = 34 minimum).
4. **Signal**: `generateSignal(indicators, candles)` scores each indicator (-100 to +100), averages them, and maps to BUY/SELL/HOLD.
5. **AI Analysis** (on-demand): User clicks "Run AI Analysis" -> POST `/api/analyze` -> the LLM (Grok 4.1 via OpenRouter) receives the last 20 candles + all indicator values + the algorithmic signal -> returns structured JSON with summary, factors, and per-indicator breakdowns.

### WebSocket Reconnection

The `BinanceWS` class implements **exponential backoff**: 1s, 2s, 4s, 8s... up to 30s max. Binance drops WS connections every 24h by exchange policy, so resilient reconnection is essential.

### Indicator Math

All indicators are **stateless pure functions** — they take `Candle[]` and return computed arrays. No classes, no side effects, trivially testable.

- **EMA**: SMA seed for first N values, then standard multiplier formula `(close - prevEMA) * k + prevEMA`
- **RSI**: Wilder's smoothing (not simple EMA) — `avgGain = (prevAvg * 13 + currentGain) / 14`
- **MACD**: Difference of two EMAs, with its own 9-period signal line EMA
- **Bollinger**: SMA(20) +/- 2 standard deviations. Bandwidth measures volatility.

### AI Prompt Design

The prompt sent to the LLM includes:
- Last 20 OHLCV candles as a formatted table
- All computed indicator values (exact numbers)
- The algorithmic signal with per-indicator scores and reasons
- Instructions to explain in **layman's terms** for someone who understands candlestick charts but not the math behind indicators

The LLM returns structured JSON with `summary`, `bullishFactors`, `bearishFactors`, `riskFactors`, and `indicatorBreakdown` — each breakdown item includes the indicator name, value, interpretation, and sentiment.

### Charting (lightweight-charts v5)

Uses TradingView's [lightweight-charts](https://github.com/nickvdyck/lightweight-charts) v5 — a 40KB canvas-based charting library. The v5 API uses `chart.addSeries(CandlestickSeries, opts)` (not the v4 `chart.addCandlestickSeries(opts)`).

Two synced charts are created:
1. **Main chart**: Candlesticks + optional EMA/Bollinger overlays
2. **RSI sub-chart**: Line with 30/70 reference levels

Time scales are synchronized — scrolling one chart scrolls the other.

---

## API Reference

### `POST /api/analyze`

Sends market data to the LLM for AI analysis.

**Request body:**

```json
{
  "candles": [{ "time": 1700000000, "open": 97000, "high": 97500, "low": 96500, "close": 97200, "volume": 100 }],
  "indicators": {
    "ema": { "ema9": 97300, "ema21": 97100 },
    "rsi": { "value": 62.5 },
    "macd": { "macd": 150, "signal": 120, "histogram": 30 },
    "bollinger": { "upper": 98500, "middle": 97200, "lower": 95900, "bandwidth": 0.027 }
  },
  "signal": {
    "direction": "BUY",
    "confidence": 45,
    "strength": "MODERATE",
    "composite": 22.5,
    "scores": [{ "name": "RSI(14)", "score": 0, "reason": "Neutral" }]
  }
}
```

**Response (200):**

```json
{
  "summary": "Bitcoin is showing mild bullish momentum...",
  "bullishFactors": ["EMA9 crossing above EMA21 indicates trend reversal", "..."],
  "bearishFactors": ["RSI approaching overbought at 68", "..."],
  "riskFactors": ["Bollinger squeeze suggests imminent volatility expansion", "..."],
  "indicatorBreakdown": [
    {
      "name": "RSI(14)",
      "value": "62.5",
      "interpretation": "RSI is in neutral territory but trending upward...",
      "sentiment": "neutral"
    }
  ]
}
```

**Error responses:**
- `400` — Missing required fields
- `401` — OpenRouter API key invalid or missing
- `500` — Analysis failed (check server logs)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key ([get one here](https://openrouter.ai/keys)) |
| `OPENROUTER_MODEL` | No | Defaults to `x-ai/grok-4.1-fast` |

**Note:** Binance market data requires no API key — it uses the public REST and WebSocket endpoints.

---

## Development

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Switching models

To use a different model, change `OPENROUTER_MODEL` in `.env.local`. Any model on [OpenRouter](https://openrouter.ai/models) works:

```bash
# Grok 4.1 Fast (default — fast, great for structured JSON)
OPENROUTER_MODEL=x-ai/grok-4.1-fast

# Claude Sonnet 4.5 (Anthropic)
OPENROUTER_MODEL=anthropic/claude-sonnet-4-5

# GPT-4o (OpenAI)
OPENROUTER_MODEL=openai/gpt-4o

# Gemini 2.5 Flash (Google)
OPENROUTER_MODEL=google/gemini-2.5-flash-preview
```

### Adding a new indicator

1. Create `lib/indicators/your-indicator.ts` with a pure function signature: `(candles: Candle[]) => number[]`
2. Add it to `lib/indicators/index.ts` in `computeAllIndicators()`
3. Add a scoring function in `lib/signals/scorer.ts`
4. Update the prompt in `prompts/analyze-signal.ts` to include the new values

---

## License

Open source. Built for learning and experimentation.

**Disclaimer:** This is an educational project. It does not constitute financial advice. Never trade based solely on algorithmic signals without your own research and risk management.
