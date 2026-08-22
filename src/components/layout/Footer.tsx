import { NAV_ITEMS } from "./navItems";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-sunken">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            NeuroParadigm<span className="text-coral">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            Science that shows its work. Multi-modal signal fusion for
            psychiatry and neurodevelopmental care — honest about confidence,
            built to augment clinicians.
          </p>
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
                href="mailto:hello@neuroparadigm.health"
                className="transition-colors hover:text-coral"
              >
                hello@neuroparadigm.health
              </a>
            </li>
            <li>Pilot network HQ — Portland, OR</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 font-mono text-[11px] tracking-wide text-ink-soft sm:flex-row sm:px-8">
          <p>© 2026 NeuroParadigm Research</p>
          <p>Built for specialists, with humility.</p>
        </div>
      </div>
    </footer>
  );
}
