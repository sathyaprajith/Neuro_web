import { TiltCard } from "../../ui/TiltCard";
import { GitHubIcon, LinkedInIcon } from "../../ui/icons";
import { cn } from "../../ui/cn";
import { Avatar } from "./Avatar";
import type { TeamMember } from "../../../data/team";

export type TeamAccent = "--coral" | "--sage" | "--amber" | "--deep-plum";

const ACCENT_POOL: TeamAccent[] = ["--coral", "--sage", "--amber", "--deep-plum"];

/** Deterministic accent per member so the grid feels varied but stable. */
export function accentFor(id: string): TeamAccent {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ACCENT_POOL[Math.abs(hash) % ACCENT_POOL.length];
}

interface TeamMemberCardProps {
  member: TeamMember;
  /** "leader" = founder/head emphasis, "member" = compact grid tile. */
  variant?: "leader" | "member";
  /** Small chip over the portrait, e.g. "Founder". */
  badge?: string;
  accent?: TeamAccent;
  className?: string;
  eager?: boolean;
}

function SocialChip({
  href,
  label,
  large,
  children,
}: {
  href: string;
  label: string;
  large?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "grid place-items-center rounded-full border border-hairline bg-glass text-ink-soft backdrop-blur-md transition-colors duration-300 hover:border-coral hover:text-coral",
        large ? "h-12 w-12" : "h-11 w-11",
      )}
    >
      {children}
    </a>
  );
}

export function TeamMemberCard({
  member,
  variant = "member",
  badge,
  accent,
  className,
  eager = false,
}: TeamMemberCardProps) {
  const leader = variant === "leader";
  const tone: TeamAccent = accent ?? accentFor(member.id);

  return (
    <TiltCard className={cn("h-full", className)} maxTilt={leader ? 4.5 : 8}>
      <article
        aria-label={`${member.name}, ${member.role}`}
        className={cn(
          "group relative h-full overflow-hidden rounded-[1.75rem] border border-hairline bg-elevated shadow-card",
          leader && "rounded-[2rem]",
        )}
      >
        {/* Accent halo on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow:
              `inset 0 0 0 1px color-mix(in srgb, var(${tone}) 55%, transparent), ` +
              `0 22px 60px -24px color-mix(in srgb, var(${tone}) 60%, transparent)`,
          }}
        />

        {/* Portrait */}
        <div className={cn("relative overflow-hidden", leader ? "aspect-[4/5]" : "aspect-[4/5]")}>
          <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
            <Avatar name={member.name} image={member.image} accent={tone} eager={eager} className={leader ? "text-7xl sm:text-8xl" : "text-5xl"} />
          </div>

          {/* Scrim so chips + badge stay legible over photos */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-elevated/85 via-elevated/25 to-transparent"
          />

          {badge ? (
            <span
              className="absolute left-3 top-3 z-10 rounded-full border border-hairline bg-glass px-3 py-1 font-mono text-[10px] font-medium tracking-[0.24em] uppercase backdrop-blur-md"
              style={{ color: `var(${tone})` }}
            >
              {badge}
            </span>
          ) : null}

          {/* Social rail — always visible on touch, revealed on hover/focus on desktop */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 flex gap-2 p-3 transition-all duration-300",
              leader ? "justify-start p-5" : "justify-end p-3",
              "md:pointer-events-none md:translate-y-2 md:opacity-0",
              "md:group-focus-within:pointer-events-auto md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100",
              "md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100",
            )}
          >
            <SocialChip href={member.linkedin} label={`${member.name} on LinkedIn`} large={leader}>
              <LinkedInIcon className="h-5 w-5" />
            </SocialChip>
            <SocialChip href={member.github} label={`${member.name} on GitHub`} large={leader}>
              <GitHubIcon className="h-5 w-5" />
            </SocialChip>
          </div>
        </div>

        {/* Name + role */}
        <div className={cn("relative", leader ? "p-6 sm:p-8" : "p-5")}>
          <h3
            className={cn(
              "truncate font-display font-medium tracking-tight",
              leader ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
            )}
          >
            {member.name}
          </h3>
          <p
            className={cn(
              "mt-1.5 truncate font-mono uppercase tracking-[0.18em] text-ink-soft",
              leader ? "text-sm" : "text-[11px] sm:text-xs",
            )}
          >
            {member.role}
          </p>
        </div>
      </article>
    </TiltCard>
  );
}
