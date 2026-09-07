import { useState } from "react";
import { cn } from "../../ui/cn";

interface AvatarProps {
  name: string;
  /** Optional photo path served from `public/`. Falls back to a monogram. */
  image?: string;
  /** CSS custom property name driving the accent tone, e.g. "--coral". */
  accent: string;
  eager?: boolean;
  className?: string;
}

/**
 * Renders the member's photo when available; otherwise a deterministic
 * monogram avatar painted from the site's brand palette.
 */
export function Avatar({ name, image, accent, eager = false, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "NP";

  return (
    <div
      aria-hidden
      className={cn("relative grid h-full w-full place-items-center overflow-hidden", className)}
      style={{
        background:
          `radial-gradient(120% 90% at 18% 10%, color-mix(in srgb, var(${accent}) 36%, transparent), transparent 62%), ` +
          `radial-gradient(110% 90% at 85% 92%, color-mix(in srgb, var(${accent}) 18%, transparent), transparent 58%), ` +
          `var(--bg-sunken)`,
        color: `var(${accent})`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="absolute inset-0 h-full w-full opacity-[0.16]"
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 3" />
        <circle cx="50" cy="50" r="27" stroke="currentColor" strokeWidth="0.4" />
        <path d="M10 76 Q50 56 90 76" stroke="currentColor" strokeWidth="0.4" />
      </svg>
      <span className="relative font-display font-medium tracking-tight">{initials}</span>
    </div>
  );
}
