export type SignalStream = "Behavioral" | "Biological" | "Cognitive";

export interface Signal {
  id: string;
  index: string;
  label: string;
  name: string;
  stream: SignalStream;
  focus: string;
  short: string;
  description: string;
  tags: string[];
}

export const signals: Signal[] = [
  {
    id: "motion",
    index: "01",
    label: "Motion",
    name: "Behavioral Signal Analysis",
    stream: "Behavioral",
    focus: "ASD Focus",
    short: "Kinematics quantified, without observer bias.",
    description:
      "Computer vision-driven pose estimation captures body kinematics, gait irregularities, and repetitive motion patterns. Quantified behavioral biomarkers enable early ASD screening and longitudinal tracking without observer bias.",
    tags: ["Pose Estimation", "Kinematic Profiling", "Behavioral Markers"],
  },
  {
    id: "mri",
    index: "02",
    label: "MRI",
    name: "Biological / Structural Analysis",
    stream: "Biological",
    focus: "Neuroimaging",
    short: "Neuroimaging pipelines on clinically annotated cohorts.",
    description:
      "Advanced neuroimaging pipelines extract cortical thickness profiles, volumetric biomarkers, and white matter tractography. Structural and functional MRI data drive AI models validated on annotated clinical cohorts.",
    tags: ["Cortical Thickness", "Tractography", "Volumetric Biomarkers"],
  },
  {
    id: "speech",
    index: "03",
    label: "Speech",
    name: "Cognitive & Thought Pattern Analysis",
    stream: "Cognitive",
    focus: "Schizophrenia Focus",
    short: "A cognitive fingerprint built from speech.",
    description:
      "Prosodic analysis, semantic coherence scoring, and speech rate profiling construct a cognitive speech fingerprint. Disorganized thought patterns and language markers are extracted with NLP pipelines calibrated for psychiatric use.",
    tags: ["Prosody Analysis", "Semantic Coherence", "NLP Profiling"],
  },
  {
    id: "eye",
    index: "04",
    label: "Eye-Tracking",
    name: "Early-Stage Cognitive Markers",
    stream: "Cognitive",
    focus: "Cognitive Screening",
    short: "Gaze dynamics that track neurodevelopment.",
    description:
      "Saccadic velocity, fixation duration, and visual attention mapping reveal subtle cognitive anomalies invisible to clinical observation. Early-stage biomarkers derived from eye-tracking correlate with neurodevelopmental trajectories.",
    tags: ["Saccadic Velocity", "Fixation Mapping", "Attention Profiling"],
  },
  {
    id: "eeg",
    index: "05",
    label: "EEG",
    name: "Neural Oscillation Profiling",
    stream: "Biological",
    focus: "Electrophysiology",
    short: "Real-time neural dynamics, artifact-rejected.",
    description:
      "Alpha/beta band synchrony, P300 event-related potentials, and functional connectivity metrics quantify real-time neural dynamics. EEG signals are artifact-rejected and processed through validated psychiatric biomarker pipelines.",
    tags: ["P300 Response", "Band Synchrony", "Connectivity Metrics"],
  },
];

export function getSignal(id: string): Signal | undefined {
  return signals.find((s) => s.id === id);
}

export const impactStats = [
  {
    value: "1 in 36",
    label: "children diagnosed with ASD",
    sublabel: "CDC 2023 Surveillance Report",
  },
  {
    value: "~24M",
    label: "people affected by Schizophrenia worldwide",
    sublabel: "WHO Global Mental Health Report",
  },
  {
    value: "$1T+",
    label: "annual global economic loss",
    sublabel: "from neurological & psychiatric disorders",
  },
];

export const philosophy = [
  {
    title: "Augment, Not Replace",
    desc: "Our platform serves as a decision-support layer. Clinical specialists remain at the center of every diagnosis and treatment pathway. AI provides structured evidence; clinicians provide judgment.",
  },
  {
    title: "Evidence-First",
    desc: "Every signal modality integrated into our platform is grounded in peer-reviewed research. We do not deploy models without rigorous clinical validation and IRB-approved studies.",
  },
  {
    title: "Signal Transparency",
    desc: "We generate explainable signal reports — not black-box scores. Clinicians see exactly which signals contributed to a recommendation and why.",
  },
  {
    title: "Longitudinal Tracking",
    desc: "Neuropsychiatric care is not episodic. Our platform tracks patient signal profiles over time, enabling clinicians to detect subtle changes invisible to unaided clinical observation.",
  },
];

export const missionQuote =
  "Psychiatry remains one of the least instrumented domains in modern medicine. We are introducing structured signal layers — Behavioral, Biological, and Cognitive — to augment, not replace, specialist-led evaluation.";

export interface Achievement {
  date: string;
  title: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    date: "2026",
    title: "MoU with Total Solution Rehabilitation Society",
    description:
      "MoU signed with Total Solution Rehabilitation Society. Signed by Dr. Pooja Jha Nair, General Secretary, enabling access to annotated clinical datasets and collaborative model development.",
  },
];

export const partnerCategories = [
  {
    label: "Hospitals",
    description:
      "Leading tertiary care hospitals integrating AI-assisted psychiatric decision support into clinical workflows.",
    partners: [{ name: "Coming soon", location: "-" }],
  },
  {
    label: "Clinics",
    description:
      "Specialized psychiatric and neurodevelopmental clinics serving as primary deployment sites for early ASD and schizophrenia screening.",
    partners: [
      { name: "Total Solutions Rehabilitation Society", location: "Hyderabad, India" },
      { name: "Tapadia Diagnostics Centre", location: "Hyderabad, India" },
    ],
  },
  {
    label: "Academic Research",
    description:
      "University research labs and academic institutions providing annotated clinical datasets, validation pipelines, and collaborative AI research.",
    partners: [{ name: "Coming soon", location: "-" }],
  },
];

export const contactInfo = {
  email: "admin@neuroparadigm.in",
  linkedin: "https://www.linkedin.com/company/neuroparadigmpvtltd/",
  instagram: "https://www.instagram.com/neuroparadigm/",
  address:
    "Teleparadigm Towers, SY No 32/A & 32/E2, Near NGIT College, Uppal, Hyderabad, Telangana – 500088",
  tagline: "Bridging Neuroscience & Clinical Intelligence",
};

export const galleryImages = Array.from({ length: 7 }, (_, n) => ({
  src: `/images/gallery/img_${n + 1}.jpeg`,
  alt: `Neuro Paradigm gallery photo ${n + 1}`,
}));
