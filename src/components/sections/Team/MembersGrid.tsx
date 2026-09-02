import { motion } from "framer-motion";
import { Reveal } from "../../ui/Reveal";
import { cn } from "../../ui/cn";
import { TeamMemberCard } from "./TeamMemberCard";
import { TEAM_MEMBERS } from "../../../data/team";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

// Entrance direction cycles left → below → right, so cards arrive from
// different sides of the frame instead of one uniform wall.
const ENTER_FROM = [
  { x: -56, y: 0 },
  { x: 0, y: 56 },
  { x: 56, y: 0 },
];

// Editorial stagger: middle column sits lower, third lower still — a
// descending diagonal that turns the grid into a cascade.
const SM_OFFSETS = ["sm:mt-0", "sm:mt-16"];
const LG_OFFSETS = ["lg:mt-0", "lg:mt-24", "lg:mt-48"];

// Alternating horizontal drift per row keeps columns from aligning
// perfectly edge-to-edge (organic, not random).
const LG_DRIFT = [
  ["lg:pr-10", "lg:px-8", "lg:pl-10"],
  ["lg:pl-6", "lg:px-0", "lg:pr-6"],
];

/**
 * The 18 team members as a visual journey: three large columns with
 * vertical stagger and horizontal drift. Cards surface from alternating
 * directions as they scroll into view.
 */
export function MembersGrid() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <h3 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
            The collective<span className="text-coral">.</span>
          </h3>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="font-mono text-xs tracking-[0.26em] uppercase text-ink-soft">
            18 specialists · placed, not packed
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.12}>
        <div
          aria-hidden
          className="mt-8 h-px bg-gradient-to-r from-coral/50 via-hairline to-transparent"
        />
      </Reveal>

      <ul
        aria-label="Team members"
        className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:mt-16 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-20 lg:grid-cols-3 lg:gap-y-24"
      >
        {TEAM_MEMBERS.map((member, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const dir = ENTER_FROM[i % 3];

          return (
            <motion.li
              key={member.id}
              initial={reduced ? false : { opacity: 0, x: dir.x, y: dir.y, scale: 0.92 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
              transition={{
                duration: 0.85,
                delay: (i % 3) * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "mx-auto w-full max-w-[26rem] will-change-transform sm:max-w-none",
                SM_OFFSETS[i % 2],
                LG_OFFSETS[col],
                LG_DRIFT[row % 2][col],
              )}
            >
              <TeamMemberCard member={member} />
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
