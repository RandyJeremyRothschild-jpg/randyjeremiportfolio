/**
 * ─────────────────────────────────────────────────────────────
 *  CV DATA — experience, education, awards and skills.
 * ─────────────────────────────────────────────────────────────
 * The /cv page renders everything from this file. Edit, add or remove
 * entries here; no UI changes needed. Keep entries most-recent-first.
 */

export interface CvExperience {
  id: string;
  role: string;
  company: string;
  /** Freelance, Full-time, Self-employed… */
  type: string;
  period: string;
  /** Optional duration note, e.g. "4 months". */
  duration?: string;
  /** True while the role is ongoing (shows a live indicator). */
  current?: boolean;
  location: string;
  /** On-site / Remote / Hybrid. */
  arrangement?: string;
  description?: string;
  responsibilities?: string[];
}

export interface CvEducation {
  id: string;
  institution: string;
  /** Degree or programme name. */
  degree: string;
  field?: string;
  period: string;
  current?: boolean;
  activities?: string;
}

export interface CvAward {
  id: string;
  title: string;
  issuer: string;
  date: string;
  associatedWith?: string;
  description?: string;
  /**
   * Certificate slot. Leave `src: null` to show a placeholder; put the image in
   * /public/images/certificates/ and set e.g. src: "/images/certificates/ideafest.jpg".
   * Omit `certificate` entirely to hide the slot.
   */
  certificate?: { src: string | null; alt: string };
}

export const cv = {
  /** Short professional introduction shown in the CV header. */
  intro:
    "Graphic designer with freelance and full-time experience creating brand logos, promotional designs and marketing assets, currently pursuing a Bachelor's degree in Informatics at Universitas Ciputra Surabaya. Trained in UI/UX design at Purwadhika Digital Technology School, with a software-engineering background from SMK Telkom and competition results in web design and web development.",

  /**
   * Downloadable PDF. Leave null until a real file exists — the download
   * button only appears once this is set, e.g. "/cv/randy-jeremi-cv.pdf"
   * (place the file in /public/cv/).
   */
  pdfUrl: null as string | null,

  experience: [
    {
      id: "ideafest",
      role: "Technical Crew",
      company: "IdeaFest",
      type: "Freelance",
      period: "Aug 2026",
      duration: "1 month",
      location: "Surabaya, East Java, Indonesia",
      arrangement: "On-site",
      description: "Technical Crew — IDEAFest SUB 2026.",
      responsibilities: [
        "Supported the technical execution and operational readiness of IDEAFest SUB 2026, ensuring smooth event delivery across multiple sessions and activities.",
        "Assisted with technical setup, equipment preparation, venue readiness, and on-site troubleshooting during the event.",
        "Coordinated with the event, creative, and production teams to ensure technical requirements were properly executed according to the event timeline.",
        "Monitored technical conditions during live sessions and responded quickly to operational issues to minimize disruptions.",
        "Developed hands-on experience in event production, technical operations, team coordination, and real-time problem solving within a large-scale creative event environment.",
      ],
    },
    {
      id: "alva",
      role: "Graphic Designer",
      company: "ALVA Technology Resolution",
      type: "Freelance",
      period: "Feb 2026 — Present",
      current: true,
      location: "Medan, North Sumatra, Indonesia",
      arrangement: "Remote",
      description:
        "Operating as a design lab — integrating AI into the creative process to produce promotional visuals that are not only efficient, but strategically aligned with brand growth.",
    },
    {
      id: "delitopia",
      role: "Graphic Designer",
      company: "Delitopia Group",
      type: "Full-time",
      period: "Jan 2025 — Present",
      current: true,
      location: "Surabaya, East Java, Indonesia",
      arrangement: "On-site",
      description:
        "Responsible for creating brand logos, promotional designs, and various marketing assets, prioritizing customer-focused design approaches to ensure engagement and brand relevance.",
    },
    {
      id: "purwadhika-student",
      role: "UI/UX Design Student",
      company: "Purwadhika Digital Technology School",
      type: "Self-employed",
      period: "May 2024 — Aug 2025",
      location: "Surabaya, East Java, Indonesia",
      arrangement: "On-site",
    },
    {
      id: "yelo",
      role: "Graphic Design Intern",
      company: "Yelo Design Studio",
      type: "Full-time",
      period: "May 2023 — Aug 2023",
      duration: "4 months",
      location: "Kecamatan Medan Tuntungan, North Sumatra, Indonesia",
      arrangement: "On-site",
      description: "Completed an apprenticeship as a graphic designer.",
    },
    {
      id: "smk-telkom",
      role: "High School Student",
      company: "SMK Telkom Medan",
      type: "Full-time",
      period: "Jul 2021 — May 2024",
      location: "Medan, North Sumatra, Indonesia",
    },
  ] satisfies CvExperience[] as CvExperience[],

  education: [
    {
      id: "uc",
      institution: "Universitas Ciputra Surabaya",
      degree: "Bachelor's Degree",
      field: "Informatics",
      period: "Aug 2025 — Present",
      current: true,
    },
    {
      id: "purwadhika",
      institution: "Purwadhika Digital Technology School",
      degree: "JOB CONNECTOR UI/UX",
      period: "May 2024 — Aug 2024",
      activities: "Study UI/UX according to industry needs.",
    },
    {
      id: "smk-telkom-1",
      institution: "SMK Telkom 1 Medan",
      degree: "High School Diploma",
      field: "Computer Software Engineering",
      period: "Jun 2021 — May 2024",
      activities: "English Club.",
    },
  ] satisfies CvEducation[] as CvEducation[],

  awards: [
    {
      id: "best-technical-crew",
      title: "Best Technical Crew for IDEAFest SUB 2026",
      issuer: "IDEAFest SUB 2026 & Youth Up",
      date: "Aug 2026",
      associatedWith: "IdeaFest",
      description:
        "Recognition for contributions to technical execution, event operations, equipment preparation, team coordination, and on-site problem solving during IDEAFest SUB 2026.",
      certificate: { src: null, alt: "Certificate — Best Technical Crew, IDEAFest SUB 2026" },
    },
    {
      id: "io-fest-2023",
      title: "3rd Place — Web Development Competition",
      issuer: "BEM FTI Tarumanagara University",
      date: "May 2023",
      description:
        "Won 3rd place with two teammates as part of the FROGTEL team in a web development competition organized by BEM FTI Tarumanagara University during I/O Fest 2023.",
      certificate: { src: null, alt: "Certificate — 3rd Place, Web Development Competition, I/O Fest 2023" },
    },
    {
      id: "sae-web-design",
      title: "First Place — Provincial Web Design Competition for North Sumatra",
      issuer: "SAE Academy",
      date: "Jul 2021",
    },
  ] satisfies CvAward[] as CvAward[],

  /** Add more skills by appending to this list. */
  skills: [
    "Image Design",
    "User Experience (UX)",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Project Management",
    "Collaborative Problem Solving",
    "Landing Pages",
    "User Interface Design",
    "Creative Direction",
    "Logo Design",
    "English",
  ],
};
