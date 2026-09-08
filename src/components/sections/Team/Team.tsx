import { CinematicIntro } from "./CinematicIntro";
import { MembersGrid } from "./MembersGrid";

export function Team() {
  return (
    <section id="team" aria-label="Meet the team" aria-labelledby="team-title" className="relative">
      {/* Soft blend in from the Gallery's sunken background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-sunken to-transparent"
      />

      {/* Non-visual summary of the hierarchy for assistive tech */}
      <p className="sr-only">
        Neuro Paradigm is led by a founder and head, followed by a student team.
        Profile links are shown only when provided in the team source data.
      </p>

      <CinematicIntro />

      <div className="pt-16 sm:pt-24">
        <MembersGrid />
      </div>
    </section>
  );
}
