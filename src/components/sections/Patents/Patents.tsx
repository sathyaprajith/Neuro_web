import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { PatentCard, type Patent } from "./PatentCard";

const PATENTS: Patent[] = [
  {
    id: "US 18/412,007",
    status: "Pending",
    title: "System and method for multi-modal biomarker fusion in behavioral health",
    summary:
      "Core pipeline claim covering how behavioral, biological, and cognitive streams are aligned, weighted, and fused into a single calibrated biomarker output.",
    year: 2024,
  },
  {
    id: "US 63/689,441",
    status: "Provisional",
    title: "Confidence-calibrated reporting interface for clinical decision support",
    summary:
      "The honesty layer: interfaces that render model uncertainty alongside every estimate, so clinicians always see what the system does and doesn't know.",
    year: 2025,
  },
  {
    id: "EP 24/201,338",
    status: "Pending",
    title: "On-device extraction of speech features for privacy-preserving analysis",
    summary:
      "Prosody and articulation features computed locally; raw audio never transmitted — enabling vocal-biomarker studies under strict clinical governance.",
    year: 2025,
  },
];

export function Patents() {
  return (
    <section
      id="patents"
      aria-label="Patents"
      className="relative bg-sunken py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Patents & IP"
          title={
            <>
              Protecting the <em className="not-italic text-coral">method</em>,
              sharing the evidence.
            </>
          }
          lede="Our filings cover the fusion machinery and the honesty layer around it — not the data itself, which stays with patients and partners."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PATENTS.map((patent, i) => (
            <Reveal key={patent.id} delay={i * 0.08} className="h-full">
              <PatentCard patent={patent} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <p className="font-mono text-[11px] leading-relaxed text-ink-soft">
            Representative entries shown for this prototype. Filings are pending;
            claims remain under examination.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
