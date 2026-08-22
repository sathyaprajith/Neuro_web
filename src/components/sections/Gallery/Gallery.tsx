import { useState } from "react";
import { SectionHeader } from "../../ui/SectionHeader";
import { Reveal } from "../../ui/Reveal";
import { GalleryItem } from "./GalleryItem";
import { GalleryLightbox } from "./GalleryLightbox";
import { GALLERY_ENTRIES, type GalleryEntry } from "./galleryData";

export function Gallery() {
  const [selected, setSelected] = useState<GalleryEntry | null>(null);

  return (
    <section
      id="gallery"
      aria-label="Gallery"
      className="relative bg-sunken py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="04 · Gallery"
          title={
            <>
              Field notes from{" "}
              <em className="not-italic text-coral">the work itself</em>.
            </>
          }
          lede="A glimpse into our team, events, and the real-world impact of our research."
        />

        <Reveal className="mt-14" delay={0.05}>
          <div className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:auto-rows-[200px] md:grid-cols-4">
            {GALLERY_ENTRIES.map((entry) => (
              <GalleryItem key={entry.id} entry={entry} onOpen={setSelected} />
            ))}
          </div>
        </Reveal>
      </div>

      <GalleryLightbox entry={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

