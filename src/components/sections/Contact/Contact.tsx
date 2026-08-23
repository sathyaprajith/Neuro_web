import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { ContactForm } from "./ContactForm";
import { GlobeMap } from "./GlobeMap";
import { MailIcon } from "../../ui/icons";
import { contactInfo } from "../../../data/signals";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="05 · Contact"
          title={
            <>
              Research collaborations, clinical partnerships,{" "}
              <em className="not-italic text-coral">or general inquiries</em>.
            </>
          }
          lede="We'd love to connect."
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="flex flex-col gap-8">
            <a
              href={`mailto:${contactInfo.email}`}
              className="group flex items-center gap-4 rounded-3xl border border-hairline bg-elevated p-6 shadow-card transition-colors duration-300 hover:border-coral/50"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-coral-soft text-coral">
                <MailIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-mono text-xs tracking-[0.22em] uppercase text-ink-soft">
                  Email
                </span>
                <span className="block text-sm font-medium group-hover:text-coral">
                  {contactInfo.email}
                </span>
              </span>
            </a>

            <div className="flex gap-3">
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Neuro Paradigm on LinkedIn"
                className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-elevated font-mono text-xs font-semibold text-ink-soft shadow-card transition-colors duration-300 hover:border-coral hover:text-coral"
              >
                in
              </a>
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Neuro Paradigm on Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-elevated font-mono text-xs font-semibold text-ink-soft shadow-card transition-colors duration-300 hover:border-coral hover:text-coral"
              >
                ig
              </a>
            </div>

            <Reveal delay={0.06}>
              <GlobeMap />
            </Reveal>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}



