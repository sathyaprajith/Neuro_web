import { impactStats, missionQuote, philosophy } from "../../../data/signals";
import { Reveal } from "../../ui/Reveal";
import { WordReveal } from "../../ui/WordReveal";
import { TiltCard } from "../../ui/TiltCard";

export function MissionNarrative() {
  return (
    <div className="space-y-10">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-snug font-medium tracking-tight">
            Instrumented intelligence{" "}
            <span className="text-coral">for psychiatry.</span>
          </p>
          <WordReveal
            className="mt-7 text-base leading-relaxed text-ink"
            text="Neuro Paradigm is an AI-assisted clinical decision support platform for psychiatry and neurodevelopmental care. We fuse structured clinical signals across Behavioral, Biological, and Cognitive dimensions — built to augment specialist-led evaluation, never to replace it."
          />
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            Neuropsychiatric disorders represent one of the largest unmet
            clinical challenges globally. The tools haven't kept pace with the
            burden. Our answer is rigorous, transparent signal science that
            clinicians can interrogate — and trust enough to act on.
          </p>
        </div>

        <figure className="lg:pt-10">
          <blockquote className="border-l-2 border-coral pl-6 font-display text-lg italic leading-relaxed text-ink sm:text-xl">
            <WordReveal text={missionQuote} />
          </blockquote>
        </figure>
      </div>

      <div>
        <Reveal>
          <h3 className="text-center font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight">
            The scale of the problem
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-ink-soft">
            The numbers behind why this work matters.
          </p>
        </Reveal>
        <dl className="mt-8 grid grid-cols-1 border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-hairline">
          {impactStats.map((stat, i) => (
            <Reveal
              key={stat.value}
              delay={i * 0.08}
              className={`px-7 py-12 ${i > 0 ? "border-t border-hairline sm:border-t-0" : ""}`}
            >
              <span aria-hidden className="mb-5 block h-2 w-2 bg-coral" />
              <dd className="font-display text-6xl font-medium tracking-tight tabular-nums sm:text-7xl">
                {stat.value}
              </dd>
              <dt className="mt-4 text-sm leading-snug font-medium">{stat.label}</dt>
              <p className="mt-2 font-mono text-xs tracking-[0.18em] uppercase text-ink-soft">
                {stat.sublabel}
              </p>
            </Reveal>
          ))}
        </dl>
      </div>

      <div>
        <Reveal>
          <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight">
            Our philosophy
          </h3>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {philosophy.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07} className="h-full">
              <TiltCard className="h-full">
                <article className="h-full rounded-3xl border border-hairline bg-elevated p-6 shadow-card transition-colors duration-300 hover:border-coral/40 sm:p-7">
                  <h4 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {item.desc}
                  </p>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

