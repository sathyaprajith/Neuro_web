import type { ReactNode } from "react";
import { cn } from "./cn";
import { Reveal } from "./Reveal";

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
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-coral">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-4 font-display text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl"
      >
        {title}
      </h2>
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
