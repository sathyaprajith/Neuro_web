import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Edge {
  a: number;
  b: number;
  pulse: number;
  speed: number;
}

export function BrainVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let nodes: Node[] = [];
    let edges: Edge[] = [];

    const seed = () => {
      const count = Math.max(26, Math.min(46, Math.floor(width / 22)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 1.4 + Math.random() * 2.2,
      }));
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const candidates = nodes
          .map((n, j) => ({ j, d: (n.x - nodes[i]!.x) ** 2 + (n.y - nodes[i]!.y) ** 2 }))
          .filter(({ j }) => j !== i)
          .sort((p, q) => p.d - q.d)
          .slice(0, 2 + (i % 2));
        for (const { j } of candidates) {
          if (!edges.some((e) => (e.a === j && e.b === i) || (e.a === i && e.b === j))) {
            edges.push({ a: i, b: j, pulse: Math.random(), speed: 0.004 + Math.random() * 0.007 });
          }
        }
      }
    };

    const coral = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--coral").trim() || "#e8674a";
    const sage = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--sage").trim() || "#5c8374";
    const inkSoft = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--ink-secondary").trim() || "#6b5d56";

    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible.current) return;

      ctx.clearRect(0, 0, width, height);
      const cCoral = coral();
      const cSage = sage();
      const cInk = inkSoft();

      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -8 || n.x > width + 8) n.vx *= -1;
          if (n.y < -8 || n.y > height + 8) n.vy *= -1;
        }
      }

      for (const e of edges) {
        const a = nodes[e.a]!;
        const b = nodes[e.b]!;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > Math.min(width, height) * 0.42) continue;
        e.pulse = (e.pulse + (reduced ? 0 : e.speed)) % 1;
        ctx.strokeStyle = cInk;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        const px = a.x + (b.x - a.x) * e.pulse;
        const py = a.y + (b.y - a.y) * e.pulse;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = e.a % 2 === 0 ? cCoral : cSage;
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const n of nodes) {
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = cInk;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { rootMargin: "80px" },
    );
    observer.observe(wrap);
    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-hairline bg-elevated shadow-card"
      role="img"
      aria-label="Animated visualization of signal streams fusing into one connected network"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/25 to-transparent p-5">
        <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/90">
          Live signal-fusion sketch · prototype reel
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-white/90">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
          Streaming
        </span>
      </div>
    </div>
  );
}
