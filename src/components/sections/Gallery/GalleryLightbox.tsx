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
          aria-label={entry.title}
        >
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={reduced ? false : { scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.95, y: 12, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-hairline bg-elevated shadow-card"
          >
            <div className="relative aspect-[16/10] w-full">
              <svg
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id={`lb-${entry.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.hueA} />
                    <stop offset="100%" stopColor={entry.hueB} />
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill={`url(#lb-${entry.id})`} />
              </svg>
            </div>
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <h3 className="font-display text-xl font-medium tracking-tight">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {entry.caption}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-coral hover:text-coral"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
