import { impactStats, missionQuote, philosophy } from "../../../data/signals";
import { Reveal } from "../../ui/Reveal";

export function MissionNarrative() {
  return (
    <div className="space-y-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="font-display text-2xl leading-snug font-medium tracking-tight sm:text-[2rem]">
            Instrumented intelligence{" "}
            <span className="text-coral">for psychiatry.</span>
          </p>
          <p className="mt-7 text-base leading-relaxed text-ink-soft">
            Neuro Paradigm is an AI-assisted clinical decision support platform
            for psychiatry and neurodevelopmental care. We fuse structured
            clinical signals across Behavioral, Biological, and Cognitive
            dimensions — built to augment specialist-led evaluation, never to
            replace it.
          </p>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            Neuropsychiatric disorders represent one of the largest unmet
            clinical challenges globally. The tools haven't kept pace with the
            burden. Our answer is rigorous, transparent signal science that
            clinicians can interrogate — and trust enough to act on.
          </p>
        </div>

        <figure className="lg:pt-10">
          <blockquote className="border-l-2 border-coral pl-6 font-display text-lg italic leading-relaxed text-ink sm:text-xl">
            “{missionQuote}”
          </blockquote>
        </figure>
      </div>

      <div>
        <Reveal>
          <h3 className="text-center font-display text-3xl font-medium tracking-tight sm:text-4xl">
            The scale of the problem
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-ink-soft">
            The numbers behind why this work matters.
          </p>
        </Reveal>
        <dl className="mt-12 grid gap-10 sm:grid-cols-3">
          {impactStats.map((stat) => (
            <Reveal key={stat.value} className="text-center">
              <dd className="font-display text-5xl font-medium text-coral">
                {stat.value}
              </dd>
              <dt className="mt-3 text-sm font-medium">{stat.label}</dt>
              <p className="mt-1 font-mono text-[11px] text-ink-soft">
                {stat.sublabel}
              </p>
            </Reveal>
          ))}
        </dl>
      </div>

      <div>
        <Reveal>
          <h3 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Our philosophy
          </h3>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {philosophy.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <article className="h-full rounded-3xl border border-hairline bg-elevated p-6 shadow-card transition-colors duration-300 hover:border-coral/40 sm:p-7">
                <h4 className="font-display text-lg font-semibold tracking-tight">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {item.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
