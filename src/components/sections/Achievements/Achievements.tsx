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
          eyebrow="Achievements"
          title={
            <>
              A documented record,{" "}
              <em className="not-italic text-coral">from research to clinic</em>.
            </>
          }
          lede="A documented record of our progress from research inception to active clinical deployment."
        />

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[7px] w-px bg-hairline md:left-1/2"
          />
          <ol className="space-y-10">
            {achievements.map((item, i) => (
              <li key={item.title}>
                <Reveal
                  delay={i * 0.06}
                  className={`relative pl-8 md:w-1/2 md:pl-0 ${
                    i % 2 === 0
                      ? "md:pr-12 md:text-right"
                      : "md:ml-auto md:pl-12"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute top-1.5 left-0 h-4 w-4 rounded-full border-2 border-coral bg-base md:left-auto ${
                      i % 2 === 0 ? "md:-right-2" : "md:-left-2"
                    }`}
                  />
                  <p className="font-mono text-xs font-semibold tracking-widest uppercase text-coral">
                    {item.date}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
