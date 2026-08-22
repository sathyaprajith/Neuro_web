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
        aria-label={`Enlarge photo ${entry.id}`}
      >
        <img
          src={entry.src}
          alt={entry.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25"
        />
      </button>
      <figcaption className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[9px] tracking-widest text-white/85 uppercase backdrop-blur-sm">
        NP · {String(entry.id).padStart(2, "0")}
      </figcaption>
    </figure>
  );
}
