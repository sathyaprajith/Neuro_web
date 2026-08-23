import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Logo } from "./Logo";

const WORD = "NEURO PARADIGM".split("");

export function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (
      reduced ||
      new URLSearchParams(window.location.search).has("noloader")
    ) {
      setDone(true);
      return;
    }
    const timer = window.setTimeout(() => setDone(true), 1900);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-base"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="sr-only">Neuro Paradigm</p>
          <motion.div
            aria-hidden
            initial={reduced ? false : { scale: 0.6, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo className="mb-5 h-16 w-auto" />
          </motion.div>
          <div className="flex overflow-hidden px-4" aria-hidden>
            {WORD.map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block font-display text-[clamp(1.6rem,5.5vw,3.6rem)] font-medium tracking-[-0.02em] will-change-transform"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.25 + i * 0.032,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
          <motion.div
            aria-hidden
            className="mt-5 h-px w-40 origin-left bg-gradient-to-r from-coral via-amber to-sage sm:w-56"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.p
            aria-hidden
            className="mt-4 font-mono text-[9px] tracking-[0.34em] uppercase text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
          >
            Bridging Neuroscience &amp; Clinical Intelligence
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

