import type { ReactNode } from "react";
import { motion } from "framer-motion";
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

  return (
    <Reveal
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}
    >
      <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-coral">
        {eyebrow}
      </p>
      <div className="mt-4 overflow-hidden">
        <motion.h2
          id={id}
          className="font-display text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl"
          initial={reduced ? false : { y: "112%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>
      </div>
      {lede ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {lede}
        </p>
      ) : null}
      <div
        aria-hidden
        className="mt-8 h-px w-16 bg-gradient-to-r from-coral to-transparent"
      />
    </Reveal>
  );
}
