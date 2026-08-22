import { NAV_ITEMS } from "./navItems";
import { contactInfo } from "../../data/signals";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-sunken">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            Neuro Paradigm<span className="text-coral">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            AI-assisted clinical decision support for psychiatry and
            neurodevelopmental care — augmenting specialists, never replacing
            them.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={`mailto:${contactInfo.email}`}
              aria-label="Email Neuro Paradigm"
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline font-mono text-[11px] text-ink-soft transition-colors hover:border-coral hover:text-coral"
            >
              @
            </a>
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Neuro Paradigm on LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline font-mono text-[11px] text-ink-soft transition-colors hover:border-coral hover:text-coral"
            >
              in
            </a>
            <a
              href={contactInfo.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Neuro Paradigm on Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline font-mono text-[11px] text-ink-soft transition-colors hover:border-coral hover:text-coral"
            >
              ig
            </a>
          </div>
        </div>
        <nav aria-label="Footer">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink-soft">
            Sections
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-ink-soft transition-colors hover:text-coral"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink-soft">
            Contact
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>
              <a
                href={`mailto:${contactInfo.email}`}
                className="transition-colors hover:text-coral"
              >
                {contactInfo.email}
              </a>
            </li>
            <li>Teleparadigm Towers, Uppal, Hyderabad, Telangana – 500088</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 font-mono text-[11px] tracking-wide text-ink-soft sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Neuro Paradigm. All rights reserved.</p>
          <p>{contactInfo.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
