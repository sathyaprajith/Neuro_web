import { ArrowUpRightIcon } from "../../ui/icons";
import { cn } from "../../ui/cn";

export interface Patent {
  id: string;
  status: "Granted" | "Pending" | "Provisional";
  title: string;
  summary: string;
  year: number;
}

interface PatentCardProps {
  patent: Patent;
}

export function PatentCard({ patent }: PatentCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-hairline bg-elevated p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-coral/50 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] uppercase",
            patent.status === "Granted"
              ? "bg-sage-soft text-sage"
              : patent.status === "Pending"
                ? "bg-coral-soft text-coral"
                : "bg-amber-soft text-amber",
          )}
        >
          {patent.status}
        </span>
        <span className="font-mono text-xs text-ink-soft">{patent.year}</span>
      </div>

      <h3 className="mt-5 font-display text-lg leading-snug font-medium tracking-tight text-balance">
        {patent.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
        {patent.summary}
      </p>

      <footer className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
        <span className="font-mono text-xs text-ink-soft transition-colors group-hover:text-coral">
          {patent.id}
        </span>
        <ArrowUpRightIcon
          aria-hidden
          className="h-4 w-4 text-ink-soft opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-coral group-hover:opacity-100"
        />
      </footer>
    </article>
  );
}
