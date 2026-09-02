// ─────────────────────────────────────────────────────────────────────────────
// TEAM DATA — this is the ONLY file you need to edit to manage the team.
//
// HOW TO UPDATE A PERSON
//   name     → display name shown on the card
//   role     → small caption under the name (e.g. "Computer Vision")
//   image    → OPTIONAL. Drop a photo into `public/images/team/` and set the
//              path here, e.g. image: "/images/team/aarav.jpg".
//              If omitted (or the file is missing), a generated monogram
//              avatar in the brand palette is rendered instead.
//   linkedin → full profile URL, e.g. "https://www.linkedin.com/in/username"
//   github   → full profile URL, e.g. "https://github.com/username"
//
// The layout and animations adapt automatically — add or remove entries in
// TEAM_MEMBERS below and everything keeps working.
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Optional photo path served from `public/`. Falls back to a monogram avatar. */
  image?: string;
  linkedin: string;
  github: string;
}

export const FOUNDER: TeamMember = {
  id: "founder",
  name: "Founder Name", // ← REPLACE
  role: "Founder",
  // image: "/images/team/founder.jpg", // ← drop the file in public/images/team/, then uncomment
  linkedin: "https://www.linkedin.com/company/neuroparadigmpvtltd/",
  github: "https://github.com/",
};

export const HEAD: TeamMember = {
  id: "head",
  name: "Head Name", // ← REPLACE
  role: "Head",
  // image: "/images/team/head.jpg",
  linkedin: "https://www.linkedin.com/company/neuroparadigmpvtltd/",
  github: "https://github.com/",
};

// Exactly 18 team members — placeholder entries, ready to be replaced 1:1.
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "member-01",
    name: "Team Member 01", // ← REPLACE
    role: "Machine Learning",
    linkedin: "https://www.linkedin.com/", // ← REPLACE with profile URL
    github: "https://github.com/", // ← REPLACE with profile URL
  },
  {
    id: "member-02",
    name: "Team Member 02",
    role: "Computer Vision",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-03",
    name: "Team Member 03",
    role: "Neuroimaging",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-04",
    name: "Team Member 04",
    role: "Clinical Research",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-05",
    name: "Team Member 05",
    role: "Data Engineering",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-06",
    name: "Team Member 06",
    role: "NLP Research",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-07",
    name: "Team Member 07",
    role: "EEG Signal Analysis",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-08",
    name: "Team Member 08",
    role: "Eye-Tracking Research",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-09",
    name: "Team Member 09",
    role: "Speech Processing",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-10",
    name: "Team Member 10",
    role: "Product & Design",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-11",
    name: "Team Member 11",
    role: "Full-Stack Development",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-12",
    name: "Team Member 12",
    role: "MLOps & Infrastructure",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-13",
    name: "Team Member 13",
    role: "Biostatistics",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-14",
    name: "Team Member 14",
    role: "Quality & Compliance",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-15",
    name: "Team Member 15",
    role: "Research Operations",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-16",
    name: "Team Member 16",
    role: "Partnerships",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-17",
    name: "Team Member 17",
    role: "Content & Outreach",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: "member-18",
    name: "Team Member 18",
    role: "Operations",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
];
