import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

const WORD = "NEURO PARADIGM".split("");

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.038,
      delayChildren: 2.0,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroTitle() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
      <h1 className="sr-only">Neuro Paradigm</h1>
      <motion.p
        aria-hidden
        className="font-display text-[clamp(2.6rem,9vw,7.5rem)] leading-[1.02] font-medium tracking-[-0.02em]"
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="visible"
      >
        {WORD.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            variants={letter}
            className="inline-block will-change-transform"
          >
            {char}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}

