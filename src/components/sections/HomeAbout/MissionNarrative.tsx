import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const STATS = [
  { value: 5, suffix: "", label: "Signal streams fused into one clinical picture" },
  { value: 1900, suffix: "+", label: "Participants contributed to validation cohorts" },
  { value: 3, suffix: "", label: "Open datasets anchoring every published claim" },
  { value: 100, suffix: "%", label: "Models ship with calibration and CI reporting" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || reduced) {
      if (inView) setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

export function MissionNarrative() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div className="max-w-xl">
        <p className="font-display text-2xl leading-snug font-medium tracking-tight sm:text-[2rem]">
          Psychiatry deserves the same evidentiary rigor as every other branch
          of medicine.{" "}
          <span className="text-coral">
            Getting there means measuring carefully — and admitting what we
            don't know.
          </span>
        </p>
        <p className="mt-7 text-base leading-relaxed text-ink-soft">
          NeuroParadigm fuses behavioral, biological, and cognitive data
          streams into objective, quantifiable biomarkers. Our work augments
          specialist-led evaluation in psychiatry and neurodevelopmental care:
          clinicians stay in charge; we hand them signal they can interrogate,
          with confidence intervals attached.
        </p>
        <p className="mt-5 text-base leading-relaxed text-ink-soft">
          Everything we publish is anchored to open science — the ABIDE
          dataset, preprocessed and versioned by our Global Scout pipeline — so
          results can be checked, challenged, and reproduced. When a model is
          uncertain, it says so. That's not hedging. That's honesty doing its
          job.
        </p>
        <blockquote className="mt-8 border-l-2 border-coral pl-5 font-display text-lg italic">
          “A paradigm isn't a promise. It's a lens — and ours shows its work.”
        </blockquote>
      </div>

      <dl className="grid content-start grid-cols-1 gap-x-10 sm:grid-cols-2 lg:pt-14">
        {STATS.map((s) => (
          <div key={s.label} className="border-t border-hairline py-6">
            <dt className="order-last mt-2 block text-sm leading-relaxed text-ink-soft">
              {s.label}
            </dt>
            <dd className="font-display text-4xl font-medium text-coral">
              <CountUp target={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
