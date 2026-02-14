"use client";

export function DragonLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
    >
      <style>{`
        .dragon-eye {
          animation: dragon-blink 4s ease-in-out infinite;
        }
        .dragon-flame {
          animation: flame-flicker 1.5s ease-in-out infinite;
          transform-origin: 75px 42px;
        }
        .dragon-wing-l {
          animation: wing-flap 3s ease-in-out infinite;
          transform-origin: 30px 35px;
        }
        .dragon-wing-r {
          animation: wing-flap 3s ease-in-out infinite reverse;
          transform-origin: 70px 35px;
        }
        .dragon-tail {
          animation: tail-wag 2s ease-in-out infinite;
          transform-origin: 15px 60px;
        }
        @keyframes dragon-blink {
          0%, 42%, 48%, 100% { transform: scaleY(1); }
          45% { transform: scaleY(0.1); }
        }
        @keyframes flame-flicker {
          0%, 100% { opacity: 0.8; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1.15); }
        }
        @keyframes wing-flap {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-6deg); }
        }
        @keyframes tail-wag {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-4deg); }
          75% { transform: rotate(4deg); }
        }
      `}</style>
      <defs>
        <linearGradient id="dragonGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="dragonDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="92" rx="25" ry="5" fill="#000" opacity="0.2" />

      {/* Tail */}
      <g className="dragon-tail">
        <rect x="8" y="55" width="14" height="8" rx="2" fill="url(#dragonDark)" />
        <rect x="2" y="50" width="10" height="8" rx="2" fill="url(#dragonDark)" />
      </g>

      {/* Left wing */}
      <g className="dragon-wing-l">
        <polygon points="30,35 8,15 12,40 25,42" fill="url(#dragonDark)" opacity="0.9" />
        <polygon points="30,35 14,20 18,38" fill="url(#dragonGreen)" opacity="0.5" />
      </g>

      {/* Right wing */}
      <g className="dragon-wing-r">
        <polygon points="70,35 92,15 88,40 75,42" fill="url(#dragonDark)" opacity="0.9" />
        <polygon points="70,35 86,20 82,38" fill="url(#dragonGreen)" opacity="0.5" />
      </g>

      {/* Body */}
      <rect x="25" y="40" width="50" height="28" rx="3" fill="url(#dragonGreen)" />

      {/* Belly stripe */}
      <rect x="35" y="48" width="30" height="16" rx="2" fill="#86efac" opacity="0.3" />

      {/* Head */}
      <rect x="28" y="18" width="44" height="26" rx="3" fill="url(#dragonGreen)" />

      {/* Horns */}
      <rect x="28" y="10" width="8" height="12" rx="1" fill="url(#dragonDark)" />
      <rect x="64" y="10" width="8" height="12" rx="1" fill="url(#dragonDark)" />

      {/* Snout */}
      <rect x="60" y="30" width="16" height="10" rx="2" fill="#22c55e" />
      <rect x="70" y="33" width="4" height="3" rx="1" fill="#166534" />

      {/* Eyes */}
      <rect
        className="dragon-eye"
        x="36" y="26" width="9" height="9" rx="1"
        fill="#000"
        style={{ transformOrigin: "40px 30px" }}
      />
      <rect
        className="dragon-eye"
        x="52" y="26" width="9" height="9" rx="1"
        fill="#000"
        style={{ transformOrigin: "56px 30px" }}
      />
      {/* Pupils */}
      <rect x="41" y="28" width="4" height="4" rx="1" fill="#fff" />
      <rect x="57" y="28" width="4" height="4" rx="1" fill="#fff" />

      {/* Flame */}
      <g className="dragon-flame">
        <ellipse cx="82" cy="36" rx="8" ry="4" fill="#4ade80" opacity="0.6" />
        <ellipse cx="86" cy="36" rx="5" ry="3" fill="#86efac" opacity="0.8" />
        <ellipse cx="89" cy="36" rx="3" ry="2" fill="#fff" opacity="0.5" />
      </g>

      {/* Legs */}
      <rect x="30" y="66" width="12" height="12" rx="1" fill="url(#dragonGreen)" />
      <rect x="58" y="66" width="12" height="12" rx="1" fill="url(#dragonGreen)" />

      {/* Feet */}
      <rect x="28" y="76" width="16" height="6" rx="2" fill="url(#dragonDark)" />
      <rect x="56" y="76" width="16" height="6" rx="2" fill="url(#dragonDark)" />
    </svg>
  );
}
