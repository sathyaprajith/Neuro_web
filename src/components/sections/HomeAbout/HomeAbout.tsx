import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { MissionNarrative } from "./MissionNarrative";
import { BrainVideo } from "./BrainVideo";
import { SignalDetails } from "./SignalDetails";

export function HomeAbout() {
  return (
    <section
      id="about"
      aria-label="About NeuroParadigm"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeader
        eyebrow="Mission"
        title={
          <>
            Understanding, assembled{" "}
            <em className="not-italic text-coral">piece by piece</em>.
          </>
        }
        lede="One core method — multi-modal signal fusion — grows into a family of clinical signals. The way our helix branches is the way our research works."
      />

      <Reveal className="mt-14" delay={0.05}>
        <MissionNarrative />
      </Reveal>

      <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <Reveal>
          <h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Many weak signals. One strong picture.
          </h3>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            No single stream tells the story. A sleep record alone is
            ambiguous; so is a gaze pattern or an HRV trace. Fused — and
            honestly weighted — they begin to separate conditions that look
            identical in a 50-minute consult.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            The visualization here is a prototype sketch of that fusion: five
            streams converging into one connected graph, the way our platform
            assembles evidence before it ever reaches a clinician's screen.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <BrainVideo />
        </Reveal>
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-coral">
            Research outputs
          </p>
          <h3 className="mt-4 max-w-2xl font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            Five signal families, reported with their confidence attached.
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Each branch on the helix above corresponds to one of these. Numbers
            are cohort-level estimates — not promises about any individual.
          </p>
        </Reveal>
        <Reveal className="mt-10" delay={0.06}>
          <SignalDetails />
        </Reveal>
      </div>
    </section>
  );
}
