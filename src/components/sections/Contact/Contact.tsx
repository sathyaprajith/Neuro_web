import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { ContactForm } from "./ContactForm";
import { LocationMap } from "./LocationMap";
import { MailIcon } from "../../ui/icons";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Contact"
          title={
            <>
              Talk to a human on{" "}
              <em className="not-italic text-coral">our research team</em>.
            </>
          }
          lede="Clinicians, researchers, and potential pilot partners — we read everything ourselves."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="flex flex-col gap-8">
            <a
              href="mailto:hello@neuroparadigm.health"
              className="group flex items-center gap-4 rounded-3xl border border-hairline bg-elevated p-6 shadow-card transition-colors duration-300 hover:border-coral/50"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-coral-soft text-coral">
                <MailIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
                  Email
                </span>
                <span className="block text-sm font-medium group-hover:text-coral">
                  hello@neuroparadigm.health
                </span>
              </span>
            </a>
            <LocationMap />
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
