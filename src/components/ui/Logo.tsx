import { useId, useState } from "react";

export function Logo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src="/images/logo.png"
        alt="Neuro Paradigm logo"
        className={`${className ?? ""} object-contain`}
        onError={() => setFailed(true)}
        draggable={false}
      />
    );
  }

  return <FallbackMark className={className} />;
}

function FallbackMark({ className }: { className?: string }) {
  const raw = useId();
  const uid = raw.replace(/[:]/g, "");
  const tId = `npT-${uid}`;
  const bId = `npB-${uid}`;
  const clipId = `npC-${uid}`;

  return (
    <svg
      viewBox="0 0 230 205"
      className={className}
      role="img"
      aria-label="Neuro Paradigm logo"
      style={{
        filter:
          "drop-shadow(0 0 1px rgba(255,255,255,.85)) drop-shadow(0 0 4px rgba(255,255,255,.4))",
      }}
    >
      <defs>
        <linearGradient id={tId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#3E86B8" />
          <stop offset="32%" stopColor="#45AFA5" />
          <stop offset="60%" stopColor="#A9CF59" />
          <stop offset="82%" stopColor="#EDC24E" />
          <stop offset="100%" stopColor="#F2AF49" />
        </linearGradient>
        <linearGradient id={bId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6E57A4" />
          <stop offset="45%" stopColor="#A75A98" />
          <stop offset="78%" stopColor="#DE6193" />
          <stop offset="100%" stopColor="#EE8F5A" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={HEAD_PATH} />
        </clipPath>
      </defs>

      <path d={HEAD_PATH} fill={`url(#${tId})`} />

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M8 205 L232 205 L232 26 C 180 92 118 148 26 178 Z"
          fill={`url(#${bId})`}
        />
      </g>

      <path
        d="M34 170 C 82 152 132 110 184 42"
        fill="none"
        stroke="#ffffff"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M44 177 C 94 159 142 118 190 54"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      <g stroke="#ffffff" strokeWidth="5" strokeLinecap="round">
        <line x1="66" y1="86" x2="92" y2="60" />
        <line x1="92" y1="60" x2="120" y2="52" />
        <line x1="120" y1="52" x2="146" y2="74" />
        <line x1="146" y1="74" x2="104" y2="92" />
        <line x1="104" y1="92" x2="66" y2="86" />
        <line x1="66" y1="86" x2="72" y2="112" />
        <line x1="72" y1="112" x2="96" y2="122" />
        <line x1="96" y1="122" x2="104" y2="92" />
      </g>
      <g fill="#ffffff">
        <circle cx="66" cy="86" r="9" />
        <circle cx="92" cy="60" r="11" />
        <circle cx="120" cy="52" r="6.5" />
        <circle cx="146" cy="74" r="8" />
        <circle cx="104" cy="92" r="12" />
        <circle cx="72" cy="112" r="6.5" />
        <circle cx="96" cy="122" r="8.5" />
        <circle cx="88" cy="139" r="4.5" />
      </g>

      <g clipPath={`url(#${clipId})`}>
        {PIXELS.map(([x, y, s, c], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={s}
            height={s}
            rx="1.5"
            fill={c}
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}
        <path d="M117 121 h22 v8 h-22 z M124 114 v22 h8 v-22 z" fill="#ffffff" />
        <path d="M103 149 h15 v6 h-15 z M107.5 144.5 v15 h6 v-15 z" fill="#ffffff" />
      </g>

      {FLOATING_PIXELS.map(([x, y, s, c], i) => (
        <rect
          key={`f-${i}`}
          x={x}
          y={y}
          width={s}
          height={s}
          rx="1.5"
          fill={c}
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.95"
        />
      ))}

      <Sparkle x={203} y={22} s={17} />
      <Sparkle x={166} y={14} s={9} />
      <Sparkle x={54} y={44} s={7} />
      <Sparkle x={98} y={168} s={6} />
      <circle cx="212" cy="52" r="2.4" fill="#F0B84A" />
      <circle cx="218" cy="96" r="2.2" fill="#E0619A" />
      <circle cx="214" cy="128" r="2" fill="#8A5BA8" />
    </svg>
  );
}

const HEAD_PATH =
  "M120 10 C 76 10 44 38 39 76 C 37 89 29 97 21 103 L 11 111 L 22 117 C 24 119 23 122 21 125 L 15 131 L 24 134 C 26.5 135 27.5 137.5 25.5 140.5 L 19 147.5 L 29 150.5 C 31.5 151.5 32.5 154 32.5 157 L 33.5 171 C 34.5 181 42.5 189 53 189 L 118 189 L 152 189 C 179 187 197 163 197 130 C 197 66 165 10 120 10 Z";

const PIXELS: Array<[number, number, number, string]> = [
  [148, 30, 13, "#F5D95A"],
  [166, 44, 15, "#F0B84A"],
  [183, 62, 12, "#EE8F4A"],
  [157, 62, 9, "#F0B84A"],
  [172, 82, 13, "#E8825A"],
  [188, 100, 11, "#E0619A"],
  [150, 88, 10, "#EE8F4A"],
  [163, 106, 12, "#DE6193"],
  [180, 122, 9, "#D94F63"],
  [146, 112, 8, "#E8825A"],
  [155, 130, 11, "#C85B8E"],
  [172, 142, 8, "#B0568F"],
  [143, 145, 9, "#A75A98"],
  [160, 158, 10, "#8A5BA8"],
  [178, 160, 7, "#7C5FA8"],
];

const FLOATING_PIXELS: Array<[number, number, number, string]> = [
  [202, 40, 8, "#F5D95A"],
  [208, 74, 7, "#EE8F4A"],
  [205, 108, 6, "#E0619A"],
  [209, 140, 6, "#8A5BA8"],
];

function Sparkle({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d={`M${x} ${y - s} Q ${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q ${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q ${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q ${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z`}
      fill="#ffffff"
    />
  );
}
