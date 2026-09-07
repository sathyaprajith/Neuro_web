import { Reveal } from "../../ui/Reveal";
import { Magnetic } from "../../ui/Magnetic";
import { ArrowUpRightIcon } from "../../ui/icons";

/**
 * Closing band of the Team section — hands the narrative off to Contact Us
 * with a soft radial glow that mirrors the site's StatementBand language.
 */
export function TeamClosing() {
  return (
    <div className="relative mt-16 overflow-hidden sm:mt-20">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 62% at 50% 50%, var(--glow-a), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-coral">
            Want to build with us
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h3 className="mt-6 font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.05] font-medium tracking-[-0.02em] text-balance">
            The next mind in this story{" "}
            <em className="not-italic text-coral">could be yours</em>.
          </h3>
        </Reveal>
        <Reveal delay={0.12}>
          <Magnetic className="mt-9">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white shadow-card transition-transform duration-300 hover:-translate-y-0.5"
            >
              Reach the team
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </div>
  );
}
