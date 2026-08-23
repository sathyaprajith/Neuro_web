import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "./cn";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  id?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  id,
}: SectionHeaderProps) {
  const reduced = usePrefersReducedMotion();
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleWrapRef, {
    once: true,
    margin: "0px 0px -40px 0px",
  });
  const shown = inView || reduced;

  return (
    <Reveal
      className={cn("max-w-5xl", align === "center" && "mx-auto text-center")}
    >
      <p className="font-mono text-sm tracking-[0.28em] uppercase text-coral">
        {eyebrow}
      </p>
      <div ref={titleWrapRef} className="mt-3 overflow-hidden">
        <motion.h2
          id={id}
          className="font-display text-[clamp(2.8rem,7vw,6rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance"
          initial={reduced ? { y: 0 } : { y: "110%" }}
          animate={shown ? { y: 0 } : { y: "110%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>
      </div>
      {lede ? (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
          {lede}
        </p>
      ) : null}
      <div
        aria-hidden
        className="mt-6 h-px w-16 bg-gradient-to-r from-coral to-transparent"
      />
    </Reveal>
  );
}
