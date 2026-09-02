import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { FOUNDER, HEAD } from "../../../data/team";
import { CinematicIntro } from "./CinematicIntro";
import { MembersGrid } from "./MembersGrid";
import { TeamClosing } from "./TeamClosing";
import { TeamMemberCard } from "./TeamMemberCard";

/**
 * Static (reduced-motion) variant of the leadership intro: same hierarchy,
 * same cards — no pinned scroll choreography.
 */
function LeadershipStatic() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
      <SectionHeader
        align="center"
        id="team-title"
        eyebrow="05 · The People"
        title={
          <>
            The minds behind{" "}
            <em className="not-italic text-coral">Neuro Paradigm</em>.
          </>
        }
        lede="One founder's question became a structure — and the structure became twenty minds working where neuroscience meets software."
      />
      <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center justify-center gap-8 sm:flex-row sm:items-stretch sm:gap-0">
        <Reveal className="w-full max-w-[300px] sm:mx-0 sm:w-auto sm:flex-1">
          <TeamMemberCard member={FOUNDER} variant="leader" badge="Founder" accent="--coral" eager />
        </Reveal>
        <div
          aria-hidden
          className="hidden h-px w-16 self-center bg-gradient-to-r from-coral to-sage sm:block"
        />
        <Reveal delay={0.08} className="w-full max-w-[300px] sm:mx-0 sm:w-auto sm:flex-1">
          <TeamMemberCard member={HEAD} variant="leader" badge="Head" accent="--sage" />
        </Reveal>
      </div>
    </div>
  );
}

export function Team() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="team" aria-label="Meet the team" aria-labelledby="team-title" className="relative">
      {/* Soft blend in from the Gallery's sunken background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-sunken to-transparent"
      />

      {/* Non-visual summary of the hierarchy for assistive tech */}
      <p className="sr-only">
        Neuro Paradigm is led by a founder and a head of team, supported by
        eighteen team members across machine learning, clinical research,
        engineering, and operations. Each profile links to LinkedIn and GitHub.
      </p>

      {reduced ? <LeadershipStatic /> : <CinematicIntro />}

      <div className="pt-16 sm:pt-24">
        <MembersGrid />
      </div>

      <TeamClosing />
    </section>
  );
}
