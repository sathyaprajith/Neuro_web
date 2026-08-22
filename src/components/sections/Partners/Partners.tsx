import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

const PARTNERS = [
  { name: "Meridian Children's Health", type: "Clinical network" },
  { name: "Alder Research Alliance", type: "Academic consortium" },
  { name: "Northgate Clinic Network", type: "Psychiatry group" },
  { name: "Veritas University Lab", type: "Computational neuroscience" },
  { name: "Bluepine Data Trust", type: "Data governance" },
  { name: "Cascade Neuro Institute", type: "Neurodevelopment" },
  { name: "Harborview Analytics", type: "Health informatics" },
  { name: "OpenSignal Foundation", type: "Open science funder" },
] as const;

export function Partners() {
  const reduced = usePrefersReducedMotion();
  const row = [...PARTNERS, ...PARTNERS];

  return (
    <section
      id="partners"
      aria-label="Partners and collaborators"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          align="center"
          eyebrow="Partners"
          title={
            <>
              Built alongside clinics,{" "}
              <em className="not-italic text-coral">not around them</em>.
            </>
          }
          lede="Every model we ship is shaped by the clinicians, researchers, and governance partners who use it."
        />
      </div>

      <Reveal className="mt-14">
        <div className="group relative overflow-hidden border-y border-hairline py-7">
          {reduced ? (
            <div className="flex w-full flex-wrap items-center justify-center gap-x-12 gap-y-8 px-5">
              {PARTNERS.map((partner) => (
                <PartnerBadge key={partner.name} partner={partner} />
              ))}
            </div>
          ) : (
            <div className="flex w-max shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-14 pr-14 group-hover:[animation-play-state:paused]">
              {row.map((partner, i) => (
                <PartnerBadge key={`${partner.name}-${i}`} partner={partner} />
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

      <p className="mx-auto mt-6 max-w-6xl px-5 font-mono text-[11px] text-ink-soft sm:px-8">
        Representative collaborators shown for this prototype.
      </p>
    </section>
  );
}

function PartnerBadge({ partner }: { partner: (typeof PARTNERS)[number] }) {
  return (
    <div className="flex flex-col items-start gap-1 whitespace-nowrap">
      <span className="font-display text-lg font-medium tracking-tight text-ink-soft transition-colors duration-300 hover:text-coral">
        {partner.name}
      </span>
      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-ink-soft opacity-70">
        {partner.type}
      </span>
    </div>
  );
}
