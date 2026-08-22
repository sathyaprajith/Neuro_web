import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signals } from "../../../data/signals";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { ChevronDownIcon } from "../../ui/icons";
import { cn } from "../../ui/cn";

const STREAM_STYLES: Record<string, string> = {
  Behavioral: "bg-coral-soft text-coral",
  Biological: "bg-sage-soft text-sage",
  Cognitive: "bg-amber-soft text-amber",
};

export function SignalDetails() {
  const [openId, setOpenId] = useState<string | null>(signals[0]?.id ?? null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!signals.some((s) => s.id === id)) return;
      setOpenId(id);
    };
    window.addEventListener("np:open-signal", onOpen);
    return () => window.removeEventListener("np:open-signal", onOpen);
  }, []);

  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {signals.map((signal) => {
        const open = openId === signal.id;
        return (
          <div key={signal.id} id={`signal-${signal.id}`} className="scroll-mt-24">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : signal.id)}
              aria-expanded={open}
              className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6"
            >
              <span className="font-mono text-[11px] text-ink-soft">
                {signal.index}
              </span>
              <span
                className={cn(
                  "font-display text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-coral sm:text-2xl",
                  open && "text-coral",
                )}
              >
                {signal.name}
              </span>
              <span
                className={cn(
                  "hidden rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] uppercase sm:inline-block",
                  STREAM_STYLES[signal.stream],
                )}
              >
                {signal.stream}
              </span>
              <span className="ml-auto hidden max-w-[220px] text-right text-xs text-ink-soft lg:block">
                {signal.short}
              </span>
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 shrink-0 text-ink-soft transition-transform duration-300",
                  open && "-rotate-180 text-coral",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 pb-8 pl-9 pr-1 sm:pl-12 md:grid-cols-[1.25fr_1fr] md:gap-10">
                    <p className="text-[15px] leading-relaxed text-ink-soft">
                      {signal.description}
                    </p>
                    <ul className="space-y-3">
                      {signal.metrics.map((metric) => (
                        <li
                          key={metric.label}
                          className="rounded-2xl border border-hairline bg-elevated p-4 shadow-card"
                        >
                          <p className="text-xs text-ink-soft">{metric.label}</p>
                          <p className="mt-1 font-mono text-lg font-medium text-sage">
                            {metric.value}
                          </p>
                          {metric.caveat && (
                            <p className="mt-1 font-mono text-[10px] leading-relaxed text-ink-soft">
                              {metric.caveat}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
