import { WordReveal } from "./WordReveal";
import { Reveal } from "./Reveal";

interface StatementBandProps {
  eyebrow: string;
  statement: string;
}

export function StatementBand({ eyebrow, statement }: StatementBandProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 60% at 50% 50%, var(--glow-a), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-5 py-28 text-center sm:px-8 sm:py-44">
        <Reveal>
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-coral">
            {eyebrow}
          </p>
        </Reveal>
        <WordReveal
          className="mt-8 font-display text-[clamp(2.3rem,6.5vw,5.6rem)] leading-[1.04] font-medium tracking-[-0.02em] text-balance"
          text={statement}
        />
        <Reveal delay={0.15}>
          <div
            aria-hidden
            className="mx-auto mt-12 h-px w-24 bg-gradient-to-r from-transparent via-coral to-transparent"
          />
        </Reveal>
      </div>
    </section>
  );
}

