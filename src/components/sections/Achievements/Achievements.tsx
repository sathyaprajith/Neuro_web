import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { achievements } from "../../../data/signals";

export function Achievements() {
  return (
    <section
      id="achievements"
      aria-label="Achievements"
      className="relative bg-sunken py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="02 · Achievements"
          title={
            <>
              A documented record,{" "}
              <em className="not-italic text-coral">from research to clinic</em>.
            </>
          }
          lede="A documented record of our progress from research inception to active clinical deployment."
        />

        <ol className="mt-16 border-t border-hairline">
          {achievements.map((item) => (
            <li
              key={item.title}
              className="group grid gap-5 border-b border-hairline py-12 md:grid-cols-[240px_1fr] md:gap-14 md:py-16"
            >
              <Reveal>
                <p className="ach-year font-display text-6xl font-medium leading-none tracking-tight transition-transform duration-500 group-hover:-translate-y-1 md:text-8xl">
                  {item.date}
                </p>
                <p className="mt-3 font-mono text-[10px] tracking-[0.28em] uppercase text-coral md:mt-4">
                  Milestone
                </p>
              </Reveal>
              <Reveal delay={0.08} className="md:pt-2">
                <h3 className="max-w-2xl font-display text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-[15px]">
                  {item.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
