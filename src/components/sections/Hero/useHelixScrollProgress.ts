import { useState, type RefObject } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

export const BRANCH_CHECKPOINTS = [0.19, 0.34, 0.49, 0.64, 0.79] as const;

export function useHelixScrollProgress(target: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  const [revealedCount, setRevealedCount] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let count = 0;
    for (const cp of BRANCH_CHECKPOINTS) {
      if (v >= cp) count += 1;
    }
    setRevealedCount((prev) => (prev === count ? prev : count));
  });

  return { scrollYProgress, revealedCount };
}
