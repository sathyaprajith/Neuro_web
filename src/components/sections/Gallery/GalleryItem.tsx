import type { GalleryEntry } from "./galleryData";

export function GalleryItem({
  entry,
  onOpen,
}: {
  entry: GalleryEntry;
  onOpen: (entry: GalleryEntry) => void;
}) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-3xl border border-hairline shadow-card ${entry.span}`}
    >
      <button
        type="button"
        onClick={() => onOpen(entry)}
        className="absolute inset-0 h-full w-full cursor-zoom-in text-left"
        aria-label={`Enlarge: ${entry.title}`}
      >
        <span className="absolute inset-0 block transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <svg
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id={`g-${entry.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={entry.hueA} />
                <stop offset="100%" stopColor={entry.hueB} />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill={`url(#g-${entry.id})`} />
            <g fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1">
              {Array.from({ length: 7 }, (_, i) => (
                <path
                  key={i}
                  d={`M-20 ${60 + i * 34} Q 100 ${20 + i * 36}, 200 ${70 + i * 32} T 420 ${50 + i * 34}`}
                  opacity={0.5 - i * 0.05}
                />
              ))}
            </g>
            <g fill="rgba(255,255,255,0.8)">
              {Array.from({ length: 14 }, (_, i) => (
                <circle
                  key={i}
                  cx={((i * 97) % 380) + 10}
                  cy={((i * 61) % 270) + 15}
                  r={i % 3 === 0 ? 2.4 : 1.3}
                  opacity="0.55"
                />
              ))}
            </g>
          </svg>
        </span>
      </button>
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-5 text-white">
        <p className="font-display text-base font-medium">{entry.title}</p>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-white/75">
          {entry.caption}
        </p>
      </figcaption>
    </figure>
  );
}
