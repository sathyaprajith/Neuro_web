import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { MissionNarrative } from "./MissionNarrative";
import { BrainVideo } from "./BrainVideo";
import { SignalDetails } from "./SignalDetails";

export function HomeAbout() {
  return (
    <section
      id="about"
      aria-label="About Neuro Paradigm"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeader
        eyebrow="01 · About Us"
        title={
          <>
            Three signal layers,{" "}
            <em className="not-italic text-coral">one clinical picture</em>.
          </>
        }
        lede="A multi-modal AI platform that fuses structured clinical signals across three complementary dimensions of neuropsychiatric evaluation — Behavioral, Biological, and Cognitive."
      />

      <div className="mt-16">
        <MissionNarrative />
      </div>

      <div className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
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
            The visualization here is a prototype sketch of that fusion:
            multiple streams converging into one connected graph, the way our
            platform assembles evidence before it ever reaches a clinician's
            screen.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <BrainVideo />
        </Reveal>
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-coral">
            Signal layers
          </p>
          <h3 className="mt-4 max-w-2xl font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            Five research streams, one fused platform.
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Each branch on the helix above corresponds to one of these. Every
            modality is grounded in peer-reviewed research and validated on
            annotated clinical cohorts.
          </p>
        </Reveal>
        <Reveal className="mt-10" delay={0.06}>
          <SignalDetails />
        </Reveal>
      </div>
    </section>
  );
}

