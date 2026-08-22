export type SignalStream = "Behavioral" | "Biological" | "Cognitive";

export interface SignalMetric {
  label: string;
  value: string;
  caveat?: string;
}

export interface Signal {
  id: string;
  index: string;
  name: string;
  stream: SignalStream;
  short: string;
  description: string;
  metrics: SignalMetric[];
}

export const signals: Signal[] = [
  {
    id: "gaze",
    index: "01",
    name: "Gaze Dynamics",
    stream: "Cognitive",
    short: "Where attention goes, and how it gets there.",
    description:
      "Eye-tracking during naturalistic viewing captures how attention is deployed — fixation stability, saccade vigor, and the pull toward social versus non-social content. These patterns are measurable in minutes, without asking a single question, which makes them usable across development and across language backgrounds.",
    metrics: [
      {
        label: "Cohort discrimination (ABIDE II)",
        value: "AUC 0.71",
        caveat: "95% CI 0.64–0.77 · n = 388",
      },
      {
        label: "Test–retest reliability",
        value: "ICC 0.83",
        caveat: "Two sessions, 14 days apart",
      },
    ],
  },
  {
    id: "motor",
    index: "02",
    name: "Motor Signatures",
    stream: "Behavioral",
    short: "Movement as a readable, quantifiable behavior.",
    description:
      "Wrist-worn actigraphy and micro-movement analysis extract rhythm, regularity, and variability from ordinary days. A week of passive wear yields a rest–activity profile that correlates with circadian disruption and medication effects — signal that self-report consistently misses.",
    metrics: [
      {
        label: "Rest–activity regularity",
        value: "AUC 0.74",
        caveat: "95% CI 0.68–0.79 · 7-day wear",
      },
      {
        label: "Agreement vs. sleep lab",
        value: "r = 0.79",
        caveat: "Against polysomnography, n = 62",
      },
    ],
  },
  {
    id: "voice",
    index: "03",
    name: "Vocal Prosody",
    stream: "Behavioral",
    short: "How something is said carries its own data.",
    description:
      "Speech acoustics — pitch contour, pause structure, articulation rate — shift measurably with mood and neurodevelopmental state. Features are extracted on-device where possible; raw audio never leaves the device in our clinical pilots, and models are audited for accent and language bias before deployment.",
    metrics: [
      {
        label: "Episode detection (depressive)",
        value: "AUC 0.69",
        caveat: "95% CI 0.61–0.76 · within-subject",
      },
      {
        label: "Cross-language drift audit",
        value: "Δ ≤ 0.04",
        caveat: "English / Spanish / German subsets",
      },
    ],
  },
  {
    id: "sleep",
    index: "04",
    name: "Sleep Architecture",
    stream: "Biological",
    short: "The night record most clinics never see.",
    description:
      "Sleep stage structure is one of the most replicated physiological correlates of psychiatric conditions, yet it rarely enters routine evaluation. We fuse home-EEG with wearable-derived staging to estimate architecture at clinical grade — then report it alongside its uncertainty, because home recordings are noisier than lab ones.",
    metrics: [
      {
        label: "Stage agreement vs. PSG",
        value: "κ 0.71",
        caveat: "4-class staging · n = 112 nights",
      },
      {
        label: "Deep-sleep estimate error",
        value: "±18 min",
        caveat: "Median absolute, per night",
      },
    ],
  },
  {
    id: "autonomic",
    index: "05",
    name: "Autonomic Tone",
    stream: "Biological",
    short: "Heart-rate variability as a stress-system readout.",
    description:
      "HRV summarizes how the autonomic nervous system flexes under load. Fused with sleep and behavioral streams, it helps distinguish anxiety-driven arousal from circadian disruption — a differential that changes treatment. We report HRV features only when recording quality clears pre-registered thresholds.",
    metrics: [
      {
        label: "Stress-state separation",
        value: "AUC 0.72",
        caveat: "95% CI 0.66–0.78 · daytime wear",
      },
      {
        label: "Usable-recording threshold",
        value: "≥ 18 h/day",
        caveat: "Below this, feature withheld",
      },
    ],
  },
];

export function getSignal(id: string): Signal | undefined {
  return signals.find((s) => s.id === id);
}
