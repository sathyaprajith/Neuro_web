export interface GalleryEntry {
  id: number;
  src: string;
  alt: string;
  span: string;
}

export const GALLERY_ENTRIES: GalleryEntry[] = [
  { id: 1, src: "/images/gallery/img_1.jpeg", alt: "Neuro Paradigm — team moment", span: "md:col-span-2 md:row-span-2" },
  { id: 2, src: "/images/gallery/img_2.jpeg", alt: "Neuro Paradigm — event", span: "" },
  { id: 3, src: "/images/gallery/img_3.jpeg", alt: "Neuro Paradigm — field work", span: "" },
  { id: 4, src: "/images/gallery/img_4.jpeg", alt: "Neuro Paradigm — collaboration", span: "" },
  { id: 5, src: "/images/gallery/img_5.jpeg", alt: "Neuro Paradigm — session", span: "" },
  { id: 6, src: "/images/gallery/img_6.jpeg", alt: "Neuro Paradigm — on site", span: "" },
  { id: 7, src: "/images/gallery/img_7.jpeg", alt: "Neuro Paradigm — milestone", span: "md:col-span-2" },
];
