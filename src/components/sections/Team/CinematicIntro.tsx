import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { SectionHeader } from "../../ui/SectionHeader";
import { TeamMemberCard } from "./TeamMemberCard";
import { FOUNDER, HEAD } from "../../../data/team";

/**
 * A pinned, scroll-choreographed intro:
 *   Act 01 — the section title gives way to the FOUNDER, who materializes
 *            out of blur and depth at center stage.
 *   Act 02 — the HEAD emerges on the other side; a luminous line is drawn
 *            between them (a "synapse" between leadership).
 *   Act 03 — both recede upward as the stage hands off to the collective grid.
 *
 * Scroll-linked transforms only (transform/opacity/filter) for performance.
 */
export function CinematicIntro() {
  const stageRef = useRef<HTMLDivElement>(null);
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

  // Viewport-derived rest positions (recomputed when isDesktop flips).
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  // Desktop: duo sits side by side. Mobile: a fanned vertical stack.
  // Card width is clamped by viewport HEIGHT too (52vh/60vh) so the tall
  // 4:5 portrait + info always fits inside the pinned stage.
  const sideX = isDesktop ? Math.min(vw * 0.26, 400) : 0;
  const cardW = isDesktop
    ? "w-[min(42vw,52vh,560px)]"
    : "w-[min(76vw,60vh,300px)]";
  const founderLift = isDesktop ? 0 : -Math.min(vh * 0.09, 64);
  const headDrop = isDesktop ? 0 : Math.min(vh * 0.1, 72);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  // The duo stays sharp until the final ~110px of stage scroll, then blurs
  // away and hands off to the members grid.
  const [endFade, setEndFade] = useState(0.04);

  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (!el) return;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel > 0) setEndFade(Math.min(0.08, 110 / travel));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const hold = 1 - endFade; // last moment the cards are fully sharp
  const pre = 1 - endFade * 2; // caption crossfade into "the collective"

  // Timeline (fractions of stage travel — stage is tall, so each act gets
  // roughly a viewport of scroll):
  //   0.02–0.06  header dissolves
  //   0.05–0.13  founder materializes
  //   0.13–0.32  FOUNDER SOLO HOLD (~1 viewport of scroll to study the card)
  //   0.32–0.52  founder slides aside, head emerges, synapse draws
  //   0.52–hold  DUO HOLD — fully sharp, no fading (~1 viewport of scroll)
  //   hold–1.00  final ~110px: cards blur away, "the collective" caption
  //              arrives, stage releases into the members grid

  // ── Header (act 01 prelude) — fully gone before the founder arrives ───────
  const headerOpacity = useTransform(scrollYProgress, [0.02, 0.06], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0.02, 0.06], [0, -130]);
  const headerScale = useTransform(scrollYProgress, [0.02, 0.06], [1, 0.94]);
  const headerBlur = useTransform(scrollYProgress, [0.02, 0.06], ["blur(0px)", "blur(12px)"]);

  // ── Orbit rings behind the founder ────────────────────────────────────────
  const ringsOpacity = useTransform(scrollYProgress, [0.05, 0.14, hold, 1], [0, 1, 1, 0]);
  const ringsScale = useTransform(scrollYProgress, [0.05, 0.24], [0.72, 1]);

  // ── Founder ────────────────────────────────────────────────────────────────
  const founderY = useTransform(
    scrollYProgress,
    [0.05, 0.14, 0.32, 0.44, hold, 1],
    [140, 0, founderLift, founderLift, founderLift, founderLift - 70],
  );
  const founderX = useTransform(scrollYProgress, [0.32, 0.42], [0, -sideX]);
  const founderOpacity = useTransform(scrollYProgress, [0.05, 0.13, hold, 1], [0, 1, 1, 0]);
  const founderScale = useTransform(scrollYProgress, [0.05, 0.16, hold, 1], [0.58, 1, 1, 0.9]);
  const founderBlur = useTransform(
    scrollYProgress,
    [0.05, 0.15, hold, 1],
    ["blur(18px)", "blur(0px)", "blur(0px)", "blur(16px)"],
  );
  const founderRotX = useTransform(scrollYProgress, [0.05, 0.16], [10, 0]);

  // ── Head ───────────────────────────────────────────────────────────────────
  const headY = useTransform(
    scrollYProgress,
    [0.38, 0.5, hold, 1],
    [headDrop + 130, headDrop, headDrop, headDrop - 80],
  );
  const headX = useTransform(scrollYProgress, [0.38, 0.5], [sideX + 70, sideX]);
  const headOpacity = useTransform(scrollYProgress, [0.38, 0.48, hold, 1], [0, 1, 1, 0]);
  const headScale = useTransform(scrollYProgress, [0.38, 0.52, hold, 1], [0.6, 0.93, 0.93, 0.86]);
  const headBlur = useTransform(
    scrollYProgress,
    [0.38, 0.52, hold, 1],
    ["blur(16px)", "blur(0px)", "blur(0px)", "blur(16px)"],
  );
  const headRotX = useTransform(scrollYProgress, [0.38, 0.52], [12, 0]);
  const headRotZ = useTransform(scrollYProgress, [0.38, 0.52], [-6, isDesktop ? 0 : -2]);

  // ── Connector line ("synapse") ─────────────────────────────────────────────
  const lineOpacity = useTransform(scrollYProgress, [0.46, 0.54, hold, 1], [0, 1, 1, 0]);
  const lineDraw = useTransform(scrollYProgress, [0.46, 0.6], [0, 1]);

  // ── Act captions ───────────────────────────────────────────────────────────
  const capAOpacity = useTransform(scrollYProgress, [0.06, 0.12, 0.3, 0.36], [0, 1, 1, 0]);
  const capBOpacity = useTransform(scrollYProgress, [0.4, 0.46, pre, hold], [0, 1, 1, 0]);
  const capCOpacity = useTransform(scrollYProgress, [pre, hold], [0, 1]);

  // Only let the cursor reach the leader cards while they are visible.
  const founderLayerRef = useRef<HTMLDivElement>(null);
  const headLayerRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(founderOpacity, "change", (v) => {
    if (founderLayerRef.current) {
      founderLayerRef.current.style.pointerEvents = v > 0.5 ? "auto" : "none";
    }
  });
  useMotionValueEvent(headOpacity, "change", (v) => {
    if (headLayerRef.current) {
      headLayerRef.current.style.pointerEvents = v > 0.5 ? "auto" : "none";
    }
  });

  return (
    <div ref={stageRef} className="relative h-[380svh] md:h-[460svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* Ambient brand glows */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(52% 44% at 32% 34%, var(--glow-a), transparent 70%), radial-gradient(46% 40% at 70% 66%, var(--glow-b), transparent 70%)",
          }}
        />

        {/* Orbit rings — the "entry point" halo */}
        <motion.div
          aria-hidden
          className="absolute inset-0 grid place-items-center"
          style={{ opacity: ringsOpacity, scale: ringsScale }}
        >
          <motion.svg
            viewBox="0 0 100 100"
            fill="none"
            className="h-[135vmin] w-[135vmin] text-coral"
            animate={{ rotate: 360 }}
            transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="50" cy="50" r="47" stroke="currentColor" strokeOpacity="0.32" strokeWidth="0.14" strokeDasharray="0.4 2.4" />
            <circle cx="50" cy="50" r="36" className="text-sage" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.14" strokeDasharray="0.3 1.9" />
          </motion.svg>
        </motion.div>

        {/* Synapse line between founder and head (desktop duo layout) */}
        {isDesktop ? (
          <motion.div aria-hidden className="absolute inset-0 z-10 grid place-items-center" style={{ opacity: lineOpacity }}>
            <motion.span
              className="block h-px w-[min(24vw,320px)] rounded-full bg-gradient-to-r from-coral via-plum to-sage shadow-[0_0_18px_var(--glow-a)]"
              style={{ scaleX: lineDraw }}
            />
          </motion.div>
        ) : null}

        {/* Header — dissolves before the founder materializes (kept below cards) */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5"
          style={{ opacity: headerOpacity, y: headerY, scale: headerScale, filter: headerBlur }}
        >
          <SectionHeader
            align="center"
            id="team-title"
            eyebrow="05 · The People"
            title={
              <>
                The minds behind{" "}
                <em className="not-italic text-coral">Neuro Paradigm</em>.
              </>
            }
            lede="One founder's question became a structure — and the structure became twenty minds working where neuroscience meets software."
          />
        </motion.div>

        {/* Founder */}
        <div
          ref={founderLayerRef}
          className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
        >
          <motion.div className={cardW} style={{ y: founderY, x: founderX }}>
            <motion.div
              style={{
                opacity: founderOpacity,
                scale: founderScale,
                filter: founderBlur,
                rotateX: founderRotX,
                transformPerspective: 1000,
              }}
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <TeamMemberCard member={FOUNDER} variant="leader" badge="Founder" accent="--coral" eager />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Head */}
        <div
          ref={headLayerRef}
          className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
        >
          <motion.div className={cardW} style={{ y: headY, x: headX }}>
            <motion.div
              style={{
                opacity: headOpacity,
                scale: headScale,
                filter: headBlur,
                rotateX: headRotX,
                rotateZ: headRotZ,
                transformPerspective: 1000,
              }}
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                <TeamMemberCard member={HEAD} variant="leader" badge="Head" accent="--sage" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Act captions */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-8 z-30 grid place-items-center px-5">
          <div className="relative h-4 text-center font-mono text-[10px] tracking-[0.3em] uppercase text-ink-soft">
            <motion.span className="absolute inset-0 whitespace-nowrap" style={{ opacity: capAOpacity }}>
              Act 01 · Origin
            </motion.span>
            <motion.span className="absolute inset-0 whitespace-nowrap" style={{ opacity: capBOpacity }}>
              Act 02 · Structure
            </motion.span>
            <motion.span className="absolute inset-0 whitespace-nowrap" style={{ opacity: capCOpacity }}>
              Act 03 · The Collective ↓
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
