import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { HeroTitle } from "./HeroTitle";
import { HelixFallback } from "./HelixFallback";
import { BRANCH_CHECKPOINTS, useHelixScrollProgress } from "./useHelixScrollProgress";
import { signals, type Signal } from "../../../data/signals";
import {
  scrollToSection,
  usePrefersReducedMotion,
} from "../../../hooks/usePrefersReducedMotion";
import { ArrowDownIcon, ArrowUpRightIcon } from "../../ui/icons";

const HelixCanvas = lazy(() => import("./HelixCanvas"));

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

type CanvasMode = "pending" | "3d" | "static";

export function Hero() {
  const storyRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress, revealedCount } = useHelixScrollProgress(storyRef);
  const [mode, setMode] = useState<CanvasMode>("pending");

  useEffect(() => {
    if (reduced || !webglAvailable()) {
      setMode("static");
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) setMode("3d");
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduced]);

  const handleSelectSignal = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent("np:open-signal", { detail: id }));
    scrollToSection(`signal-${id}`);
  }, []);

  return (
    <>
      <section
        id="home"
        aria-label="NeuroParadigm"
        className="relative flex h-svh flex-col"
      >
        <HeroTitle />
        <motion.button
          type="button"
          onClick={() => scrollToSection("research", reduced)}
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 cursor-pointer text-center"
          aria-label="Scroll to the research story"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-soft">
            Scroll — meet the helix
          </p>
          <motion.span
            className="mt-3 block text-coral"
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={
              reduced
                ? undefined
                : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <ArrowDownIcon className="mx-auto h-4 w-4" />
          </motion.span>
        </motion.button>
      </section>

      <section
        ref={storyRef}
        id="research"
        aria-label="Research story"
        className="relative h-[1080svh]"
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(52% 44% at 30% 32%, var(--glow-a), transparent 70%), radial-gradient(46% 40% at 72% 68%, var(--glow-b), transparent 70%)",
            }}
          />

          {mode === "static" && <HelixFallback onSelectSignal={handleSelectSignal} />}
          {mode === "3d" && (
            <Suspense fallback={null}>
              <motion.div
                className="absolute inset-0"
                initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ amount: 0.2 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <HelixCanvas
                  progress={scrollYProgress as MotionValue<number>}
                  reduced={reduced}
                />
              </motion.div>
            </Suspense>
          )}

          <StoryCards progress={scrollYProgress} onSelectSignal={handleSelectSignal} />

          <ProgressRail progress={scrollYProgress} />
          <StoryCounter progress={scrollYProgress} revealedCount={revealedCount} />
        </div>
      </section>
    </>
  );
}

const STREAM_STYLES: Record<string, string> = {
  Behavioral: "bg-coral-soft text-coral",
  Biological: "bg-sage-soft text-sage",
  Cognitive: "bg-amber-soft text-amber",
};

function StoryCards({
  progress,
  onSelectSignal,
}: {
  progress: MotionValue<number>;
  onSelectSignal: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {signals.map((signal, i) => (
        <StoryCard
          key={signal.id}
          signal={signal}
          side={i % 2 === 0 ? 1 : -1}
          enter={BRANCH_CHECKPOINTS[i] ?? 0.25 + i * 0.16}
          exit={
            i < BRANCH_CHECKPOINTS.length - 1
              ? (BRANCH_CHECKPOINTS[i + 1] ?? 0.9)
              : 0.94
          }
          progress={progress}
          onSelect={() => onSelectSignal(signal.id)}
        />
      ))}
    </div>
  );
}

function StoryCard({
  signal,
  side,
  enter,
  exit,
  progress,
  onSelect,
}: {
  signal: Signal;
  side: 1 | -1;
  enter: number;
  exit: number;
  progress: MotionValue<number>;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const restX = isDesktop ? side * Math.min(window.innerWidth * 0.23, 320) : 0;
  const restY = isDesktop ? (side > 0 ? -26 : 34) : 0;

  const t0 = enter - 0.02;
  const t1 = enter + 0.075;
  const t2 = exit - 0.03;
  const t3 = exit;

  const opacity = useTransform(progress, [t0, t0 + 0.04, t2, t3], [0, 1, 1, 0]);
  const scale = useTransform(progress, [t0, t1, t2, t3], [0.42, 1, 1, 0.88]);
  const x = useTransform(progress, [t0, t1, t2, t3], [0, restX, restX, 0]);
  const y = useTransform(
    progress,
    [t0, t1, t2, t3],
    [restY + 48, restY, restY, restY + 34],
  );

  useMotionValueEvent(opacity, "change", (v) => {
    if (cardRef.current) {
      cardRef.current.style.pointerEvents = v > 0.5 ? "auto" : "none";
    }
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center px-5">
      <motion.div
        ref={cardRef}
        style={{
          opacity,
          scale,
          x,
          y,
          transformOrigin: side > 0 ? "left center" : "right center",
        }}
        className="w-[min(90vw,400px)] will-change-transform"
      >
        <button
          type="button"
          onClick={onSelect}
          aria-label={`Read about ${signal.name} — full details below`}
          className="w-full cursor-pointer rounded-[2rem] border border-hairline bg-elevated/90 p-6 text-left shadow-card backdrop-blur-xl transition-colors duration-300 hover:border-coral sm:p-7"
        >
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-medium tracking-widest text-coral">
              {signal.index}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] ${STREAM_STYLES[signal.stream]}`}
            >
              {signal.stream}
            </span>
          </div>
          <p className="mt-4 font-display text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
            {signal.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
            {signal.short}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-mono text-[10px] font-medium tracking-[0.2em] text-coral uppercase transition-colors duration-300 group-hover:border-coral">
            Explore this signal
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </span>
        </button>
      </motion.div>
    </div>
  );
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      aria-hidden
      className="absolute top-1/2 right-6 z-10 hidden h-40 w-px -translate-y-1/2 bg-hairline md:block"
    >
      <motion.div
        className="h-full w-full origin-top bg-coral"
        style={{ scaleY: progress }}
      />
    </div>
  );
}

function StoryCounter({
  revealedCount,
}: {
  progress: MotionValue<number>;
  revealedCount: number;
}) {
  return (
    <div
      aria-live="polite"
      className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase text-ink-soft sm:left-8 sm:translate-x-0"
    >
      {revealedCount > 0 ? `Signal ${String(revealedCount).padStart(2, "0")} / 05` : "Five research threads"}
    </div>
  );
}
