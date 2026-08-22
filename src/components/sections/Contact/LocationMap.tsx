import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { PinIcon } from "../../ui/icons";

export function LocationMap() {
  const reduced = usePrefersReducedMotion();
  const [zoomed, setZoomed] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={frame}
      className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-hairline bg-elevated shadow-card"
    >
      <motion.div
        className="absolute inset-0 origin-[62%_38%]"
        animate={{ scale: zoomed ? 1.6 : 1, x: zoomed ? -30 : 0, y: zoomed ? -20 : 0 }}
        transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 800 450" className="h-full w-full" aria-hidden>
          <rect width="800" height="450" fill="var(--bg-sunken)" />
          <g stroke="var(--hairline-strong)" strokeWidth="2" fill="none" opacity="0.6">
            <path d="M-20 90 H820" />
            <path d="M-20 210 H820" />
            <path d="M-20 330 H820" />
            <path d="M120 -20 V470" />
            <path d="M300 -20 V470" />
            <path d="M520 -20 V470" />
            <path d="M680 -20 V470" />
          </g>
          <g stroke="var(--hairline)" strokeWidth="1" fill="none" opacity="0.5">
            <path d="M-20 150 H820" />
            <path d="M-20 270 H820" />
            <path d="M-20 395 H820" />
            <path d="M60 -20 V470" />
            <path d="M220 -20 V470" />
            <path d="M420 -20 V470" />
            <path d="M600 -20 V470" />
          </g>
          <g fill="var(--coral-soft)">
            <rect x="140" y="110" width="130" height="80" rx="10" />
            <rect x="340" y="230" width="150" height="90" rx="10" />
            <rect x="545" y="100" width="110" height="90" rx="10" />
            <rect x="160" y="290" width="120" height="85" rx="10" />
          </g>
          <path
            d="M520 -20 C 480 140, 600 240, 500 470"
            fill="none"
            stroke="var(--sage)"
            strokeWidth="3"
            opacity="0.45"
          />
          <text
            x="512"
            y="40"
            fontFamily="JetBrains Mono, monospace"
            fontSize="11"
            letterSpacing="2"
            fill="var(--ink-secondary)"
          >
            WILLAMETTE RIVER
          </text>
        </svg>

        <div className="absolute left-[62%] top-[38%]">
          {zoomed && !reduced && (
            <motion.span
              className="absolute -inset-6 rounded-full border border-coral"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className="grid h-10 w-10 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-coral text-white shadow-lg">
            <PinIcon className="h-5 w-5" />
          </span>
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full border border-hairline bg-glass px-4 py-2 backdrop-blur-md">
        <span className="font-mono text-[10px] tracking-wide text-ink-soft">
          Pilot network HQ · Portland, OR
        </span>
        <button
          type="button"
          onClick={() => setZoomed((z) => !z)}
          className="font-mono text-[10px] font-semibold uppercase tracking-widest text-coral underline-offset-4 hover:underline"
        >
          {zoomed ? "Zoom out" : "Locate"}
        </button>
      </div>
    </div>
  );
}
