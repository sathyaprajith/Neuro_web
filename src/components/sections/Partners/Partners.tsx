import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { TiltCard } from "../../ui/TiltCard";
import { Magnetic } from "../../ui/Magnetic";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { partnerCategories } from "../../../data/signals";

const MARQUEE_NAMES = [
  "Total Solutions Rehabilitation Society",
  "Tapadia Diagnostics Centre",
];

export function Partners() {
  const reduced = usePrefersReducedMotion();
  const row = [...MARQUEE_NAMES, ...MARQUEE_NAMES, ...MARQUEE_NAMES, ...MARQUEE_NAMES];

  return (
    <section
      id="partners"
      aria-label="Partners and collaborators"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          align="center"
          eyebrow="03 · Strategic Partners"
          title={
            <>
              Validated in clinics,{" "}
              <em className="not-italic text-coral">not just papers</em>.
            </>
          }
          lede="Building a network of clinical and academic partnerships to validate, deploy, and scale AI-assisted psychiatric decision support across India and beyond."
        />
      </div>

      <Reveal className="mt-14">
        <div className="group relative overflow-hidden border-y border-hairline py-6">
          {reduced ? (
            <div className="flex w-full flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5">
              {MARQUEE_NAMES.map((name) => (
                <span
                  key={name}
                  className="font-display text-lg font-medium tracking-tight text-ink-soft"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex w-max animate-[marquee_30s_linear_infinite] items-center gap-14 pr-14 group-hover:[animation-play-state:paused]">
              {row.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="font-display text-lg font-medium whitespace-nowrap tracking-tight text-ink-soft"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
          {!reduced && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-base to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-base to-transparent" />
            </>
          )}
        </div>
      </Reveal>

      <div className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h3 className="text-center font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Partnership categories
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-ink-soft">
            Each partner plays a distinct role in the clinical validation and
            deployment pipeline.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {partnerCategories.map((cat, i) => (
            <Reveal key={cat.label} delay={i * 0.07} className="h-full">
              <TiltCard className="h-full" maxTilt={5}>
                <article className="flex h-full flex-col rounded-3xl border border-hairline bg-elevated p-6 shadow-card sm:p-7">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-coral">
                    {cat.label}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {cat.description}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5">
                    {cat.partners.map((p) => (
                      <li key={p.name} className="flex items-start justify-between gap-3">
                        <span className="text-sm font-medium">{p.name}</span>
                        <span className="shrink-0 font-mono text-[10px] text-ink-soft">
                          {p.location}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Interested in partnering?
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
            We are actively seeking clinical and academic collaborators to
            expand our multicenter validation network.
          </p>
          <Magnetic className="mt-6">
            <a
              href="#contact"
              className="inline-flex items-center rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white shadow-card transition-transform duration-300 hover:-translate-y-0.5"
            >
              Partner With Us
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

