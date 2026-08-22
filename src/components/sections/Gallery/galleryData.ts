export interface GalleryEntry {
  id: number;
  title: string;
  caption: string;
  hueA: string;
  hueB: string;
  span: string;
}

export const GALLERY_ENTRIES: GalleryEntry[] = [
  {
    id: 1,
    title: "ABIDE preprocessing sprint",
    caption:
      "Versioned fMRI derivatives from the ABIDE II release, checked end-to-end by our Global Scout pipeline.",
    hueA: "#e8674a",
    hueB: "#3d2b3f",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Actigraphy deployment kit",
    caption: "Seven-day wear kits, prepped for pilot families.",
    hueA: "#5c8374",
    hueB: "#241e1a",
    span: "",
  },
  {
    id: 3,
    title: "Clinician co-design session",
    caption: "Confidence dials, argued about for two hours.",
    hueA: "#e8a23d",
    hueB: "#6b5d56",
    span: "",
  },
  {
    id: 4,
    title: "EEG cap fitting day",
    caption: "Home-EEG onboarding at a partner clinic.",
    hueA: "#7ba894",
    hueB: "#3d2b3f",
    span: "",
  },
  {
    id: 5,
    title: "Model card review",
    caption: "Every deployment ships its calibration report.",
    hueA: "#e8674a",
    hueB: "#5c8374",
    span: "md:col-span-2",
  },
];
