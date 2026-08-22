import {
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface WordRevealProps {
  text: string;
  className?: string;
}

export function WordReveal({ text, className }: WordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.5"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          word={word}
          reduced={reduced}
        />
      ))}
    </p>
  );
}

function Word({
  progress,
  range,
  word,
  reduced,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  word: string;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, reduced ? [1, 1] : [0.13, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.27em] inline-block">
      {word}
    </motion.span>
  );
}
