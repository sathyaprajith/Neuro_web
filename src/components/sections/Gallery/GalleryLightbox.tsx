import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryEntry } from "./galleryData";
import { CloseIcon } from "../../ui/icons";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

interface GalleryLightboxProps {
  entry: GalleryEntry | null;
  onClose: () => void;
}

export function GalleryLightbox({ entry, onClose }: GalleryLightboxProps) {
  const reduced = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!entry) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [entry, onClose]);

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-5"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${entry.id}`}
        >
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.figure
            initial={reduced ? false : { scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.95, y: 12, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[86vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-card"
          >
            <img
              src={entry.src}
              alt={entry.alt}
              className="max-h-[74vh] w-full object-contain"
            />
            <figcaption className="flex items-center justify-between px-5 py-4">
              <span className="font-mono text-[10px] tracking-[0.24em] text-white/70 uppercase">
                Neuro Paradigm · {String(entry.id).padStart(2, "0")} / 07
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-coral hover:text-coral"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
