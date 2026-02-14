"use client";

export function AnimatedChart() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 320"
      className="w-full max-w-[480px] h-auto"
    >
      <style>{`
        .candle-green { fill: #4ade80; }
        .candle-red { fill: #ef4444; }
        .wick { stroke-width: 1.5; }
        .wick-green { stroke: #4ade80; }
        .wick-red { stroke: #ef4444; }

        .chart-line {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: draw-line 3s ease-out forwards;
        }
        .ema-line {
          animation-delay: 0.5s;
        }
        .rsi-line {
          animation-delay: 1s;
        }

        .candle-anim {
          opacity: 0;
          animation: candle-pop 0.3s ease-out forwards;
        }
        .c1 { animation-delay: 0.2s; }
        .c2 { animation-delay: 0.35s; }
        .c3 { animation-delay: 0.5s; }
        .c4 { animation-delay: 0.65s; }
        .c5 { animation-delay: 0.8s; }
        .c6 { animation-delay: 0.95s; }
        .c7 { animation-delay: 1.1s; }
        .c8 { animation-delay: 1.25s; }
        .c9 { animation-delay: 1.4s; }
        .c10 { animation-delay: 1.55s; }
        .c11 { animation-delay: 1.7s; }
        .c12 { animation-delay: 1.85s; }

        .signal-arrow {
          opacity: 0;
          animation: signal-pop 0.6s ease-out 2.2s forwards;
        }
        .signal-glow {
          opacity: 0;
          animation: glow-pulse 2s ease-in-out 2.2s infinite;
        }

        .indicator-label {
          opacity: 0;
          animation: fade-in 0.5s ease-out forwards;
          font-family: monospace;
          font-size: 10px;
        }
        .label-rsi { animation-delay: 1.8s; }
        .label-ema { animation-delay: 1.2s; }
        .label-macd { animation-delay: 2s; }
        .label-signal { animation-delay: 2.3s; }

        .confidence-bar {
          transform: scaleX(0);
          transform-origin: left;
          animation: bar-fill 1s ease-out 2.5s forwards;
        }

        .grid-line {
          opacity: 0;
          animation: fade-in 0.4s ease-out forwards;
        }
        .g1 { animation-delay: 0s; }
        .g2 { animation-delay: 0.05s; }
        .g3 { animation-delay: 0.1s; }
        .g4 { animation-delay: 0.15s; }

        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes candle-pop {
          from { opacity: 0; transform: scaleY(0); }
          to { opacity: 1; transform: scaleY(1); }
        }
        @keyframes signal-pop {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bar-fill {
          to { transform: scaleX(1); }
        }
      `}</style>

      <defs>
        <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        <linearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="480" height="320" rx="12" fill="url(#chartBg)" />
      <rect x="1" y="1" width="478" height="318" rx="11" fill="none" stroke="#4ade80" strokeOpacity="0.1" strokeWidth="1" />

      {/* Grid lines */}
      <line className="grid-line g1" x1="40" y1="60" x2="440" y2="60" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.5" />
      <line className="grid-line g2" x1="40" y1="110" x2="440" y2="110" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.5" />
      <line className="grid-line g3" x1="40" y1="160" x2="440" y2="160" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.5" />
      <line className="grid-line g4" x1="40" y1="210" x2="440" y2="210" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.5" />

      {/* Price labels */}
      <text x="445" y="64" fill="#666" fontSize="8" fontFamily="monospace">98,500</text>
      <text x="445" y="114" fill="#666" fontSize="8" fontFamily="monospace">97,200</text>
      <text x="445" y="164" fill="#666" fontSize="8" fontFamily="monospace">95,800</text>
      <text x="445" y="214" fill="#666" fontSize="8" fontFamily="monospace">94,500</text>

      {/* Candlesticks - BTCUSDT pattern */}
      {/* Green candles (bullish) */}
      <g className="candle-anim c1" style={{ transformOrigin: "65px 160px" }}>
        <line x1="65" y1="140" x2="65" y2="190" className="wick wick-red" />
        <rect x="59" y="155" width="12" height="25" className="candle-red" rx="1" />
      </g>
      <g className="candle-anim c2" style={{ transformOrigin: "95px 165px" }}>
        <line x1="95" y1="150" x2="95" y2="200" className="wick wick-red" />
        <rect x="89" y="160" width="12" height="30" className="candle-red" rx="1" />
      </g>
      <g className="candle-anim c3" style={{ transformOrigin: "125px 175px" }}>
        <line x1="125" y1="160" x2="125" y2="195" className="wick wick-red" />
        <rect x="119" y="170" width="12" height="18" className="candle-red" rx="1" />
      </g>
      <g className="candle-anim c4" style={{ transformOrigin: "155px 180px" }}>
        <line x1="155" y1="172" x2="155" y2="205" className="wick wick-green" />
        <rect x="149" y="175" width="12" height="22" className="candle-green" rx="1" />
      </g>
      <g className="candle-anim c5" style={{ transformOrigin: "185px 170px" }}>
        <line x1="185" y1="155" x2="185" y2="190" className="wick wick-green" />
        <rect x="179" y="160" width="12" height="22" className="candle-green" rx="1" />
      </g>
      <g className="candle-anim c6" style={{ transformOrigin: "215px 155px" }}>
        <line x1="215" y1="140" x2="215" y2="175" className="wick wick-green" />
        <rect x="209" y="145" width="12" height="22" className="candle-green" rx="1" />
      </g>
      <g className="candle-anim c7" style={{ transformOrigin: "245px 148px" }}>
        <line x1="245" y1="130" x2="245" y2="165" className="wick wick-red" />
        <rect x="239" y="140" width="12" height="18" className="candle-red" rx="1" />
      </g>
      <g className="candle-anim c8" style={{ transformOrigin: "275px 135px" }}>
        <line x1="275" y1="118" x2="275" y2="155" className="wick wick-green" />
        <rect x="269" y="125" width="12" height="24" className="candle-green" rx="1" />
      </g>
      <g className="candle-anim c9" style={{ transformOrigin: "305px 120px" }}>
        <line x1="305" y1="105" x2="305" y2="142" className="wick wick-green" />
        <rect x="299" y="110" width="12" height="26" className="candle-green" rx="1" />
      </g>
      <g className="candle-anim c10" style={{ transformOrigin: "335px 108px" }}>
        <line x1="335" y1="92" x2="335" y2="128" className="wick wick-green" />
        <rect x="329" y="98" width="12" height="22" className="candle-green" rx="1" />
      </g>
      <g className="candle-anim c11" style={{ transformOrigin: "365px 100px" }}>
        <line x1="365" y1="88" x2="365" y2="120" className="wick wick-red" />
        <rect x="359" y="95" width="12" height="18" className="candle-red" rx="1" />
      </g>
      <g className="candle-anim c12" style={{ transformOrigin: "395px 90px" }}>
        <line x1="395" y1="75" x2="395" y2="112" className="wick wick-green" />
        <rect x="389" y="82" width="12" height="24" className="candle-green" rx="1" />
      </g>

      {/* EMA line (smooth moving average) */}
      <polyline
        className="chart-line ema-line"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeOpacity="0.7"
        points="65,170 95,178 125,180 155,178 185,170 215,158 245,150 275,138 305,125 335,112 365,105 395,95"
      />

      {/* Bollinger upper band */}
      <polyline
        className="chart-line"
        fill="none"
        stroke="#6366f1"
        strokeWidth="0.8"
        strokeOpacity="0.3"
        strokeDasharray="4,4"
        points="65,135 95,142 125,148 155,152 185,142 215,128 245,118 275,105 305,88 335,78 365,75 395,68"
      />

      {/* Buy signal arrow */}
      <g className="signal-arrow">
        <polygon points="155,210 148,222 162,222" fill="#4ade80" />
        <text x="142" y="234" fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="bold">BUY</text>
      </g>

      {/* Signal glow */}
      <circle className="signal-glow" cx="155" cy="215" r="18" fill="none" stroke="#4ade80" strokeWidth="1" />

      {/* RSI mini-chart area */}
      <rect x="40" y="248" width="400" height="1" fill="#fff" fillOpacity="0.1" />
      <text className="indicator-label label-rsi" x="42" y="264" fill="#4ade80">RSI: 62.8</text>

      {/* RSI line in mini area */}
      <polyline
        className="chart-line rsi-line"
        fill="none"
        stroke="#4ade80"
        strokeWidth="1"
        strokeOpacity="0.6"
        points="65,290 95,295 125,298 155,285 185,278 215,272 245,280 275,270 305,265 335,262 365,268 395,265"
      />

      {/* RSI threshold lines */}
      <line x1="40" y1="272" x2="440" y2="272" stroke="#4ade80" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="3,3" />
      <line x1="40" y1="292" x2="440" y2="292" stroke="#ef4444" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="3,3" />

      {/* EMA label */}
      <text className="indicator-label label-ema" x="400" y="90" fill="#f59e0b">EMA 21</text>

      {/* MACD label */}
      <text className="indicator-label label-macd" x="350" y="264" fill="#6366f1">MACD +0.42</text>

      {/* Confidence score panel */}
      <g className="signal-arrow">
        <rect x="40" y="25" width="120" height="24" rx="4" fill="#4ade80" fillOpacity="0.1" stroke="#4ade80" strokeOpacity="0.2" strokeWidth="0.5" />
        <text x="50" y="41" fill="#4ade80" fontSize="10" fontFamily="monospace" fontWeight="bold">Confidence</text>
        <rect x="112" y="33" width="40" height="10" rx="2" fill="#222" />
        <rect className="confidence-bar" x="112" y="33" width="32" height="10" rx="2" fill="#4ade80" />
        <text className="indicator-label label-signal" x="120" y="41" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold">82%</text>
      </g>

      {/* BTC symbol in corner */}
      <text x="400" y="40" fill="#fff" fillOpacity="0.5" fontSize="11" fontFamily="monospace" fontWeight="bold">BTCUSDT</text>

      {/* Bottom border glow */}
      <rect x="40" y="310" width="400" height="2" rx="1" fill="url(#greenGlow)" opacity="0.5" />
    </svg>
  );
}
