"use client";

import type { PatternBias } from "@/lib/types";

const BIAS_COLORS: Record<PatternBias, string> = {
  bullish: "#4ade80",
  bearish: "#f87171",
  neutral: "#facc15",
};

function strokeColor(bias: PatternBias) {
  return BIAS_COLORS[bias];
}

function KeyPoint({ cx, cy, bias }: { cx: number; cy: number; bias: PatternBias }) {
  return (
    <circle cx={cx} cy={cy} r="4" fill={strokeColor(bias)} className="animate-pulse-point" />
  );
}

function DoubleTopSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <polyline points="10,80 50,25 90,55 130,25 170,55 220,85 270,90" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <line x1="50" y1="25" x2="130" y2="25" stroke={c} strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
      <KeyPoint cx={50} cy={25} bias={bias} />
      <KeyPoint cx={90} cy={55} bias={bias} />
      <KeyPoint cx={130} cy={25} bias={bias} />
    </svg>
  );
}

function DoubleBottomSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <polyline points="10,20 50,75 90,45 130,75 170,45 220,15 270,10" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <line x1="50" y1="75" x2="130" y2="75" stroke={c} strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
      <KeyPoint cx={50} cy={75} bias={bias} />
      <KeyPoint cx={90} cy={45} bias={bias} />
      <KeyPoint cx={130} cy={75} bias={bias} />
    </svg>
  );
}

function HeadAndShouldersSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <polyline points="10,70 50,35 80,60 140,15 200,60 230,35 270,70" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <line x1="80" y1="60" x2="200" y2="60" stroke={c} strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
      <KeyPoint cx={50} cy={35} bias={bias} />
      <KeyPoint cx={140} cy={15} bias={bias} />
      <KeyPoint cx={230} cy={35} bias={bias} />
    </svg>
  );
}

function InverseHeadAndShouldersSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <polyline points="10,30 50,65 80,40 140,85 200,40 230,65 270,30" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <line x1="80" y1="40" x2="200" y2="40" stroke={c} strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
      <KeyPoint cx={50} cy={65} bias={bias} />
      <KeyPoint cx={140} cy={85} bias={bias} />
      <KeyPoint cx={230} cy={65} bias={bias} />
    </svg>
  );
}

function AscendingTriangleSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <line x1="20" y1="20" x2="260" y2="20" stroke={c} strokeWidth="1.5" className="draw-line" strokeDasharray="4,4" opacity="0.6" />
      <polyline points="20,80 70,20 100,65 150,20 180,50 230,20 260,35" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <KeyPoint cx={20} cy={80} bias={bias} />
      <KeyPoint cx={100} cy={65} bias={bias} />
      <KeyPoint cx={180} cy={50} bias={bias} />
    </svg>
  );
}

function DescendingTriangleSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <line x1="20" y1="80" x2="260" y2="80" stroke={c} strokeWidth="1.5" className="draw-line" strokeDasharray="4,4" opacity="0.6" />
      <polyline points="20,20 70,80 100,35 150,80 180,50 230,80 260,65" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <KeyPoint cx={20} cy={20} bias={bias} />
      <KeyPoint cx={100} cy={35} bias={bias} />
      <KeyPoint cx={180} cy={50} bias={bias} />
    </svg>
  );
}

function BullFlagSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <polyline points="20,85 60,80 100,30 120,35 140,38 160,40 180,42 200,38 220,35" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <line x1="100" y1="30" x2="220" y2="35" stroke={c} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
      <line x1="100" y1="30" x2="120" y2="50" stroke={c} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
      <KeyPoint cx={20} cy={85} bias={bias} />
      <KeyPoint cx={100} cy={30} bias={bias} />
      <KeyPoint cx={220} cy={35} bias={bias} />
    </svg>
  );
}

function BearFlagSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <polyline points="20,15 60,20 100,70 120,65 140,62 160,60 180,58 200,62 220,65" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <line x1="100" y1="70" x2="220" y2="65" stroke={c} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
      <KeyPoint cx={20} cy={15} bias={bias} />
      <KeyPoint cx={100} cy={70} bias={bias} />
      <KeyPoint cx={220} cy={65} bias={bias} />
    </svg>
  );
}

function RisingWedgeSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <line x1="20" y1="80" x2="260" y2="25" stroke={c} strokeWidth="1.5" className="draw-line" opacity="0.5" />
      <line x1="20" y1="90" x2="260" y2="35" stroke={c} strokeWidth="1.5" className="draw-line" opacity="0.5" />
      <polyline points="20,85 70,60 100,70 150,40 190,50 240,30 260,30" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <KeyPoint cx={20} cy={85} bias={bias} />
      <KeyPoint cx={150} cy={40} bias={bias} />
      <KeyPoint cx={260} cy={30} bias={bias} />
    </svg>
  );
}

function FallingWedgeSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <line x1="20" y1="20" x2="260" y2="75" stroke={c} strokeWidth="1.5" className="draw-line" opacity="0.5" />
      <line x1="20" y1="10" x2="260" y2="65" stroke={c} strokeWidth="1.5" className="draw-line" opacity="0.5" />
      <polyline points="20,15 70,40 100,30 150,60 190,50 240,70 260,70" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <KeyPoint cx={20} cy={15} bias={bias} />
      <KeyPoint cx={150} cy={60} bias={bias} />
      <KeyPoint cx={260} cy={70} bias={bias} />
    </svg>
  );
}

function CupAndHandleSVG({ bias }: { bias: PatternBias }) {
  const c = strokeColor(bias);
  return (
    <svg viewBox="0 0 280 100" width="100%" className="pattern-svg">
      <path d="M 20,25 Q 30,25 50,50 Q 80,85 140,85 Q 200,85 220,50 Q 235,25 240,25 Q 245,25 250,35 Q 255,40 260,35 Q 265,30 270,25" fill="none" stroke={c} strokeWidth="2" className="draw-line" />
      <KeyPoint cx={20} cy={25} bias={bias} />
      <KeyPoint cx={140} cy={85} bias={bias} />
      <KeyPoint cx={240} cy={25} bias={bias} />
    </svg>
  );
}

const PATTERN_MAP: Record<string, React.FC<{ bias: PatternBias }>> = {
  "Double Top": DoubleTopSVG,
  "Double Bottom": DoubleBottomSVG,
  "Head & Shoulders": HeadAndShouldersSVG,
  "Inverse Head & Shoulders": InverseHeadAndShouldersSVG,
  "Ascending Triangle": AscendingTriangleSVG,
  "Descending Triangle": DescendingTriangleSVG,
  "Bull Flag": BullFlagSVG,
  "Bear Flag": BearFlagSVG,
  "Rising Wedge": RisingWedgeSVG,
  "Falling Wedge": FallingWedgeSVG,
  "Cup & Handle": CupAndHandleSVG,
};

export function PatternVisualization({ patternName, bias }: { patternName: string; bias: PatternBias }) {
  const Component = PATTERN_MAP[patternName];
  if (!Component) return null;
  return <Component bias={bias} />;
}
