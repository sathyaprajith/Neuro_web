import { signals } from "../../../data/signals";

function helixPath(phase: number, amp: number): string {
  const pts: string[] = [];
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = 110 + Math.sin(t * Math.PI * 2 * 2.35 + phase) * amp;
    const y = 14 + t * 292;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

interface HelixFallbackProps {
  onSelectSignal?: (id: string) => void;
}

export function HelixFallback({ onSelectSignal }: HelixFallbackProps) {
  const rungs: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = 14 + t * 292;
    const a = Math.sin(t * Math.PI * 2 * 2.35) * 46;
    rungs.push({ x1: 110 + a, y1: y, x2: 110 - a, y2: y });
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
      <svg
        viewBox="0 0 220 320"
        className="h-[72vh] max-h-[560px] w-auto"
        role="img"
        aria-label="Static illustration of a DNA double helix"
      >
        <g stroke="var(--hairline)" strokeWidth="1.4">
          {rungs.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
          ))}
        </g>
        <path
          d={helixPath(Math.PI / 2, 46)}
          fill="none"
          stroke="var(--coral)"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d={helixPath(-Math.PI / 2, 46)}
          fill="none"
          stroke="var(--sage)"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.9"
        />
        {signals.map((s, i) => {
          const t = 0.82 - i * 0.15;
          const y = 14 + t * 292;
          const a = Math.sin(t * Math.PI * 2 * 2.35 + Math.PI / 2) * 46;
          return (
            <circle key={s.id} cx={110 + a} cy={y} r="4" fill="var(--amber)" />
          );
        })}
      </svg>

      {onSelectSignal && (
        <ul className="pointer-events-auto absolute bottom-10 left-1/2 flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2">
          {signals.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelectSignal(s.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-hairline bg-elevated/80 px-4 py-2.5 text-left backdrop-blur-md transition-colors hover:border-coral"
              >
                <span className="font-mono text-[10px] text-ink-soft">{s.index}</span>
                <span className="font-display text-sm font-medium">{s.name}</span>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-ink-soft">
                  {s.stream}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
